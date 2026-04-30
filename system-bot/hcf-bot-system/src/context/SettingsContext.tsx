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
  | "vault"
  | "revenue";

interface SettingsContextType {
  enabledModules: Record<ModuleKey, boolean>;
  toggleModule: (key: ModuleKey) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
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
  revenue: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [enabledModules, setEnabledModules] = useState<Record<ModuleKey, boolean>>(defaultModules);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
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
    const storedTheme = localStorage.getItem("hcf-theme") as "light" | "dark" | "system" | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    // Save to local storage whenever it changes
    if (isLoaded) {
      localStorage.setItem("hcf-enabled-modules", JSON.stringify(enabledModules));
      localStorage.setItem("hcf-theme", theme);
      
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  }, [enabledModules, theme, isLoaded]);

  const toggleModule = (key: ModuleKey) => {
    if (key === "dashboard") return; // Prevent disabling dashboard
    setEnabledModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <SettingsContext.Provider value={{ enabledModules, toggleModule, theme, setTheme }}>
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
