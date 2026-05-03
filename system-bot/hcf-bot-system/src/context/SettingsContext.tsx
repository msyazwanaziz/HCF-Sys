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
  rolePermissions: Record<string, ModuleKey[]>;
  toggleRolePermission: (role: string, module: ModuleKey) => void;
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
  dashboard: true,
  governance: true,
  meetings: true,
  approvals: true,
  performance: true,
  finance: true,
  risk: true,
  vault: true,
  revenue: true,
};

const defaultRolePermissions: Record<string, ModuleKey[]> = {
  "SUPER_ADMIN": ["dashboard", "governance", "meetings", "approvals", "performance", "finance", "revenue", "risk", "vault"],
  "BOT_CHAIRPERSON": ["dashboard", "governance", "meetings", "approvals", "performance", "finance", "revenue", "risk", "vault"],
  "BOT_MEMBER": ["dashboard", "governance", "meetings", "performance", "risk", "vault"],
  "CEO": ["dashboard", "approvals", "performance", "finance", "revenue", "risk"],
  "SENIOR_MANAGEMENT": ["dashboard", "performance", "finance", "revenue", "risk"],
  "COMPANY_SECRETARY": ["dashboard", "governance", "meetings", "vault"],
  "ADMIN": ["dashboard", "governance", "meetings", "approvals", "performance", "finance", "revenue", "risk", "vault"],
  "USER": ["dashboard"],
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [enabledModules, setEnabledModules] = useState<Record<ModuleKey, boolean>>(defaultModules);
  const [rolePermissions, setRolePermissions] = useState<Record<string, ModuleKey[]>>(defaultRolePermissions);
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
          if (data.rolePermissions) setRolePermissions({ ...defaultRolePermissions, ...data.rolePermissions });
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

    const storedPerms = localStorage.getItem("hcf-role-permissions");
    if (storedPerms) {
      try {
        setRolePermissions({ ...defaultRolePermissions, ...JSON.parse(storedPerms) });
      } catch (e) {
        console.error("Failed to parse stored permissions", e);
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
      localStorage.setItem("hcf-role-permissions", JSON.stringify(rolePermissions));
      localStorage.setItem("hcf-theme", theme);
      localStorage.setItem("hcf-members", JSON.stringify(authorizedMembers));
      localStorage.setItem("hcf-master-key", masterKey);
      
      // Push to API in background
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enabledModules,
          rolePermissions,
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
  }, [enabledModules, rolePermissions, theme, authorizedMembers, masterKey, isLoaded]);

  const toggleModule = (key: ModuleKey) => {
    setEnabledModules(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleRolePermission = (role: string, module: ModuleKey) => {
    setRolePermissions(prev => {
      const current = prev[role] || [];
      const updated = current.includes(module)
        ? current.filter(m => m !== module)
        : [...current, module];
      return { ...prev, [role]: updated };
    });
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
      enabledModules, toggleModule, rolePermissions, toggleRolePermission,
      theme, setTheme, 
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
