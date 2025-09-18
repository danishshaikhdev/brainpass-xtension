// src/background.js

console.log("BrainPass Background Script is running.");

// Define a constant for the storage key to avoid typos
const blockedUrlsKey = "blockedUrls";

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check the type of the message to determine the action
  if (request.type === "ADD_URL") {
    // Retrieve the current list of blocked URLs from local storage
    chrome.storage.local.get([blockedUrlsKey], (result) => {
      let urls = result.blockedUrls || [];

      const newUrl = request.url
        .replace(/^(https?:\/\/)?(www\.)?/, "")
        .split("/")[0];

      if (!urls.includes(newUrl)) {
        urls.push(newUrl);

        // Use getDynamicRules to find the next available ID
        chrome.declarativeNetRequest.getDynamicRules((existingRules) => {
          const newRuleId =
            existingRules.length > 0
              ? Math.max(...existingRules.map((r) => r.id)) + 1
              : 1;

          // Dynamically add a declarativeNetRequest rule
          const newRule = {
            id: newRuleId, // A unique ID for the rule
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                extensionPath: "public/quiz.html",
              },
            },
            condition: {
              urlFilter: `*://*${newUrl}/*`,
              resourceTypes: ["main_frame"],
            },
          };

          chrome.declarativeNetRequest
            .updateDynamicRules({
              addRules: [newRule],
            })
            .then(() => {
              chrome.storage.local.set({ [blockedUrlsKey]: urls }, () => {
                console.log(`URL added: ${newUrl}`);
                sendResponse({ success: true, urls: urls });
              });
            });
        });
      } else {
        sendResponse({ success: false, message: "URL already blocked" });
      }
    });
    return true;
  } else if (request.type === "DELETE_URL") {
    // Retrieve the current list of blocked URLs
    chrome.storage.local.get([blockedUrlsKey], (result) => {
      let urls = result.blockedUrls || [];

      // Create a new array that excludes the URL to be deleted
      const updatedUrls = urls.filter((url) => url !== request.url);

      // Dynamically remove the rule
      chrome.declarativeNetRequest.getDynamicRules((rules) => {
        const ruleToRemove = rules.find((rule) =>
          rule.condition.urlFilter.includes(request.url)
        );
        if (ruleToRemove) {
          // Pass the ID of the rule to remove
          chrome.declarativeNetRequest
            .updateDynamicRules({
              removeRuleIds: [ruleToRemove.id],
            })
            .then(() => {
              // Save the new list back to storage
              chrome.storage.local.set(
                { [blockedUrlsKey]: updatedUrls },
                () => {
                  console.log(`URL deleted: ${request.url}`);
                  // Send a success response back to the popup with the updated list
                  sendResponse({ success: true, urls: updatedUrls });
                }
              );
            });
        } else {
          // If the rule wasn't found, just update storage
          chrome.storage.local.set({ [blockedUrlsKey]: updatedUrls }, () => {
            console.log(`URL deleted: ${request.url}`);
            sendResponse({ success: true, urls: updatedUrls });
          });
        }
      });
    });
    return true;
  }
});
