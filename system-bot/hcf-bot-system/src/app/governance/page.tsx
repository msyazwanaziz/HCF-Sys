"use client";

import React from 'react';
import { 
  Users, 
  ShieldCheck, 
  Award, 
  BookOpen, 
  UserPlus,
  Search,
  MoreVertical,
  ExternalLink,
  ChevronRight
} from "lucide-react";

export default function GovernancePage() {
  const members = [
    { name: "Tan Sri Dr. Sulaiman Mahboob", role: "Chairperson", department: "Board of Trustees", status: "Active", joinDate: "2018" },
    { name: "Dato' Haji Razali Mohd Sham", role: "Trustee", department: "Finance Committee", status: "Active", joinDate: "2019" },
    { name: "Dr. Mohd Mazlan Zainal", role: "Trustee", department: "Audit & Risk Committee", status: "Active", joinDate: "2020" },
    { name: "Puan Sri Hajah Fatimah", role: "Trustee", department: "Shariah Committee", status: "Active", joinDate: "2021" },
  ];

  const committees = [
    { name: "Audit & Risk Committee", members: 5, meetings: 4, status: "Active" },
    { name: "Finance Committee", members: 4, meetings: 6, status: "Active" },
    { name: "Shariah Committee", members: 3, meetings: 2, status: "Active" },
    { name: "Human Resource Committee", members: 4, meetings: 3, status: "Active" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Governance Portal</h1>
          <p className="text-navy-500 mt-1">Managing the Board of Trustees, specialized committees, and organizational compliance framework.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-navy-600 hover:bg-surface-hover transition-colors shadow-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            View Charter
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Appoint Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Board Members Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Board of Trustees
            </h2>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
              <input 
                type="text" 
                placeholder="Search members..." 
                className="pl-9 pr-4 py-2 bg-surface border border-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500/10 w-64"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member, i) => (
              <div key={i} className="bg-surface rounded-2xl p-6 border border-border hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-navy-900/5 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-5 h-5 text-navy-400 cursor-pointer" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center text-2xl font-black text-navy-900 border border-navy-100">
                    {member.name.split(' ').filter(n => n.length > 3).map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-emerald-600 transition-colors">{member.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{member.role}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-navy-100 text-navy-600">
                        {member.department}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Since {member.joinDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex items-center justify-between pt-4 border-t border-border/50">
                  <button className="text-xs font-bold text-navy-500 hover:text-navy-900 flex items-center gap-1">
                    View Profile <ChevronRight className="w-3 h-3" />
                  </button>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(j => (
                      <div key={j} className="w-6 h-6 rounded-full border-2 border-surface bg-navy-100 flex items-center justify-center text-[8px] font-bold text-navy-500">
                        C{j}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Committees Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Standing Committees
          </h2>
          <div className="space-y-3">
            {committees.map((committee, i) => (
              <div key={i} className="p-5 bg-surface border border-border rounded-2xl hover:bg-navy-50/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-navy-900">{committee.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-navy-500 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {committee.members} Members
                      </span>
                      <span className="text-xs text-navy-500 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> {committee.meetings} Meetings/yr
                      </span>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-navy-900 rounded-3xl text-white space-y-4 relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-bold">Governance Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-navy-300">Compliance Rate</span>
                <span className="font-bold">98%</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[98%]"></div>
              </div>
            </div>
            <p className="text-xs text-navy-300">
              All board resolutions for the current fiscal year have been filed and documented.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
