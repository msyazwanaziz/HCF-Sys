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

interface AuthorizedMember {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
}

interface SettingsContextType {
  enabledModules: Record<ModuleKey, boolean>;
  toggleModule: (key: ModuleKey) => void;
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
  authorizedMembers: AuthorizedMember[];
  updateMember: (id: string, updates: Partial<AuthorizedMember>) => void;
  addMember: (member: Omit<AuthorizedMember, 'id' | 'lastActive'>) => void;
  removeMember: (id: string) => void;
  masterKey: string;
  setMasterKey: (key: string) => void;
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
  const [authorizedMembers, setAuthorizedMembers] = useState<AuthorizedMember[]>([]);
  const [masterKey, setMasterKey] = useState("hcf2026");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.enabledModules) setEnabledModules({ ...defaultModules, ...data.enabledModules });
          if (data.theme) setTheme(data.theme);
          if (data.authorizedMembers) setAuthorizedMembers(data.authorizedMembers);
          if (data.masterKey) setMasterKey(data.masterKey);
        } else {
          loadFromLocalStorage();
        }
      } catch (err) {
        console.error("API failed, using localStorage fallback", err);
        loadFromLocalStorage();
      }
      setIsLoaded(true);
    }
    loadSettings();
  }, []);

  function loadFromLocalStorage() {
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

    const storedMembers = localStorage.getItem("hcf-members");
    if (storedMembers) {
      setAuthorizedMembers(JSON.parse(storedMembers));
    } else {
      setAuthorizedMembers([
        { id: '1', name: 'Datuk Seri Amin', email: 'amin@hcf.org.my', role: 'Chairperson', lastActive: '2 hours ago' },
        { id: '2', name: 'Dr. Fauzi', email: 'fauzi@hcf.org.my', role: 'Board Member', lastActive: '1 day ago' },
        { id: '3', name: 'System Admin', email: 'admin@hcf.org.my', role: 'BOT Admin', lastActive: 'Now' },
      ]);
    }

    const storedKey = localStorage.getItem("hcf-master-key");
    if (storedKey) setMasterKey(storedKey);
  }

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("hcf-enabled-modules", JSON.stringify(enabledModules));
      localStorage.setItem("hcf-theme", theme);
      localStorage.setItem("hcf-members", JSON.stringify(authorizedMembers));
      localStorage.setItem("hcf-master-key", masterKey);
      
      // Push to API in background
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabledModules,
          theme,
          authorizedMembers,
          masterKey
        })
      }).catch(err => console.error("Failed to save to API", err));

      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    }
  }, [enabledModules, theme, authorizedMembers, masterKey, isLoaded]);

  const toggleModule = (key: ModuleKey) => {
    // Removed dashboard restriction to allow hiding it
    setEnabledModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const updateMember = (id: string, updates: Partial<AuthorizedMember>) => {
    setAuthorizedMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const addMember = (member: Omit<AuthorizedMember, 'id' | 'lastActive'>) => {
    const newMember: AuthorizedMember = {
      ...member,
      id: Math.random().toString(36).substr(2, 9),
      lastActive: 'Never'
    };
    setAuthorizedMembers(prev => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setAuthorizedMembers(prev => prev.filter(m => m.id !== id));
  };

  return (
    <SettingsContext.Provider value={{ 
      enabledModules, toggleModule, theme, setTheme, 
      authorizedMembers, updateMember, addMember, removeMember,
      masterKey, setMasterKey 
    }}>
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
