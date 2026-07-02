import React, { useState } from "react";

const AddUrl = ({ onAddUrl }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url.trim()) {
      onAddUrl(url);
      setUrl("");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mb-4 flex items-center justify-between"
    >
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="e.g. https://www.example.com"
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[80%]"
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
