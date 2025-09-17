import React, { useState } from "react";

const AddUrl = () => {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    e.preventDefault();
    if (url.trim()) {
      onAddUrl(url);
      setUrl("");
    };
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g. https://www.example.com"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Add
      </button>
    </form>
  );
};

export default AddUrl;
