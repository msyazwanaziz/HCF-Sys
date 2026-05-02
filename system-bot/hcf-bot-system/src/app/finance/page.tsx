"use client";

import KPICard from "@/components/KPICard";
import { IncomeExpenseChart, FundSourcesChart, RestrictedFundsStatus } from "@/components/FinanceCharts";
import { 
  Wallet, 
  TrendingDown, 
  Landmark, 
  Scale,
  Download,
  FileCheck,
  Filter
} from "lucide-react";

export default function FinancePage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Financial Oversight</h1>
          <p className="text-navy-500 mt-1">Comprehensive view of income, expenses, and fund allocations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-surface border border-border rounded-lg text-sm font-medium text-navy-600 hover:bg-surface-hover transition-colors shadow-sm flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter Period
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download Board Pack PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard 
          title="Total Income (YTD)" 
          value="RM 29.7M" 
          trend="+12.5%" 
          trendUp={true} 
          icon={<Wallet className="w-6 h-6" />}
          subtitle="Target: RM 28.0M"
        />
        <KPICard 
          title="Total Expenses (YTD)" 
          value="RM 14.2M" 
          trend="-2.4%" 
          trendUp={true} 
          icon={<TrendingDown className="w-6 h-6" />}
          subtitle="Under budget by RM 1.1M"
        />
        <KPICard 
          title="Net Balance" 
          value="RM 15.5M" 
          trend="+5.8%"
          trendUp={true}
          icon={<Landmark className="w-6 h-6" />}
          subtitle="Current operating reserve"
        />
        <KPICard 
          title="Budget Variance" 
          value="4.2%" 
          trend="Healthy" 
          trendUp={true} 
          icon={<Scale className="w-6 h-6" />}
          subtitle="Overall positive variance"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-foreground">Income vs Expense</h2>
              <p className="text-sm text-navy-500">Monthly financial performance</p>
            </div>
            <select className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20">
              <option>2026</option>
              <option>2025</option>
            </select>
          </div>
          <IncomeExpenseChart />
        </div>

        <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
          <div className="mb-2">
            <h2 className="text-lg font-bold text-foreground">Fund Sources</h2>
            <p className="text-sm text-navy-500">Distribution of incoming funds</p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <FundSourcesChart />
          </div>
          <RestrictedFundsStatus />
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-0 border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-500" />
              Audit Tracker & Budget Variance
            </h2>
            <p className="text-sm text-navy-500 mt-1">Departmental breakdown of budget vs actuals.</p>
          </div>
          <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700">View Full Audit</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy-50 dark:bg-navy-900/50 text-navy-600 dark:text-navy-300 text-sm border-b border-border">
                <th className="px-6 py-4 font-semibold">Department</th>
                <th className="px-6 py-4 font-semibold">Allocated Budget</th>
                <th className="px-6 py-4 font-semibold">Actual Spend</th>
                <th className="px-6 py-4 font-semibold">Variance</th>
                <th className="px-6 py-4 font-semibold">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {[
                { dept: "Education & Outreach", allocated: "RM 4,500,000", actual: "RM 4,250,000", variance: "+RM 250,000", status: "Cleared", statusColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                { dept: "Welfare & Support", allocated: "RM 3,200,000", actual: "RM 3,350,000", variance: "-RM 150,000", status: "Under Review", statusColor: "text-amber-600 bg-amber-50 dark:bg-amber-900/20" },
                { dept: "Operations & Admin", allocated: "RM 1,800,000", actual: "RM 1,720,000", variance: "+RM 80,000", status: "Cleared", statusColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" },
                { dept: "Marketing & Fundraising", allocated: "RM 1,200,000", actual: "RM 1,150,000", variance: "+RM 50,000", status: "Pending Audit", statusColor: "text-navy-600 bg-navy-50 dark:bg-navy-800" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-surface-hover transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{row.dept}</td>
                  <td className="px-6 py-4 text-navy-600 dark:text-navy-300">{row.allocated}</td>
                  <td className="px-6 py-4 text-navy-600 dark:text-navy-300">{row.actual}</td>
                  <td className={`px-6 py-4 font-medium ${row.variance.startsWith('+') ? 'text-emerald-600' : 'text-red-500'}`}>
                    {row.variance}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${row.statusColor}`}>
                      {row.status}
                    </span>
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
