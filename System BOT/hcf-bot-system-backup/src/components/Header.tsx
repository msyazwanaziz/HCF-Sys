"use client";

import { Bell, Search, Command } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-border sticky top-0 z-30 h-20 flex items-center justify-between px-8">
      <div className="flex-1 min-w-0">
        {/* Breadcrumb or Page Title can go here */}
      </div>

      <div className="flex items-center gap-6">
        {/* Command Palette Trigger */}
        <button className="hidden md:flex items-center gap-2 bg-background border border-border rounded-full px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:border-navy-300 transition-all shadow-sm group">
          <Search className="w-4 h-4 text-navy-400 group-hover:text-emerald-500 transition-colors" />
          <span className="mr-4">Ask AI or search...</span>
          <div className="flex items-center gap-1 bg-surface px-2 py-0.5 rounded text-xs font-medium border border-border shadow-sm text-foreground/50">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-navy-400 hover:text-foreground transition-colors rounded-full hover:bg-surface-hover">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-surface"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-semibold text-foreground">Datuk Seri Amin</span>
            <span className="text-xs text-navy-400 font-medium">Chairperson</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-navy-800 border-2 border-surface shadow-sm overflow-hidden flex items-center justify-center text-white font-bold group-hover:ring-2 group-hover:ring-emerald-500 group-hover:ring-offset-2 transition-all">
            DSA
          </div>
        </div>
      </div>
    </header>
  );
}
