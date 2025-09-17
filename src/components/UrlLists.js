import React from "react";

const UrlLists = ({ blockedSites, onDeleteUrl }) => {
  if (blockedSites.length === 0) {
    return <p className="text-gray-500 text-center">No blocked URLs found.</p>;
  }

  return (
    <div className="border border-gray-300 rounded-md p-1 bg-gray-50">
      <h3 className="text-lg text-center font-semibold mb-2">Blocked URLs</h3>
      <ul>
        {blockedSites.map((blockedSite, index) => {
          return (
            <li
              key={index}
              className="border border-gray-300 py-1 px-2 rounded flex justify-between items-center mb-2 bg-white"
            >
              {blockedSite}

              <button className="text-red-500" onClick={() => onDeleteUrl(blockedSite)}>delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UrlLists;
