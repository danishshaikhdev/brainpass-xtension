# BrainPass — Chrome extension

React + Parcel Chrome extension (Manifest V3). Talks to Supabase for auth and
data; the quiz page is served locally by the extension.

## Setup

```bash
cp .env.example .env      # then paste your Supabase URL + anon key
npm install
npm run build             # outputs to build/
```

Load it in Chrome: `chrome://extensions` → enable **Developer mode** →
**Load unpacked** → select the `build/` folder. After code changes, run
`npm run build` again and click the extension's **reload** ↻.

`npm run dev` rebuilds on change (watch mode); you still reload in Chrome.

## Folder guide

```
src/
├── popup.js            entry: renders the popup React app
├── quiz.js             entry: renders the quiz page
├── background.js       service worker — the always-on blocker (see file header)
├── index.css           Tailwind entry
│
├── lib/                framework-free logic (no React) — the "model" layer
│   ├── config.js           reads SUPABASE_URL / SUPABASE_ANON_KEY from .env
│   ├── supabaseClient.js    the one shared Supabase client
│   ├── chromeStorageAdapter.js  lets Supabase persist the session in chrome.storage
│   ├── auth.js             signUp / signIn / signOut / getCurrentUser
│   ├── sites.js            list / add / remove blocked sites
│   ├── settings.js         get / set the access window
│   └── domain.js           pure URL/domain helpers (normalize, match)
│
├── hooks.js            React hooks bridging components ↔ lib (useBlockedSites, …)
│
└── components/         the UI — each file is one focused piece
    ├── App.js              shell: header + Home/Settings tabs
    ├── Home.js             dashboard (read-only overview)
    ├── Settings.js         auth gate → SettingsPanel
    ├── AuthGate.js         Supabase login / signup form
    ├── SettingsPanel.js    manage blocklist + access window
    ├── AddUrl.js           add-a-site input
    ├── UrlLists.js         list of blocked sites with delete
    └── Quiz.js             the quiz shown on a blocked site
```

## Layering (why it's easy to follow)

```
components (UI)  →  hooks (React glue)  →  lib (logic)  →  Supabase / chrome.*
```

- **Components** never import Supabase directly — they use hooks.
- **lib/** has no React and no UI — pure, reusable functions.
- Want to change how data is stored? Touch `lib/` only. Change the look? Touch
  `components/` only.

## Notes

- The **background worker** reads the blocklist from Supabase using the parent's
  persisted session, caches it in `chrome.storage.session` (RAM only), and
  redirects blocked visits to `public/quiz.html`. Full explanation is in the
  header comment of `src/background.js`.
- The quiz currently uses locally generated math problems. Swapping in the
  [Open Trivia DB](https://opentdb.com) API later only means editing
  `components/Quiz.js`.
