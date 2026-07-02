import React from "react";

const UrlLists = ({ blockedSites, onDeleteUrl }) => {
  if (blockedSites.length === 0) {
    return (
      <p className="text-sm text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
        No blocked sites yet.
      </p>
    );
  }

  return (
    <ul className="max-h-52 overflow-y-auto space-y-2">
      {blockedSites.map((site) => (
        <li
          key={site}
          className="flex items-center justify-between gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-slate-50"
        >
          <span className="flex items-center gap-2.5 text-sm text-slate-700 truncate">
            <span className="w-6 h-6 shrink-0 rounded-md bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 uppercase">
              {site[0]}
            </span>
            <span className="truncate">{site}</span>
          </span>
          <button
            onClick={() => onDeleteUrl(site)}
            aria-label={`Remove ${site}`}
            className="shrink-0 text-slate-400 hover:text-red-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5h6v2m-8 0 .5 12a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1L17 7" />
            </svg>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default UrlLists;
