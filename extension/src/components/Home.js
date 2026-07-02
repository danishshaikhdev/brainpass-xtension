import React from "react";
import { useBlockedSites, usePassDuration } from "../hooks";

const StatCard = ({ label, value, accent }) => (
  <div className="flex-1 bg-white rounded-xl border border-slate-200 p-3 shadow-sm">
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
  </div>
);

const Home = () => {
  const { sites: blockedUrls } = useBlockedSites();
  const [duration] = usePassDuration();

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-lg">
          ✓
        </div>
        <div>
          <p className="font-semibold text-sm">Protection is active</p>
          <p className="text-xs text-slate-500">
            Blocked sites redirect to a quiz.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-3">
        <StatCard
          label="Sites blocked"
          value={blockedUrls.length}
          accent="text-indigo-600"
        />
        <StatCard
          label="Access window"
          value={`${duration}m`}
          accent="text-violet-600"
        />
      </div>

      {/* Blocked list (read-only preview) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Blocked sites</h2>
        </div>

        {blockedUrls.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">
            No sites blocked yet.
            <br />
            Add some from the Settings tab.
          </p>
        ) : (
          <ul className="max-h-48 overflow-y-auto divide-y divide-slate-100">
            {blockedUrls.map((site) => (
              <li
                key={site}
                className="px-4 py-2.5 flex items-center gap-2.5 text-sm text-slate-700"
              >
                <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-semibold text-slate-500 uppercase">
                  {site[0]}
                </span>
                {site}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        Manage blocked sites &amp; access time in{" "}
        <span className="font-medium text-slate-500">Settings</span>.
      </p>
    </div>
  );
};

export default Home;
