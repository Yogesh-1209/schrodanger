import { createContext, useContext, useMemo, useState } from "react";
import { currentUser, platforms as defaultPlatforms } from "../data/dummyData";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem("userProfile");
    if (stored) {
      try {
        return { ...currentUser, ...JSON.parse(stored) };
      } catch {
        return currentUser;
      }
    }
    return currentUser;
  });

  const [platforms, setPlatforms] = useState(() => {
    const stored = localStorage.getItem("connectedPlatforms");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultPlatforms;
      }
    }
    return defaultPlatforms;
  });

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem("userProfile", JSON.stringify(next));
      return next;
    });
  };

  const togglePlatform = (platformId) => {
    setPlatforms((prev) => {
      const next = prev.map((p) =>
        p.id === platformId ? { ...p, connected: !p.connected } : p
      );
      localStorage.setItem("connectedPlatforms", JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({ profile, platforms, updateProfile, togglePlatform }),
    [profile, platforms]
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
