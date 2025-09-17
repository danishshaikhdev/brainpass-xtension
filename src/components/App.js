import React, { useEffect, useState } from "react";
import AddUrl from "./AddUrl";
import UrlLists from "./UrlLists";

const App = () => {
  const [blockedUrls, setBlockedUrls] = useState([]);

  //   useEffect(() => {
  //     chrome.storage.local.get(['blockedSites'], (result) => {
  //         setBlockedUrls(result.blockedSites || []);
  //     })
  //   }, []);

  const handleAddUrl = (url) => {
    console.log(`Adding URL: ${url}`);
    // You can manually add to state for now to test the UI
    setBlockedUrls([...blockedUrls, url]);
    /*
    chrome.runtime.sendMessage({ type: 'ADD_URL', url }, (response) => {
      if (response && response.success) {
        setBlockedUrls(response.urls);
      }
    });
    */
  };

  const handleDeleteUrl = (url) => {
    console.log(`Deleting URL: ${url}`);
    // Manually filter state to test the UI
    setBlockedUrls(blockedUrls.filter((u) => u !== url));
    /*
    chrome.runtime.sendMessage({ type: 'DELETE_URL', url }, (response) => {
      if (response && response.success) {
        setBlockedUrls(response.urls);
      }
    });
    */
  };

  return (
    <div className="p-4 w-70">
      <h1 className="text-3xl font-bold mb-4 text-center">BrainPass</h1>
      <AddUrl className="mb-4" onAddUrl={handleAddUrl} />
      <UrlLists className="mb-4" blockedSites={blockedUrls} onDeleteUrl={handleDeleteUrl} />
    </div>
  );
};

export default App;
