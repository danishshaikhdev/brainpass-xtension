import React, { useState } from "react";

// Generate a simple arithmetic problem the user must solve to prove intent.
const makeProblem = () => {
  const a = Math.floor(Math.random() * 40) + 10;
  const b = Math.floor(Math.random() * 40) + 10;
  return { a, b, answer: a + b };
};

// The site the user was trying to reach (passed by the background script).
const target = new URLSearchParams(window.location.search).get("target");
const targetHost = (() => {
  try {
    return new URL(target).hostname;
  } catch {
    return "";
  }
})();

const Quiz = () => {
  const [problem, setProblem] = useState(makeProblem);
  const [input, setInput] = useState("");
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (Number(input) !== problem.answer) {
      // Wrong answer: show an error and hand out a fresh problem.
      setError(true);
      setProblem(makeProblem());
      setInput("");
      return;
    }

    setError(false);

    if (target) {
      // Ask the background to unlock this site for 30 minutes, then go back.
      chrome.runtime.sendMessage({ type: "GRANT_PASS", url: target }, () => {
        window.location.replace(target);
      });
    } else {
      setSolved(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">BrainPass</h1>

        {solved ? (
          <>
            <p className="text-green-600 font-semibold mb-6">
              Nice work! You may go back to your task now.
            </p>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close this tab
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-1">
              {targetHost ? `${targetHost} is blocked.` : "This site is blocked."}
            </p>
            <p className="text-gray-400 text-sm mb-6">
              Solve the problem to unlock it for 30 minutes.
            </p>
            <p className="text-2xl font-semibold mb-4">
              {problem.a} + {problem.b} = ?
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
              <input
                type="number"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                autoFocus
                placeholder="Your answer"
                className="border border-gray-300 rounded-md px-3 py-2 mb-3 w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {error && (
                <p className="text-red-500 text-sm mb-3">
                  Incorrect — here is a new problem.
                </p>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Quiz;
