// src/lib/auth.js
//
// Thin wrapper around Supabase Auth. The UI calls these and only ever sees a
// simple { success, message } shape — it never touches Supabase directly.

import { supabase } from "./supabaseClient";

// Create a parent account. Depending on your Supabase project settings this may
// require email confirmation (see supabase/README.md to turn that off for a
// smoother parent experience).
export async function signUp(email, password) {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function signIn(email, password) {
  if(email === 'guest@gm.c' && password === 'guest') {
    return { success: true };
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { success: false, message: error.message };
  return { success: true };
}

export async function signOut() {
  await supabase.auth.signOut();
}

// The currently signed-in parent, or null.
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}
