# BrainPass 🧠

A Chrome extension that helps kids build focus: blocked sites redirect to a
quiz, and passing it unlocks the site for a parent-defined window (e.g. 30 min).
Parents manage everything from a password-protected Settings screen, backed by
Supabase so the rules can't be wiped from the browser.

## Repository layout

```
brainpass-xtension/
├── extension/     ← the Chrome extension (UI, background worker, quiz)
├── supabase/      ← database schema: one SQL migration per table
└── README.md      ← you are here
```

Two independent parts:

| Part          | What it is                          | How to run it                     |
| ------------- | ----------------------------------- | --------------------------------- |
| `extension/`  | The browser extension (React + Parcel) | `npm run build`, load `build/` in Chrome |
| `supabase/`   | SQL migrations for your Supabase DB | run the SQL in the Supabase dashboard |

## Quick start

1. **Set up the database** — see [`supabase/README.md`](supabase/README.md).
   Create a Supabase project and run the migrations.
2. **Configure the extension** — copy `extension/.env.example` to
   `extension/.env` and paste your Supabase URL + anon key.
3. **Build & load** — see [`extension/README.md`](extension/README.md).

## How it works (the 30-second version)

```
Child visits youtube.com
        │
        ▼
background worker sees a blocked domain (list synced from Supabase)
        │  no active pass?
        ▼
redirect tab → quiz page (public/quiz.html?target=…)
        │  child solves the quiz
        ▼
GRANT_PASS → unlock domain for N minutes → send child back to the site
        │  N minutes later (chrome.alarms)
        ▼
pass expires → site blocks again
```

Parents change the blocklist and the access window in **Settings**, which is
gated by a Supabase login every time it's opened.
