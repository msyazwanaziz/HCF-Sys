"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ModuleKey = 
  | "dashboard"
  | "governance"
  | "meetings"
  | "approvals"
  | "performance"
  | "finance"
  | "risk"
  | "vault";

interface SettingsContextType {
  enabledModules: Record<ModuleKey, boolean>;
  toggleModule: (key: ModuleKey) => void;
}

const defaultModules: Record<ModuleKey, boolean> = {
  dashboard: true, // Always true, cannot be disabled usually
  governance: true,
  meetings: true,
  approvals: true,
  performance: true,
  finance: true,
  risk: true,
  vault: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [enabledModules, setEnabledModules] = useState<Record<ModuleKey, boolean>>(defaultModules);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const stored = localStorage.getItem("hcf-enabled-modules");
    if (stored) {
      try {
        setEnabledModules({ ...defaultModules, ...JSON.parse(stored) });
      } catch (e) {
        console.error("Failed to parse stored modules", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save to local storage whenever it changes
    if (isLoaded) {
      localStorage.setItem("hcf-enabled-modules", JSON.stringify(enabledModules));
    }
  }, [enabledModules, isLoaded]);

  const toggleModule = (key: ModuleKey) => {
    if (key === "dashboard") return; // Prevent disabling dashboard
    setEnabledModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SettingsContext.Provider value={{ enabledModules, toggleModule }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
