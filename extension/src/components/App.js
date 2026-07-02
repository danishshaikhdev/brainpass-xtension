import React, { useEffect, useState } from "react";
import AddUrl from "./AddUrl";
import UrlLists from "./UrlLists";

const App = () => {
  const [blockedUrls, setBlockedUrls] = useState([]);

  useEffect(() => {
    // 1. Initial fetch of data when the component mounts.
    chrome.storage.local.get(["blockedUrls"], (result) => {
      setBlockedUrls(result.blockedUrls || []);
    });
  }, []);

  const handleAddUrl = (url) => {
    // Optimistically updates the UI by adding the new URL to the state immediately.
    setBlockedUrls([...blockedUrls, url]);

    // Sends a message to the background script to save the URL to storage.
    chrome.runtime.sendMessage({ type: "ADD_URL", url }, (response) => {
      // After the background script responds, it updates the state with the confirmed list from storage.
      if (response && response.success) {
        setBlockedUrls(response.urls);
      }
    });
  };

  const handleDeleteUrl = (url) => {
    // Optimistically updates the UI by removing the URL from the state immediately.
    setBlockedUrls(blockedUrls.filter((u) => u !== url));

    // Sends a message to the background script to remove the URL from storage.
    chrome.runtime.sendMessage({ type: "DELETE_URL", url }, (response) => {
      // After the background script responds, it updates the state with the confirmed list from storage.
      if (response && response.success) {
        setBlockedUrls(response.urls);
      }
    });
  };

  return (
    <div className="w-70">
      <div className="px-4 py-4 border border-gray-300 mb-4 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold">BrainPass</h1>
      </div>
      <div className="p-4">
        <AddUrl className="mb-4" onAddUrl={handleAddUrl} />
        <UrlLists
          className="mb-4"
          blockedSites={blockedUrls}
          onDeleteUrl={handleDeleteUrl}
        />
      </div>
    </div>
  );
};

export default App;
