import React, { useState } from "react";
import Home from "./Home";
import Settings from "./Settings";

const HomeIcon = ({ active }) => (
  <svg
    className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-400"}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5"
    />
  </svg>
);

const GearIcon = ({ active }) => (
  <svg
    className={`w-5 h-5 ${active ? "text-indigo-600" : "text-slate-400"}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.3 3.3a1 1 0 0 1 .95-.7h1.5a1 1 0 0 1 .95.7l.35 1.1a7 7 0 0 1 1.5.87l1.12-.35a1 1 0 0 1 1.16.45l.75 1.3a1 1 0 0 1-.2 1.2l-.85.8a7 7 0 0 1 0 1.74l.85.8a1 1 0 0 1 .2 1.2l-.75 1.3a1 1 0 0 1-1.16.45l-1.12-.35a7 7 0 0 1-1.5.87l-.35 1.1a1 1 0 0 1-.95.7h-1.5a1 1 0 0 1-.95-.7l-.35-1.1a7 7 0 0 1-1.5-.87l-1.12.35a1 1 0 0 1-1.16-.45l-.75-1.3a1 1 0 0 1 .2-1.2l.85-.8a7 7 0 0 1 0-1.74l-.85-.8a1 1 0 0 1-.2-1.2l.75-1.3a1 1 0 0 1 1.16-.45l1.12.35a7 7 0 0 1 1.5-.87l.35-1.1Z"
    />
    <circle cx="12" cy="12" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors relative ${
      active ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {icon}
    {label}
    {active && (
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-indigo-600 rounded-full" />
    )}
  </button>
);

const App = () => {
  const [tab, setTab] = useState("home");

  return (
    <div className="w-[380px] min-h-[500px] bg-slate-50 text-slate-800 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-xl">
            🧠
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight">BrainPass</h1>
            <p className="text-xs text-indigo-100">
              Focus first. Earn your screen time.
            </p>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="flex bg-white border-b border-slate-200">
        <TabButton
          active={tab === "home"}
          onClick={() => setTab("home")}
          icon={<HomeIcon active={tab === "home"} />}
          label="Home"
        />
        <TabButton
          active={tab === "settings"}
          onClick={() => setTab("settings")}
          icon={<GearIcon active={tab === "settings"} />}
          label="Settings"
        />
      </nav>

      {/* Content — Settings is remounted each visit so it always re-locks. */}
      <main className="flex-1 p-4">
        {tab === "home" ? <Home /> : <Settings onLeave={() => setTab("home")} />}
      </main>

      <footer className="px-5 py-2 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        BrainPass · Parental focus control
      </footer>
    </div>
  );
};

export default App;
