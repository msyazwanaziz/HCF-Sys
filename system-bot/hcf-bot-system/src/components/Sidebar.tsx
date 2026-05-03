"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  Target, 
  PieChart, 
  ShieldAlert, 
  FolderLock,
  Settings,
  LogOut
} from "lucide-react";
import { useSettings } from "@/context/SettingsContext";
import { useAuth } from "@/context/AuthContext";

const allNavigation = [
  { id: "dashboard", name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "CEO", "SENIOR_MANAGEMENT", "COMPANY_SECRETARY", "ADMIN", "USER"] },
  { id: "governance", name: "Governance Portal", href: "/governance", icon: Users, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "COMPANY_SECRETARY", "ADMIN"] },
  { id: "meetings", name: "Meetings", href: "/meetings", icon: Calendar, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "COMPANY_SECRETARY", "ADMIN"] },
  { id: "approvals", name: "Approvals", href: "/approvals", icon: CheckSquare, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "CEO", "SENIOR_MANAGEMENT", "ADMIN"] },
  { id: "performance", name: "Strategic Performance", href: "/performance", icon: Target, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "CEO", "SENIOR_MANAGEMENT", "ADMIN"] },
  { id: "finance", name: "Financial Oversight", href: "/finance", icon: PieChart, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "CEO", "SENIOR_MANAGEMENT", "ADMIN"] },
  { id: "revenue", name: "Live Financial Dashboard", href: "/revenue", icon: PieChart, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "CEO", "SENIOR_MANAGEMENT", "ADMIN"] },
  { id: "risk", name: "Risk & Compliance", href: "/risk", icon: ShieldAlert, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "CEO", "SENIOR_MANAGEMENT", "ADMIN"] },
  { id: "vault", name: "Document Vault", href: "/vault", icon: FolderLock, roles: ["SUPER_ADMIN", "BOT_CHAIRPERSON", "BOT_MEMBER", "COMPANY_SECRETARY", "ADMIN"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { enabledModules } = useSettings();
  const { user, logout } = useAuth();

  const navigation = allNavigation.filter(item => {
    // 1. Check if module is enabled in settings
    const isEnabled = enabledModules[item.id as keyof typeof enabledModules];
    if (!isEnabled) return false;

    // 2. Check role-based access
    if (!user) return false;
    if (user.role === "SUPER_ADMIN") return true;
    
    return item.roles.includes(user.role);
  });

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-navy-950 border-r border-navy-800">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-20 px-6 bg-navy-950 border-b border-navy-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg leading-none">H</span>
            </div>
            <div>
              <h1 className="text-white font-semibold text-sm tracking-wide">HCF GOVERNANCE</h1>
              <p className="text-navy-400 text-xs">Board of Trustees</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-navy-800 text-white shadow-sm" 
                    : "text-navy-300 hover:bg-navy-800/50 hover:text-white"
                }`}
              >
                <Icon 
                  className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors duration-200 ${
                    isActive ? "text-emerald-400" : "text-navy-400 group-hover:text-emerald-400"
                  }`} 
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-navy-800">
          <Link href="/settings" className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
            pathname === "/settings" ? "bg-navy-800 text-white shadow-sm" : "text-navy-300 hover:bg-navy-800/50 hover:text-white"
          }`}>
            <Settings className={`flex-shrink-0 mr-3 h-5 w-5 transition-colors duration-200 ${
              pathname === "/settings" ? "text-emerald-400" : "text-navy-400 group-hover:text-emerald-400"
            }`} />
            Settings
          </Link>
          <button 
            onClick={logout}
            className="w-full mt-1 group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-navy-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="flex-shrink-0 mr-3 h-5 w-5 text-navy-400 group-hover:text-red-400" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
