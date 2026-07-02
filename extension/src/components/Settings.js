import React, { useState } from "react";
import AuthGate from "./AuthGate";
import SettingsPanel from "./SettingsPanel";

// Gate around the settings panel. App remounts this component every time the
// user opens the Settings tab, so `authed` always starts false — the parent
// must log in again on each visit.
const Settings = ({ onLeave }) => {
  const [authed, setAuthed] = useState(false);

  if (!authed) {
    return <AuthGate onAuthed={() => setAuthed(true)} />;
  }
  return <SettingsPanel onDone={onLeave} />;
};

export default Settings;
