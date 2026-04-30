"use client";

import React, { useState } from 'react';
import { useSettings } from "@/context/SettingsContext";
import { 
  Settings, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  Target, 
  PieChart, 
  ShieldAlert, 
  FolderLock,
  Save,
  Bell,
  Shield,
  Palette
} from "lucide-react";

const moduleInfo = [
  { id: "dashboard", name: "Dashboard", description: "Main executive summary and KPIs.", icon: LayoutDashboard, required: true },
  { id: "governance", name: "Governance Portal", description: "Board member profiles, committees, and resolutions.", icon: Users },
  { id: "meetings", name: "Meetings", description: "Agenda builder, board papers, and auto minutes.", icon: Calendar },
  { id: "approvals", name: "Approvals", description: "Digital signatures and approval workflows.", icon: CheckSquare },
  { id: "performance", name: "Strategic Performance", description: "Annual targets, department scorecards, and OKRs.", icon: Target },
  { id: "finance", name: "Financial Oversight", description: "Income, expenses, and budget variance tracking.", icon: PieChart },
  { id: "revenue", name: "Live Financial Dashboard", description: "Live real-time revenue and inflow summaries from Google Sheets.", icon: PieChart },
  { id: "risk", name: "Risk & Compliance", description: "Risk register and internal audit issues.", icon: ShieldAlert },
  { id: "vault", name: "Document Vault", description: "Secure storage for board papers and contracts.", icon: FolderLock },
];

export default function SettingsPage() {
  const { enabledModules, toggleModule, theme, setTheme } = useSettings();
  const [activeTab, setActiveTab] = useState<"modules" | "appearance">("modules");

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-navy-500" />
            System Settings
          </h1>
          <p className="text-navy-500 mt-2">Manage your preferences, modules, and platform configuration.</p>
        </div>
        <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-1">
          <button 
            onClick={() => setActiveTab("modules")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === "modules" ? "bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400" : "text-navy-600 hover:bg-surface-hover"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Modules & Features
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-navy-600 hover:bg-surface-hover transition-colors">
            <Shield className="w-5 h-5 text-navy-400" />
            Security & Access
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-navy-600 hover:bg-surface-hover transition-colors">
            <Bell className="w-5 h-5 text-navy-400" />
            Notifications
          </button>
          <button 
            onClick={() => setActiveTab("appearance")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === "appearance" ? "bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400" : "text-navy-600 hover:bg-surface-hover"
            }`}
          >
            <Palette className="w-5 h-5" />
            Appearance
          </button>
        </div>

        {/* Main Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "modules" && (
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-foreground">Active Modules</h2>
                <p className="text-sm text-navy-500 mt-1">
                  Toggle the features you want to display in your navigation sidebar. Modules can be enabled or disabled based on your organization's needs.
                </p>
              </div>
              
              <div className="divide-y divide-border">
                {moduleInfo.map((mod) => {
                  const Icon = mod.icon;
                  const isEnabled = enabledModules[mod.id as keyof typeof enabledModules];
                  
                  return (
                    <div key={mod.id} className="p-6 flex items-center justify-between hover:bg-surface-hover transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${isEnabled ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-navy-50 text-navy-400 dark:bg-navy-800"}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className={`text-base font-semibold ${isEnabled ? "text-foreground" : "text-navy-400"}`}>
                            {mod.name}
                            {mod.required && (
                              <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-400">Required</span>
                            )}
                          </h3>
                          <p className="text-sm text-navy-500 mt-0.5">{mod.description}</p>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        disabled={mod.required}
                        onClick={() => !mod.required && toggleModule(mod.id as any)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          isEnabled ? "bg-emerald-500" : "bg-navy-200 dark:bg-navy-700"
                        } ${mod.required ? "opacity-50 cursor-not-allowed" : ""}`}
                        role="switch"
                        aria-checked={isEnabled}
                      >
                        <span
                          aria-hidden="true"
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isEnabled ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-foreground">Theme Settings</h2>
                <p className="text-sm text-navy-500 mt-1">
                  Customize the appearance of the dashboard to match your personal preference or device settings.
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setTheme('light')}
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${
                      theme === 'light' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-700">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <span className={`font-semibold ${theme === 'light' ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>Light Mode</span>
                  </button>
                  
                  <button 
                    onClick={() => setTheme('dark')}
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${
                      theme === 'dark' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    <div className="w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-200">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                    </div>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>Dark Mode</span>
                  </button>

                  <button 
                    onClick={() => setTheme('system')}
                    className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${
                      theme === 'system' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-border hover:bg-surface-hover'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-white to-slate-900 border border-slate-400 rounded-full flex items-center justify-center mb-3 shadow-sm text-slate-400">
                      <svg className="w-6 h-6 mix-blend-difference text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <span className={`font-semibold ${theme === 'system' ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>System Default</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
