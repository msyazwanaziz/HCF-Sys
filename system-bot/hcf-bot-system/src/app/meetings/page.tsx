"use client";

import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Plus, 
  ChevronRight,
  Filter,
  CheckCircle2,
  Video,
  Download
} from "lucide-react";

export default function MeetingsPage() {
  const upcomingMeetings = [
    { 
      id: "MTG-2025-012", 
      title: "Q2 Board of Trustees Meeting", 
      date: "May 12, 2025", 
      time: "10:00 AM - 01:00 PM", 
      location: "Boardroom A / Zoom",
      status: "Scheduled",
      type: "Board"
    },
    { 
      id: "MTG-2025-014", 
      title: "Finance & Audit Committee Review", 
      date: "May 28, 2025", 
      time: "02:30 PM - 04:30 PM", 
      location: "Virtual Meeting",
      status: "Pending Agenda",
      type: "Committee"
    }
  ];

  const pastMeetings = [
    { id: "MTG-2025-008", title: "Special Strategy Session", date: "April 15, 2025", type: "Strategy", files: 3 },
    { id: "MTG-2025-005", title: "Q1 Board Performance Review", date: "March 22, 2025", type: "Board", files: 5 },
    { id: "MTG-2025-002", title: "Annual General Meeting 2025", date: "February 10, 2025", type: "AGM", files: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Board Meetings</h1>
          <p className="text-navy-500 mt-1">Schedule, manage agendas, and access board papers for all organizational governance sessions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-navy-600 hover:bg-surface-hover transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Schedule Meeting
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Meetings */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            Upcoming Sessions
          </h2>
          
          <div className="space-y-4">
            {upcomingMeetings.map((mtg) => (
              <div key={mtg.id} className="bg-surface rounded-3xl border border-border overflow-hidden hover:border-emerald-500/50 transition-all group">
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  <div className="flex flex-col items-center justify-center w-20 h-20 bg-navy-50 dark:bg-navy-900 rounded-2xl border border-navy-100 shrink-0">
                    <span className="text-xs font-bold text-navy-400 uppercase">{mtg.date.split(' ')[0]}</span>
                    <span className="text-2xl font-black text-foreground">{mtg.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {mtg.type}
                      </span>
                      <span className="text-xs font-bold text-navy-400">{mtg.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">
                      {mtg.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-navy-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-navy-300" />
                        {mtg.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-navy-300" />
                        {mtg.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button className="px-6 py-2.5 bg-navy-900 text-white rounded-xl text-sm font-bold hover:bg-navy-800 transition-all flex items-center justify-center gap-2">
                      <FileText className="w-4 h-4" />
                      Board Papers
                    </button>
                    <button className="px-6 py-2.5 bg-navy-50 text-navy-600 rounded-xl text-sm font-bold hover:bg-navy-100 transition-all flex items-center justify-center gap-2">
                      <Video className="w-4 h-4" />
                      Join Call
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Archives */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-foreground">Minutes & Archives</h2>
          <div className="bg-surface rounded-3xl border border-border divide-y divide-border overflow-hidden">
            {pastMeetings.map((mtg) => (
              <div key={mtg.id} className="p-5 hover:bg-surface-hover transition-colors group cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">{mtg.title}</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-xs text-navy-500 mb-3">{mtg.date} • {mtg.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-navy-400 uppercase">{mtg.files} Documents</span>
                  <button className="p-1.5 hover:bg-navy-100 rounded-lg text-navy-400 hover:text-navy-900 transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-8 bg-gradient-to-br from-navy-900 to-navy-800 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <h3 className="text-lg font-bold mb-2">Auto-Minutes AI</h3>
            <p className="text-sm text-navy-300 leading-relaxed">
              Recording and transcription services are enabled for all board meetings. Minutes are automatically generated for review within 24 hours.
            </p>
            <button className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-bold transition-all">
              Configure Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
