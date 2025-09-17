import React from "react";
import ReactDOM from "react-dom/client";
import Quiz from "./components/Quiz";
import App from "./components/App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("quiz-root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
