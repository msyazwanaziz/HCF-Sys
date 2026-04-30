"use client";

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
  { id: "risk", name: "Risk & Compliance", description: "Risk register and internal audit issues.", icon: ShieldAlert },
  { id: "vault", name: "Document Vault", description: "Secure storage for board papers and contracts.", icon: FolderLock },
];

export default function SettingsPage() {
  const { enabledModules, toggleModule } = useSettings();

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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-navy-50 dark:bg-navy-900 text-emerald-600 dark:text-emerald-400">
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
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-navy-600 hover:bg-surface-hover transition-colors">
            <Palette className="w-5 h-5 text-navy-400" />
            Appearance
          </button>
        </div>

        {/* Main Settings Content */}
        <div className="flex-1 space-y-6">
          <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
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
        </div>
      </div>
    </div>
  );
}
