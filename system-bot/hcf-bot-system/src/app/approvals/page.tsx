"use client";

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  FileText, 
  Search, 
  ChevronRight,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Stamp
} from "lucide-react";

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");

  const pendingApprovals = [
    { 
      id: "APP-092", 
      title: "Q3 Budget Reallocation - New Mualaf Center", 
      type: "Budget", 
      requester: "Zaid Harith", 
      amount: "RM 250,000",
      date: "2 hours ago",
      priority: "High"
    },
    { 
      id: "APP-091", 
      title: "Ramadan Outreach Program 2025", 
      type: "Project", 
      requester: "Sarah Abdullah", 
      amount: "RM 85,000",
      date: "5 hours ago",
      priority: "Medium"
    },
    { 
      id: "APP-089", 
      title: "Governance & Ethics Policy Update", 
      type: "Policy", 
      requester: "Aminah Bakar", 
      amount: null,
      date: "1 day ago",
      priority: "Low"
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-xl shadow-amber-500/20">
              <CheckSquare className="w-8 h-8" />
            </div>
            Approval Workflows
          </h1>
          <p className="text-navy-500 mt-3 text-lg max-w-2xl">
            Review and authorize board-level resolutions, budget requests, and policy implementations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-surface p-1 rounded-xl border border-border flex items-center">
            <button 
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-navy-900 text-white shadow-lg' : 'text-navy-500 hover:text-navy-900'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-navy-900 text-white shadow-lg' : 'text-navy-500 hover:text-navy-900'}`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Stats */}
        <div className="space-y-4">
          <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
            <h3 className="text-sm font-bold text-navy-400 uppercase tracking-widest">Queue Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50">
                <span className="text-2xl font-black text-amber-600">8</span>
                <p className="text-[10px] font-bold text-amber-700 uppercase mt-1">Pending</p>
              </div>
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-200/50">
                <span className="text-2xl font-black text-emerald-600">124</span>
                <p className="text-[10px] font-bold text-emerald-700 uppercase mt-1">Approved</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-navy-900 rounded-3xl text-white">
            <div className="flex items-center gap-3 mb-4">
              <Stamp className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold">Digital Signature</h3>
            </div>
            <p className="text-xs text-navy-300 leading-relaxed">
              Your digital signature is verified and active. All approvals will be cryptographically signed.
            </p>
            <button className="mt-4 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              Verify Signature <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Approvals List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input 
                type="text" 
                placeholder="Search requests by ID, title or requester..." 
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-amber-500/10"
              />
            </div>
            <button className="p-3 bg-surface border border-border rounded-2xl hover:bg-surface-hover transition-colors">
              <Filter className="w-5 h-5 text-navy-600" />
            </button>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((app) => (
              <div key={app.id} className="bg-surface rounded-[2rem] border border-border overflow-hidden hover:border-amber-500/50 transition-all group">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    app.priority === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-navy-400">{app.id}</span>
                      <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${
                        app.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {app.priority} Priority
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-amber-600 transition-colors truncate">
                      {app.title}
                    </h3>
                    <div className="flex items-center gap-4 mt-2 text-xs text-navy-500">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {app.date}</span>
                      <span className="flex items-center gap-1">Requester: <span className="font-bold text-navy-900">{app.requester}</span></span>
                      {app.amount && <span className="text-emerald-600 font-bold">{app.amount}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-3 text-navy-400 hover:text-navy-900 hover:bg-navy-50 rounded-xl transition-all">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
