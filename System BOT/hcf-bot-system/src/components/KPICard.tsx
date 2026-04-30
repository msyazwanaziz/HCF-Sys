"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: ReactNode;
  subtitle?: string;
}

export default function KPICard({ title, value, trend, trendUp, icon, subtitle }: KPICardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-navy-50 dark:bg-navy-800 rounded-xl text-navy-600 dark:text-emerald-400">
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
            trendUp 
              ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" 
              : "text-red-600 bg-red-50 dark:bg-red-900/20"
          }`}>
            {trendUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-navy-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
        {subtitle && <p className="text-xs text-navy-400">{subtitle}</p>}
      </div>
    </div>
  );
}
