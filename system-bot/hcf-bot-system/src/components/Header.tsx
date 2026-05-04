"use client";

import React, { useState } from "react";
import { Bell, Search, Command, LogOut, Key, User as UserIcon, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 3);
  };

  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [passwordStatus, setPasswordStatus] = useState({ error: '', success: false, loading: false });

  const handleChangePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordStatus({ error: "Please fill in all fields", success: false, loading: false });
      return;
    }
    
    if (passwords.new !== passwords.confirm) {
      setPasswordStatus({ error: "New passwords do not match", success: false, loading: false });
      return;
    }
    
    setPasswordStatus({ error: '', success: false, loading: true });
    
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          currentPassword: passwords.current,
          newPassword: passwords.new
        })
      });
      
      if (res.ok) {
        setPasswordStatus({ error: '', success: true, loading: false });
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setPasswords({ current: '', new: '', confirm: '' });
          setPasswordStatus({ error: '', success: false, loading: false });
        }, 2000);
      } else {
        const data = await res.json();
        setPasswordStatus({ error: data.error || "Failed to change password", success: false, loading: false });
      }
    } catch (err) {
      setPasswordStatus({ error: "An error occurred", success: false, loading: false });
    }
  };

  return (
    <>
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
        <div className="relative">
          <div 
            className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer group"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="flex flex-col items-end hidden md:flex">
              <span className="text-sm font-semibold text-foreground">{user?.name || "Guest"}</span>
              <span className="text-xs text-navy-400 font-medium capitalize">{user?.role?.toLowerCase()?.replace('_', ' ') || "Observer"}</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-navy-800 border-2 border-surface shadow-sm overflow-hidden flex items-center justify-center text-white font-bold group-hover:ring-2 group-hover:ring-emerald-500 group-hover:ring-offset-2 transition-all">
              {user ? getInitials(user.name) : "U"}
            </div>
          </div>
          
          {isDropdownOpen && user && (
            <div className="absolute right-0 mt-3 w-56 bg-surface border border-border rounded-2xl shadow-xl overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-bold text-foreground">{user.name}</p>
                <p className="text-xs text-navy-500 truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => { setIsDropdownOpen(false); setIsChangePasswordOpen(true); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-navy-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors flex items-center gap-2"
              >
                <Key className="w-4 h-4" /> Change Password
              </button>
              <button 
                onClick={() => { setIsDropdownOpen(false); logout(); }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-surface w-full max-w-md rounded-3xl shadow-2xl border border-border p-8 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Key className="w-5 h-5 text-emerald-500" /> Change Password
              </h2>
              <button onClick={() => setIsChangePasswordOpen(false)} className="text-navy-400 hover:text-foreground hover:bg-surface-hover p-1 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {passwordStatus.success ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Password updated successfully!
              </div>
            ) : (
              <div className="space-y-4">
                {passwordStatus.error && (
                  <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 p-3 rounded-xl text-sm font-medium">
                    {passwordStatus.error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">Current Password</label>
                  <input type="password" placeholder="Enter current password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">New Password</label>
                  <input type="password" placeholder="Enter new password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-foreground" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-600 uppercase">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none text-foreground" />
                </div>
                
                <button 
                  type="button"
                  onClick={handleChangePassword}
                  disabled={passwordStatus.loading}
                  className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-900/20 transition-all mt-4 flex justify-center items-center gap-2"
                >
                  {passwordStatus.loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Update Password"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
