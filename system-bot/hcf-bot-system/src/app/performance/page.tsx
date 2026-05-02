"use client";

import KPICard from "@/components/KPICard";
import { DepartmentRadarChart, ProgressWaterfallChart } from "@/components/PerformanceCharts";
import { 
  Target, 
  TrendingUp, 
  ShieldAlert, 
  CheckCircle2,
  Download,
  Filter,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from "lucide-react";

const objectives = [
  { 
    id: "OBJ-01", 
    title: "Financial Sustainability & Growth", 
    dept: "Finance", 
    progress: 85, 
    status: "On Track", 
    trend: "up" 
  },
  { 
    id: "OBJ-02", 
    title: "National Outreach Expansion", 
    dept: "Outreach", 
    progress: 62, 
    status: "At Risk", 
    trend: "down" 
  },
  { 
    id: "OBJ-03", 
    title: "Digital Transformation & Automation", 
    dept: "IT", 
    progress: 45, 
    status: "Behind", 
    trend: "down" 
  },
  { 
    id: "OBJ-04", 
    title: "Enhance Corporate Partnerships", 
    dept: "Marketing", 
    progress: 92, 
    status: "Achieved", 
    trend: "up" 
  },
  { 
    id: "OBJ-05", 
    title: "Staff Capability Development", 
    dept: "HR & Admin", 
    progress: 78, 
    status: "On Track", 
    trend: "flat" 
  },
];

export default function PerformanceDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Strategic Performance</h1>
          <p className="text-navy-500 mt-1">Organization-wide progress against 2026 strategic objectives (OKRs).</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-navy-600 hover:bg-surface-hover transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Department
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Scorecard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Overall Strategy Completion" 
          value="68%" 
          trend="+5.2%" 
          trendUp={true} 
          icon={<Target className="w-6 h-6" />}
          subtitle="Year-to-Date Average"
        />
        <KPICard 
          title="Objectives On Track" 
          value="18 / 24" 
          trend="75% Healthy" 
          trendUp={true} 
          icon={<CheckCircle2 className="w-6 h-6" />}
          subtitle="Active Key Results"
        />
        <KPICard 
          title="High Risk Objectives" 
          value="3" 
          trend="Requires Attention" 
          trendUp={false} 
          icon={<ShieldAlert className="w-6 h-6" />}
          subtitle="Escalated to Board"
        />
        <KPICard 
          title="Top Performing Dept" 
          value="Finance" 
          trend="85% Score" 
          trendUp={true} 
          icon={<TrendingUp className="w-6 h-6" />}
          subtitle="Exceeding Q2 Targets"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Annual OKR Trajectory</h2>
              <p className="text-sm text-navy-500">Actual completion vs planned target</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-navy-600 font-medium">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="text-navy-600 font-medium">Target</span>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-[350px]">
            <ProgressWaterfallChart />
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-foreground">Department Radar</h2>
            <p className="text-sm text-navy-500">Multi-dimensional performance analysis</p>
          </div>
          <div className="flex-1 flex flex-col justify-center min-h-[350px]">
            <DepartmentRadarChart />
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-0 border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Strategic Initiatives Scorecard
            </h2>
            <p className="text-sm text-navy-500 mt-1">Detailed breakdown of top-level organizational objectives.</p>
          </div>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View Full Masterplan</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-50 dark:bg-navy-900/50 text-navy-600 dark:text-navy-300 text-sm border-b border-border">
                <th className="px-6 py-4 font-semibold w-16">ID</th>
                <th className="px-6 py-4 font-semibold">Strategic Objective</th>
                <th className="px-6 py-4 font-semibold">Lead Dept</th>
                <th className="px-6 py-4 font-semibold w-48">Progress</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold w-16 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {objectives.map((obj) => (
                <tr key={obj.id} className="hover:bg-surface-hover transition-colors">
                  <td className="px-6 py-4 font-medium text-navy-500">{obj.id}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{obj.title}</td>
                  <td className="px-6 py-4 text-navy-600 dark:text-navy-300">{obj.dept}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-navy-100 dark:bg-navy-800 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            obj.progress >= 80 ? 'bg-emerald-500' : obj.progress >= 60 ? 'bg-amber-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${obj.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-medium text-navy-700 dark:text-navy-300 w-8">{obj.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      obj.status === 'Achieved' ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' :
                      obj.status === 'On Track' ? 'text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400' :
                      obj.status === 'At Risk' ? 'text-amber-700 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' :
                      'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {obj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {obj.trend === 'up' ? <ArrowUpRight className="w-4 h-4 text-emerald-500 mx-auto" /> :
                     obj.trend === 'down' ? <ArrowDownRight className="w-4 h-4 text-red-500 mx-auto" /> :
                     <Minus className="w-4 h-4 text-navy-400 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
