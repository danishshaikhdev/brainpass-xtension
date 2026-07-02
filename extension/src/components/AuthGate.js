import React, { useState } from "react";
import { signIn, signUp } from "../lib/auth";

// Parent login / signup shown before Settings. Defaults to login; a link lets a
// first-time parent switch to signup. Credentials go straight to Supabase Auth.
const AuthGate = ({ onAuthed }) => {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const isSignup = mode === "signup";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setNotice("");
    setPassword("");
    setConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (isSignup) {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }

    setBusy(true);
    const res = isSignup
      ? await signUp(email, password)
      : await signIn(email, password);
    setBusy(false);

    if (!res.success) {
      setError(res.message);
      return;
    }

    if (isSignup) {
      // If the Supabase project requires email confirmation, there's no session
      // yet — ask them to confirm, then log in. Otherwise login works right away.
      setNotice("Account created. If prompted, confirm your email, then log in.");
      switchMode("login");
      return;
    }
    onAuthed();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-col items-center text-center mb-4">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="5" y="11" width="14" height="9" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="font-semibold text-slate-800">
          {isSignup ? "Create parent account" : "Parent login"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Only parents can change these settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          autoFocus
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        {isSignup && (
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
        {notice && <p className="text-sm text-emerald-600">{notice}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-60"
        >
          {busy ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="text-center text-xs text-slate-500 mt-4">
        {isSignup ? "Already have an account?" : "First time here?"}{" "}
        <button
          onClick={() => switchMode(isSignup ? "login" : "signup")}
          className="text-indigo-600 font-medium hover:underline"
        >
          {isSignup ? "Log in" : "Create one"}
        </button>
      </p>
    </div>
  );
};

export default AuthGate;
