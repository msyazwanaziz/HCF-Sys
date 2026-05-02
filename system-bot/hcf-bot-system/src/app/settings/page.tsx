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
  Palette,
  Edit,
  Trash2,
  Plus,
  X,
  UserPlus
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
  const { 
    enabledModules, toggleModule, 
    theme, setTheme, 
    authorizedMembers, updateMember, addMember, removeMember,
    masterKey, setMasterKey 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<"modules" | "appearance" | "security">("modules");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'Board Member' });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

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
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2"
        >
          {isSaving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {showSuccess && (
        <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right-8 duration-500 flex items-center gap-3">
          <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
            <Save className="w-3 h-3" />
          </div>
          <span className="font-bold text-sm">System settings updated successfully!</span>
        </div>
      )}

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
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === "security" ? "bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400" : "text-navy-600 hover:bg-surface-hover"
            }`}
          >
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

          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Access Key Management */}
              <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-background/50">
                  <h2 className="text-lg font-bold text-foreground">Global Security</h2>
                  <p className="text-sm text-navy-500 mt-1">Configure the master access key used for executive authorization.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">Current Master Key</label>
                      <input 
                        type="password" 
                        value={masterKey} 
                        readOnly 
                        className="w-full bg-navy-50 border border-border rounded-xl px-4 py-2.5 text-navy-500 text-sm outline-none cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">New Master Key</label>
                      <input 
                        type="password" 
                        placeholder="Enter new key"
                        onChange={(e) => setMasterKey(e.target.value)}
                        className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-500/20 rounded-xl">
                    <Shield className="w-5 h-5 text-emerald-500" />
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Changing the master key will require all active board sessions to re-authenticate.</p>
                  </div>
                </div>
              </div>

              {/* Hybrid Login / Staff Access */}
              <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-background/50 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Staff & Board Access</h2>
                    <p className="text-sm text-navy-500 mt-1">Manage individual accounts for hybrid login system.</p>
                  </div>
                  <button 
                    onClick={() => setIsAddingMember(true)}
                    className="px-3 py-1.5 bg-navy-900 text-white text-xs font-bold rounded-lg hover:bg-navy-800 transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3" />
                    Add Authorized Member
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {authorizedMembers.map((member: any) => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center font-bold text-navy-600">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{member.name}</p>
                          <p className="text-xs text-navy-500">{member.email} • {member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-navy-400 uppercase font-bold">{member.lastActive}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setEditingMember(member)}
                            className="p-2 text-navy-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeMember(member.id)}
                            className="p-2 text-navy-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Add Member Modal */}
          {isAddingMember && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-navy-50 rounded-xl">
                      <UserPlus className="w-5 h-5 text-navy-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Add Member</h2>
                  </div>
                  <button onClick={() => setIsAddingMember(false)} className="text-navy-400 hover:text-foreground"><X /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tan Sri Sulaiman"
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="email@hcf.org.my"
                      onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Role</label>
                    <select 
                      onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option>Board Member</option>
                      <option>Chairperson</option>
                      <option>BOT Admin</option>
                      <option>Observer</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      addMember(newMember);
                      setIsAddingMember(false);
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all mt-4"
                  >
                    Confirm Access
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Member Modal */}
          {editingMember && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
              <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl">
                      <Edit className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-foreground">Edit Member</h2>
                  </div>
                  <button onClick={() => setEditingMember(null)} className="text-navy-400 hover:text-foreground"><X /></button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={editingMember.name}
                      onChange={(e) => updateMember(editingMember.id, { name: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={editingMember.email}
                      onChange={(e) => updateMember(editingMember.id, { email: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Role</label>
                    <select 
                      defaultValue={editingMember.role}
                      onChange={(e) => updateMember(editingMember.id, { role: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none"
                    >
                      <option>Board Member</option>
                      <option>Chairperson</option>
                      <option>BOT Admin</option>
                      <option>Observer</option>
                    </select>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingMember(null);
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    }}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all mt-4"
                  >
                    Save Changes
                  </button>
                </div>
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
