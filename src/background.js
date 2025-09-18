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

        chrome.storage.local.set({ [blockedUrlsKey]: urls }, () => {
          coonsole.log(`URL added: ${newUrl}`);

          // Dynamically add a declarativeNetRequest rule
          const newRule = {
            id: 100, // A unique ID for the rule
            priority: 1,
            action: {
              type: "redirect",
              redirect: {
                extensionPath: "/public/quiz.html",
              },
            },
            condition: {
              urlFilter: `*://`,
              resourceTypes: ["main_frame"],
            },
          };

          chrome.declarativeNetRequest.updateDynamicRules({
            addRules: [rule],
          });

          sendResponse({ success: true, urls: urls });
        });
      } else {
        sendResponse({ success: false, message: "URL already blocked" });
      }
    });
    return true;
  }

  else if (request.type === "DELETE_URL") {

    // Retrieve the current list of blocked URLs
    chrome.storage.local.get([blockedUrlsKey], (result) => {
      let urls = result.blockedUrls || [];

      // Create a new array that excludes the URL to be deleted
      const updatedUrls = urls.filter((url) => url !== request.url);

      // Dynamically remove the rule
      chrome.declarativeNetRequest.updateDynamicRules((rules) => {
        const ruleToRemove = rules.find(rule => rule.condition.urlFilter.includes(request.url));
        if (ruleToRemove) {
          chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [ruleToRemove.id] });
        }
      });

      // Save the new list back to storage
      chrome.storage.local.set({ [blockedUrlsKey]: updatedUrls }, () => {
        console.log(`URL deleted: ${request.url}`);
        // Send a success response back to the popup with the updated list
        sendResponse({ success: true, urls: updatedUrls });
      });
    });
    return true;
  }
});
