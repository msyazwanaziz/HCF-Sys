"use client";

import React, { useState } from 'react';
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";
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
  UserPlus,
  Lock,
  LucideIcon
} from "lucide-react";

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  required: boolean;
}

const moduleInfo: ModuleConfig[] = [
  { id: "dashboard", name: "Dashboard", description: "Main executive summary and KPIs.", icon: LayoutDashboard, required: true },
  { id: "governance", name: "Governance Portal", description: "Board member profiles, committees, and resolutions.", icon: Users, required: false },
  { id: "meetings", name: "Meetings", description: "Agenda builder, board papers, and auto minutes.", icon: Calendar, required: false },
  { id: "approvals", name: "Approvals", description: "Digital signatures and approval workflows.", icon: CheckSquare, required: false },
  { id: "performance", name: "Strategic Performance", description: "Annual targets, department scorecards, and OKRs.", icon: Target, required: false },
  { id: "finance", name: "Financial Oversight", description: "Income, expenses, and budget variance tracking.", icon: PieChart, required: false },
  { id: "revenue", name: "Live Financial Dashboard", description: "Live real-time revenue and inflow summaries from Google Sheets.", icon: PieChart, required: false },
  { id: "analysis", name: "Financial Analysis Dashboard", description: "Advanced financial analysis with bank and branch filtering.", icon: BarChart3, required: false },
  { id: "risk", name: "Risk & Compliance", description: "Risk register and internal audit issues.", icon: ShieldAlert, required: false },
  { id: "vault", name: "Document Vault", description: "Secure storage for board papers and contracts.", icon: FolderLock, required: false },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { 
    enabledModules, toggleModule, 
    rolePermissions, toggleRolePermission,
    theme, setTheme, 
    authorizedMembers, updateMember, addMember, removeMember,
    masterKey, setMasterKey 
  } = useSettings();
  
  const [activeTab, setActiveTab] = useState<"modules" | "security" | "permissions" | "appearance">("modules");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'BOT_MEMBER', password: '' });

  // Admin access check
  const isAdmin = user && [
    "SUPER_ADMIN", 
    "ADMIN", 
    "BOT ADMIN", 
    "CHAIRPERSON"
  ].includes(user.role.toUpperCase());

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 text-rose-500 border border-rose-100 shadow-sm">
          <Lock className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-navy-500 max-w-md">
          You do not have the required permissions to access the system settings. Please contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  const availableRoles = [
    "BOT_CHAIRPERSON",
    "BOT_MEMBER",
    "CEO",
    "SENIOR_MANAGEMENT",
    "COMPANY_SECRETARY",
    "ADMIN",
    "USER"
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
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

      <div className="flex flex-col lg:flex-row gap-8 w-full">
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
            onClick={() => setActiveTab("permissions")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === "permissions" ? "bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400" : "text-navy-600 hover:bg-surface-hover"
            }`}
          >
            <Shield className="w-5 h-5" />
            Role Permissions
          </button>
          <button 
            onClick={() => setActiveTab("security")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
              activeTab === "security" ? "bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400" : "text-navy-600 hover:bg-surface-hover"
            }`}
          >
            <Users className="w-5 h-5" />
            Staff & Board Access
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
        <div className="flex-1 min-w-0 w-full space-y-6">
          {activeTab === "modules" && (
            <div className="w-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-foreground">Active Modules</h2>
                <p className="text-sm text-navy-500 mt-1">
                  Toggle the features you want to display in your navigation sidebar globally.
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
                        onClick={() => toggleModule(mod.id as any)}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                          isEnabled ? "bg-emerald-500" : "bg-navy-200 dark:bg-navy-700"
                        }`}
                      >
                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isEnabled ? "translate-x-5" : "translate-x-0"}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="w-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-foreground">Role-Based Access Management</h2>
                <p className="text-sm text-navy-500 mt-1">
                  Define which modules are accessible for each organizational role. Note: SUPER_ADMIN always has full access.
                </p>
              </div>
              
              <div className="w-full overflow-auto max-h-[600px] border-t border-border">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr className="bg-navy-50/95 dark:bg-navy-900/95 backdrop-blur-sm text-navy-600 dark:text-navy-300 text-xs uppercase tracking-wider font-bold border-b border-border">
                      <th className="sticky top-0 left-0 z-30 bg-navy-50 dark:bg-navy-900 px-6 py-4 shadow-[1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)]">Role</th>
                      {moduleInfo.map(mod => (
                        <th key={mod.id} className="px-4 py-4 text-center min-w-[120px]">{mod.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-sm">
                    {availableRoles.map(role => (
                      <tr key={role} className="hover:bg-surface-hover transition-colors group">
                        <td className="sticky left-0 z-10 bg-surface px-6 py-4 font-bold text-foreground whitespace-nowrap shadow-[1px_0_0_0_rgba(0,0,0,0.1)] dark:shadow-[1px_0_0_0_rgba(255,255,255,0.1)] group-hover:bg-surface-hover transition-colors">
                          {role.replace('_', ' ')}
                        </td>
                        {moduleInfo.map(mod => {
                          const isAllowed = rolePermissions[role]?.includes(mod.id as any);
                          return (
                            <td key={mod.id} className="px-4 py-4 text-center">
                              <button
                                onClick={() => toggleRolePermission(role, mod.id as any)}
                                className={`w-6 h-6 rounded border-2 transition-all flex items-center justify-center mx-auto ${
                                  isAllowed 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-navy-200 dark:border-navy-700 hover:border-emerald-500/50"
                                }`}
                              >
                                {isAllowed && <CheckSquare className="w-4 h-4" />}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {/* Hybrid Login / Staff Access */}
              <div className="w-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
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
                  {authorizedMembers.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-navy-100 flex items-center justify-center font-bold text-navy-600 uppercase">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-foreground">{member.name}</p>
                          <p className="text-xs text-navy-500 mb-1">{member.email} • {member.role.replace('_', ' ')}</p>
                          {member.lastLoginAt ? (
                            <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full inline-block">
                              Last login: {new Date(member.lastLoginAt).toLocaleString('en-MY', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric', 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          ) : (
                            <p className="text-[10px] font-medium text-navy-400 italic">Never logged in</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => setEditingMember(member)} className="p-2 text-navy-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => removeMember(member.id)} className="p-2 text-navy-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Access Key Management */}
              <div className="w-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-background/50">
                  <h2 className="text-lg font-bold text-foreground">Master Access Key</h2>
                  <p className="text-sm text-navy-500 mt-1">Configure the master access key used for executive authorization.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">Current Master Key</label>
                      <input type="password" value={masterKey} readOnly className="w-full bg-navy-50 border border-border rounded-xl px-4 py-2.5 text-navy-500 text-sm outline-none cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-navy-600 uppercase tracking-wider">New Master Key</label>
                      <input type="password" placeholder="Enter new key" onChange={(e) => setMasterKey(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground text-sm outline-none focus:ring-2 focus:ring-emerald-500/20" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="w-full bg-surface rounded-2xl border border-border shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-border bg-background/50">
                <h2 className="text-lg font-bold text-foreground">Theme Settings</h2>
                <p className="text-sm text-navy-500 mt-1">Customize the appearance of the dashboard.</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setTheme(t)} 
                      className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all ${
                        theme === t ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 ring-1 ring-emerald-500' : 'border-border hover:bg-surface-hover'
                      }`}
                    >
                      <span className="capitalize font-semibold text-foreground">{t} Mode</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {(isAddingMember || editingMember) && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 animate-in zoom-in-95 duration-300">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">{isAddingMember ? "Add Member" : "Edit Member"}</h2>
                <button onClick={() => {setIsAddingMember(false); setEditingMember(null);}} className="text-navy-400 hover:text-foreground hover:bg-surface-hover p-1 rounded-full transition-colors"><X /></button>
             </div>
             <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">Name</label>
                  <input type="text" defaultValue={editingMember?.name || ""} placeholder="Full Name" onChange={(e) => isAddingMember ? setNewMember({...newMember, name: e.target.value}) : updateMember(editingMember.id, {name: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">Email</label>
                  <input type="email" defaultValue={editingMember?.email || ""} placeholder="email@hcf.org.my" onChange={(e) => isAddingMember ? setNewMember({...newMember, email: e.target.value}) : updateMember(editingMember.id, {email: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">Role</label>
                  <select defaultValue={editingMember?.role || "BOT_MEMBER"} onChange={(e) => isAddingMember ? setNewMember({...newMember, role: e.target.value}) : updateMember(editingMember.id, {role: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none">
                    {availableRoles.map(role => (
                      <option key={role} value={role}>{role.replace('_', ' ')}</option>
                    ))}
                  </select>
                </div>
                {isAddingMember && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-600 uppercase">Temporary Password</label>
                    <input type="password" placeholder="Enter temporary password" onChange={(e) => setNewMember({...newMember, password: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none" />
                  </div>
                )}
                <button 
                  onClick={async () => {
                    if (isAddingMember) {
                      if (!newMember.password) {
                        alert("Please enter a temporary password.");
                        return;
                      }
                      
                      try {
                        const nameParts = newMember.name.split(' ');
                        const firstName = nameParts[0];
                        const lastName = nameParts.slice(1).join(' ');
                        
                        const res = await fetch('/api/auth/register', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email: newMember.email,
                            password: newMember.password,
                            firstName: firstName || 'User',
                            lastName: lastName || '',
                            role: newMember.role,
                            bypassAuthorizedCheck: true
                          })
                        });
                        
                        if (res.ok) {
                          addMember(newMember);
                        } else {
                          const data = await res.json();
                          alert("Error creating user: " + data.error);
                          return;
                        }
                      } catch (err) {
                        alert("Failed to create user.");
                        return;
                      }
                    }
                    setIsAddingMember(false); setEditingMember(null);
                    setShowSuccess(true); setTimeout(() => setShowSuccess(false), 3000);
                  }}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all mt-4"
                >
                  Confirm
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
