import React from "react";
import { useBlockedSites, usePassDuration } from "../hooks";
import AddUrl from "./AddUrl";
import UrlLists from "./UrlLists";

const DURATION_OPTIONS = [
  { value: 1, label: "1 minute (testing)" },
  { value: 15, label: "15 minutes" },
  { value: 30, label: "30 minutes" },
  { value: 45, label: "45 minutes" },
  { value: 60, label: "1 hour" },
];

const SettingsPanel = ({ onDone }) => {
  const { sites, add, remove } = useBlockedSites();
  const [duration, setDuration] = usePassDuration();

  return (
    <div className="space-y-4">
      {/* Blocked sites */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-700 mb-3">
          Blocked sites
        </h2>
        <AddUrl onAddUrl={add} />
        <div className="mt-3">
          <UrlLists blockedSites={sites} onDeleteUrl={remove} />
        </div>
      </section>

      {/* Access time */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <h2 className="text-sm font-semibold text-slate-700">
          Access time after quiz
        </h2>
        <p className="text-xs text-slate-500 mt-1 mb-3">
          How long a child can stay on a site after passing the quiz.
        </p>
        <select
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </section>

      {/* Leaving re-locks the UI (next Settings visit needs login again) but
          keeps the Supabase session so the background can keep blocking. */}
      <button
        onClick={onDone}
        className="w-full py-2.5 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
      >
        Done — lock settings
      </button>
    </div>
  );
};

export default SettingsPanel;
