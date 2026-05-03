"use client";

import React from 'react';
import { 
  FolderLock, 
  Search, 
  FileText, 
  Download, 
  Eye, 
  MoreVertical,
  Plus,
  ChevronRight,
  ShieldCheck,
  Clock,
  HardDrive
} from "lucide-react";

export default function VaultPage() {
  const documents = [
    { name: "Constitution of HCF.pdf", type: "Legal", size: "2.4 MB", date: "Jan 12, 2024", version: "v2.1" },
    { name: "Board Charter 2025.docx", type: "Governance", size: "1.1 MB", date: "Mar 05, 2025", version: "v1.4" },
    { name: "Financial Audit Report FY24.pdf", type: "Audit", size: "15.8 MB", date: "Feb 20, 2025", version: "v1.0" },
    { name: "Strategy Roadmap 2025-2030.pdf", type: "Strategy", size: "8.5 MB", date: "Apr 10, 2025", version: "v3.0" },
    { name: "Minutes_Q1_Board_Meeting.pdf", type: "Minutes", size: "0.8 MB", date: "Mar 22, 2025", version: "v1.0" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
            <div className="p-3 bg-navy-950 text-white rounded-2xl shadow-xl shadow-navy-950/20">
              <FolderLock className="w-8 h-8" />
            </div>
            Secure Vault
          </h1>
          <p className="text-navy-500 mt-3 text-lg max-w-2xl">
            Encrypted storage for sensitive board papers, legal contracts, and historical organizational records.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-surface border border-border rounded-xl text-sm font-bold text-navy-600 hover:bg-surface-hover transition-all flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Manage Storage
          </button>
          <button className="px-5 py-2.5 bg-navy-950 text-white rounded-xl text-sm font-bold transition-all hover:bg-navy-900 hover:shadow-xl hover:shadow-navy-950/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-foreground">Categories</h2>
          <div className="space-y-1">
            {[
              { name: "All Documents", count: 124, active: true },
              { name: "Board Papers", count: 45, active: false },
              { name: "Financial Audits", count: 12, active: false },
              { name: "Legal & Contracts", count: 28, active: false },
              { name: "Policy Documents", count: 39, active: false },
            ].map((cat, i) => (
              <button 
                key={i}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  cat.active ? 'bg-navy-100 text-navy-900' : 'text-navy-500 hover:bg-navy-50 hover:text-navy-900'
                }`}
              >
                {cat.name}
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-navy-200">{cat.count}</span>
              </button>
            ))}
          </div>

          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-3xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center gap-3 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="font-bold text-emerald-900 dark:text-emerald-400">AES-256 Active</h3>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-500/80 leading-relaxed">
              All files in this vault are encrypted at rest and in transit. Access is logged in the permanent audit trail.
            </p>
          </div>
        </div>

        {/* Document List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-navy-400" />
              <input 
                type="text" 
                placeholder="Search by filename, tag, or content..." 
                className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-2xl text-sm outline-none focus:ring-2 focus:ring-navy-500/10"
              />
            </div>
            <div className="flex bg-surface border border-border p-1 rounded-xl">
              <button className="p-2 bg-white shadow-sm rounded-lg text-navy-900"><MoreVertical className="w-4 h-4 rotate-90" /></button>
              <button className="p-2 text-navy-400"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-background/50 border-b border-border">
                    <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Document Name</th>
                    <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Version</th>
                    <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Size</th>
                    <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest">Added Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-navy-400 uppercase tracking-widest"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {documents.map((doc, i) => (
                    <tr key={i} className="hover:bg-surface-hover transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-navy-50 rounded-lg text-navy-400 group-hover:text-navy-900 transition-colors">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{doc.name}</p>
                            <p className="text-[10px] font-bold text-navy-400 uppercase">{doc.type}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-navy-600 bg-navy-50 px-2 py-0.5 rounded-lg">{doc.version}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-navy-500 font-medium">{doc.size}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-xs text-navy-500 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {doc.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-navy-50 rounded-lg text-navy-400 hover:text-emerald-600 transition-all">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-border bg-background/30 flex items-center justify-center">
              <button className="text-xs font-bold text-navy-400 hover:text-navy-900 flex items-center gap-1 transition-colors">
                View More Documents <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
