"use client";

import KPICard from "@/components/KPICard";
import { DonationsTrendChart, FundAllocationChart } from "@/components/Charts";
import { 
  TrendingUp, 
  Users, 
  Target, 
  AlertCircle,
  FileText,
  Calendar,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Executive Dashboard</h1>
          <p className="text-navy-500 mt-1">Real-time overview of Hidayah Centre Foundation performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-navy-600 hover:bg-surface-hover transition-colors shadow-sm">
            Download Report
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20">
            Generate PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Donations (YTD)" 
          value="RM 12.4M" 
          trend="+14.5%" 
          trendUp={true} 
          icon={<TrendingUp className="w-6 h-6" />}
          subtitle="vs last year RM 10.8M"
        />
        <KPICard 
          title="Beneficiaries Impacted" 
          value="45,200" 
          trend="+8.2%" 
          trendUp={true} 
          icon={<Users className="w-6 h-6" />}
          subtitle="Target: 50,000"
        />
        <KPICard 
          title="Active Projects" 
          value="124" 
          icon={<Target className="w-6 h-6" />}
          subtitle="Across 14 regions"
        />
        <KPICard 
          title="Critical Risks" 
          value="3" 
          trend="Action required" 
          trendUp={false} 
          icon={<AlertCircle className="w-6 h-6" />}
          subtitle="Compliance & Governance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Donation Trends</h2>
            <select className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <DonationsTrendChart />
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">Fund Allocation</h2>
          </div>
          <FundAllocationChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-2xl p-0 border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Pending Approvals
            </h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View All</button>
          </div>
          <div className="divide-y divide-border">
            {[
              { id: "APP-092", title: "Q3 Budget Reallocation", department: "Finance", time: "2 hours ago" },
              { id: "APP-091", title: "New Mualaf Support Program", department: "Operations", time: "5 hours ago" },
              { id: "APP-089", title: "Annual Audit Report 2025", department: "Governance", time: "1 day ago" },
            ].map((approval) => (
              <div key={approval.id} className="p-4 flex items-center justify-between hover:bg-surface-hover transition-colors cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-emerald-600 transition-colors">{approval.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-navy-400 mt-1">
                      <span className="font-medium">{approval.id}</span>
                      <span>•</span>
                      <span>{approval.department}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-navy-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {approval.time}
                  </span>
                  <button className="px-3 py-1.5 bg-background border border-border rounded-md text-xs font-medium hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-0 border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-navy-500" />
              Upcoming Meetings
            </h2>
            <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">Calendar</button>
          </div>
          <div className="p-6 space-y-6">
            {[
              { date: "May 12", title: "Q2 Board of Trustees Meeting", time: "10:00 AM - 01:00 PM", type: "Quarterly" },
              { date: "May 28", title: "Finance & Audit Committee", time: "02:30 PM - 04:30 PM", type: "Committee" },
            ].map((meeting, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-navy-50 dark:bg-navy-800 rounded-xl border border-navy-100 dark:border-navy-700 shrink-0">
                  <span className="text-xs font-semibold text-navy-500">{meeting.date.split(' ')[0]}</span>
                  <span className="text-lg font-bold text-foreground">{meeting.date.split(' ')[1]}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{meeting.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-navy-500 mt-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {meeting.time}
                  </div>
                  <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-300">
                    {meeting.type}
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
