"use client";

import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Search,
  ArrowUpRight,
  Zap,
  Activity,
  ChevronRight,
  Lock
} from "lucide-react";

export default function RiskPage() {
  const risks = [
    { id: "RSK-042", title: "Data Privacy Compliance (PDPA)", level: "High", status: "Mitigating", category: "Legal" },
    { id: "RSK-038", title: "Funding Volatility Q3", level: "Medium", status: "Monitored", category: "Financial" },
    { id: "RSK-045", title: "Cybersecurity Framework Gap", level: "Critical", status: "Urgent", category: "IT" },
    { id: "RSK-029", title: "Volunteer Safety Protocols", level: "Low", status: "Controlled", category: "Operations" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
            <div className="p-3 bg-rose-600 text-white rounded-2xl shadow-xl shadow-rose-600/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            Risk & Compliance
          </h1>
          <p className="text-navy-500 mt-3 text-lg max-w-2xl">
            Real-time monitoring of organizational risks, internal audits, and regulatory compliance status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-sm font-bold transition-all hover:bg-rose-700 hover:shadow-xl hover:shadow-rose-600/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Report Issue
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-navy-400 uppercase">Compliance</h3>
          </div>
          <p className="text-3xl font-black text-foreground">94.2%</p>
          <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold mt-2">
            <Zap className="w-3 h-3" /> +2.1% from Q1
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-navy-400 uppercase">Open Risks</h3>
          </div>
          <p className="text-3xl font-black text-foreground">12</p>
          <div className="flex items-center gap-1 text-rose-600 text-xs font-bold mt-2">
            3 Critical / 5 High
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-navy-400 uppercase">Audit Status</h3>
          </div>
          <p className="text-3xl font-black text-foreground">Active</p>
          <div className="flex items-center gap-1 text-blue-600 text-xs font-bold mt-2">
            Internal Q2 Review
          </div>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-navy-400 uppercase">Maturity</h3>
          </div>
          <p className="text-3xl font-black text-foreground">Level 4</p>
          <div className="flex items-center gap-1 text-navy-500 text-xs font-bold mt-2">
            Managed & Optimized
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Risk Register</h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
              <input 
                type="text" 
                placeholder="Search risk register..." 
                className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-rose-500/10 w-64"
              />
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-background/50 border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Risk Description</th>
                  <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Inherent Level</th>
                  <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {risks.map((risk) => (
                  <tr key={risk.id} className="hover:bg-surface-hover transition-colors group">
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-navy-400">{risk.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-foreground group-hover:text-rose-600 transition-colors">{risk.title}</p>
                        <p className="text-[10px] text-navy-400 font-medium">{risk.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                        risk.level === 'Critical' ? 'bg-rose-100 text-rose-700' :
                        risk.level === 'High' ? 'bg-orange-100 text-orange-700' :
                        risk.level === 'Medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {risk.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-navy-600">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          risk.status === 'Urgent' ? 'bg-rose-500 animate-pulse' : 'bg-navy-300'
                        }`}></div>
                        {risk.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 group-hover:text-navy-900 transition-all">
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Compliance Calendar</h2>
          <div className="bg-surface rounded-3xl border border-border p-6 space-y-4">
            {[
              { date: "May 20", title: "Statutory Audit Filing", status: "Upcoming" },
              { date: "June 05", title: "PDPA Policy Review", status: "Assigned" },
              { date: "June 15", title: "Anti-Bribery Certification", status: "Mandatory" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-3 hover:bg-navy-50 rounded-2xl transition-colors cursor-pointer group">
                <div className="w-12 h-12 bg-navy-50 dark:bg-navy-900 rounded-xl flex flex-col items-center justify-center shrink-0 border border-navy-100">
                  <span className="text-[10px] font-bold text-navy-400">{item.date.split(' ')[0]}</span>
                  <span className="text-sm font-black text-foreground">{item.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground group-hover:text-rose-600 transition-colors">{item.title}</h4>
                  <p className="text-[10px] font-bold text-navy-400 uppercase mt-1 tracking-widest">{item.status}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-navy-300 self-center" />
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-gradient-to-br from-navy-950 to-navy-900 rounded-[2rem] text-white shadow-2xl border border-white/5">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Internal Audit AI
            </h3>
            <p className="text-sm text-navy-400 leading-relaxed mb-6">
              AI-driven risk scanning is currently monitoring 14 active departments. No new anomalies detected in the last 24 hours.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              System Fully Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
