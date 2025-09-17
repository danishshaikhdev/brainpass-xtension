import React from "react";

const UrlLists = () => {
  return (
    <div>
      <h3>Blocked URLs</h3>
      <ul>
        {urls.map((url, index) => {
          <li key={index}>{url}</li>;
        })}
      </ul>
    </div>
  );
};

export default UrlLists;
