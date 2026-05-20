"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

export interface RevTransaction {
  dateStr: string;
  month: string;
  cat1: string;
  cat2: string;
  income: number;
  sumbanganUmum: boolean;
  tabungCahayaHQ: boolean;
  fundRaising: boolean;
  ansarInitiative: boolean;
  korporat: boolean;
  ikram: boolean;
  agama: boolean;
  kerajaan: boolean;
  infaqAbadi: boolean;
  cat1_1: string;
  bankName: string;
  branch: string;
}

let cachedRevenueData: RevTransaction[] | null = null;
let fetchRevenuePromise: Promise<RevTransaction[]> | null = null;

export async function getRevenueData(forceRefresh = false): Promise<RevTransaction[]> {
  if (cachedRevenueData && !forceRefresh) return cachedRevenueData;
  if (!fetchRevenuePromise || forceRefresh) {
    const fetchUrl = forceRefresh ? '/api/analytics/sheets?forceRefresh=true' : '/api/analytics/sheets';
    fetchRevenuePromise = fetch(fetchUrl).then(async res => {
      const data = await res.json();
      cachedRevenueData = data.revenueData.transactions;
      return cachedRevenueData || [];
    }).catch(err => {
      console.error("Revenue Data Fetch Error:", err);
      fetchRevenuePromise = null;
      return [];
    });
  }
  return fetchRevenuePromise || Promise.resolve([]);
}

let cachedRevenueTargets: Record<string, number> | null = null;
let fetchTargetsPromise: Promise<Record<string, number>> | null = null;

export async function getRevenueTargets(forceRefresh = false): Promise<Record<string, number>> {
  if (cachedRevenueTargets && !forceRefresh) return cachedRevenueTargets;
  if (!fetchTargetsPromise || forceRefresh) {
    const fetchUrl = forceRefresh ? '/api/analytics/sheets?forceRefresh=true' : '/api/analytics/sheets';
    fetchTargetsPromise = fetch(fetchUrl).then(async res => {
      const data = await res.json();
      cachedRevenueTargets = data.revenueData.targets;
      return cachedRevenueTargets || {};
    }).catch(err => {
      console.error("Revenue Targets Fetch Error:", err);
      fetchTargetsPromise = null;
      return {};
    });
  }
  return fetchTargetsPromise || Promise.resolve({});
}

export function RevenueDataWrapper({ children }: { children: (data: { transactions: RevTransaction[], targets: Record<string, number> }) => React.ReactNode }) {
  const [data, setData] = useState<{ transactions: RevTransaction[], targets: Record<string, number> } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = (force = false) => {
    if (force) setIsRefreshing(true);
    Promise.all([getRevenueData(force), getRevenueTargets(force)]).then(([transactions, targets]) => {
      setData({ transactions, targets });
      if (force) setIsRefreshing(false);
    });
  };

  useEffect(() => {
    loadData(false);
  }, []);

  if (!data) return <div className="h-full w-full flex items-center justify-center p-12 text-navy-400">Loading live sheet data & targets...</div>;

  return (
    <div className="relative">
      <div className="absolute -top-14 right-0 z-10">
        <button 
          onClick={() => loadData(true)} 
          disabled={isRefreshing}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 rounded-lg text-sm font-medium transition-colors border border-emerald-600/20"
        >
          <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>
      {children(data)}
    </div>
  );
}

export function InflowTrendChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-navy-400">No trend data available</div>;
  
  return (
    <div className="h-[300px] w-full animate-in fade-in duration-700 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} interval="preserveStartEnd" minTickGap={20} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `RM ${(value/1000).toFixed(1)}k`} />
          <Tooltip 
            cursor={{stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4'}} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, "Inflow"]}
          />
          <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Category1Chart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="h-[400px] flex items-center justify-center text-navy-400">No category data available</div>;

  return (
    <div className="h-[400px] w-full animate-in fade-in duration-700 min-h-[400px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={400}>
        <BarChart layout="vertical" data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `RM ${val/1000}k`} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#0f172a', fontWeight: 500, fontSize: 11}} width={120} />
          <Tooltip 
             cursor={{fill: '#f8fafc'}} 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
             formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`]}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
          <Bar dataKey="value" name="Actual" radius={[0, 4, 4, 0]} barSize={20} fill="#10b981">
            {data.map((entry, index) => (
              <Cell key={`cell-actual-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="target" name="Target" radius={[0, 4, 4, 0]} barSize={20} fill="var(--chart-target)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpecialCategoryChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="h-[300px] flex items-center justify-center text-navy-400 text-sm italic">No records in this category</div>;

  return (
    <div className="h-[300px] w-full animate-in fade-in duration-700 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <BarChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} interval={0} angle={-15} textAnchor="end" />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} tickFormatter={(val) => `RM ${val/1000}k`} />
          <Tooltip 
             cursor={{fill: '#f8fafc'}} 
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
             formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`]}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
          <Bar dataKey="value" name="Actual" radius={[4, 4, 0, 0]} barSize={20} fill="#3b82f6">
            {data.map((entry, index) => (
              <Cell key={`cell-actual-${index}`} fill={COLORS[(index + 4) % COLORS.length]} />
            ))}
          </Bar>
          <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} barSize={20} fill="var(--chart-target)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundSourceDoughnutChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData.reduce((acc, entry) => acc + entry.value, 0);

  return (
    <div className="h-[450px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="35%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {sortedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
            formatter={(val: any) => [`RM ${Number(val).toLocaleString()} (${((Number(val)/total)*100).toFixed(1)}%)`, undefined]}
          />
          <Legend 
            layout="vertical" 
            align="center" 
            verticalAlign="bottom" 
            iconType="circle"
            formatter={(value, entry: any) => {
              const { payload } = entry;
              const percent = ((payload.value / total) * 100).toFixed(1);
              return (
                <span className="text-navy-600 dark:text-navy-300 font-bold text-xs">
                  {value.toUpperCase()} <span className="text-emerald-500 ml-2">{percent}%</span>
                </span>
              );
            }}
            wrapperStyle={{
              paddingTop: '20px',
              bottom: 0
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HybridTableChart({ data, showChart = true }: { data: any[], showChart?: boolean }) {
  const hasTargets = data.some(item => (item.target || 0) > 0);
  const totalValue = data.reduce((acc, cur) => acc + (cur.value || 0), 0);
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

  const formatVal = (val: number) => {
    return `RM ${val.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
  };

  const sortedData = [...data].sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {showChart && (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="35%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {sortedData.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                formatter={(val: any) => [`RM ${Number(val).toLocaleString()} (${((Number(val)/totalValue)*100).toFixed(1)}%)`, undefined]}
              />
              <Legend 
                layout="vertical" 
                align="right" 
                verticalAlign="middle" 
                iconType="circle"
                formatter={(value, entry: any) => {
                  const { payload } = entry;
                  const percent = totalValue > 0 ? ((payload.value / totalValue) * 100).toFixed(1) : 0;
                  return (
                    <span className="text-navy-600 dark:text-navy-300 font-bold text-xs uppercase">
                      {value} <span className="text-emerald-500 ml-2">{percent}%</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="max-h-[380px] overflow-y-auto border border-border rounded-xl bg-background/50 shadow-sm relative">
        <table className="w-full text-left text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-navy-50 dark:bg-navy-900 text-navy-600 dark:text-navy-300 border-b border-border shadow-sm">
              <th className="px-6 py-4 font-semibold">Category Description</th>
              {hasTargets ? (
                <>
                  <th className="px-6 py-4 font-semibold text-right">Target Allocation</th>
                  <th className="px-6 py-4 font-semibold text-right">Actual Inflow</th>
                  <th className="px-6 py-4 font-semibold text-right">Variance</th>
                  <th className="px-6 py-4 font-semibold text-right w-48">Achievement Progress</th>
                </>
              ) : (
                <>
                  <th className="px-6 py-4 font-semibold text-right">Actual Inflow</th>
                  <th className="px-6 py-4 font-semibold text-right w-48">Distribution %</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((item, idx) => {
              const variance = item.value - (item.target || 0);
              const pct = (item.target || 0) > 0 ? Math.round((item.value / item.target) * 100) : 0;
              const distPct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0.0";
              const isPositive = variance >= 0;
              
              return (
                <tr key={idx} className="hover:bg-surface-hover/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{item.name}</td>
                  {hasTargets ? (
                    <>
                      <td className="px-6 py-4 text-right text-navy-600 dark:text-navy-400 tabular-nums">{formatVal(item.target || 0)}</td>
                      <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums">{formatVal(item.value)}</td>
                      <td className={`px-6 py-4 text-right font-bold tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                        {isPositive ? '+' : ''}{formatVal(variance)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-navy-100 dark:bg-navy-800 rounded-full h-2 overflow-hidden shadow-inner">
                            <div 
                              className={`h-full rounded-full transition-all duration-1000 ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-navy-700 dark:text-navy-300 w-10 text-right">{pct}%</span>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums">{formatVal(item.value)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-navy-100 dark:bg-navy-800 rounded-full h-2 overflow-hidden shadow-inner">
                            <div 
                              className="h-full rounded-full transition-all duration-1000 bg-blue-500"
                              style={{ width: `${distPct}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-navy-700 dark:text-navy-300 w-12 text-right">{distPct}%</span>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MiniInflowTrendChart({ data, strokeColor = "#10b981" }: { data: any[], strokeColor?: string }) {
  if (!data || data.length === 0) return <div className="h-[80px] flex items-center justify-center text-navy-400 text-xs italic">No data</div>;

  const allZero = data.every(item => item.income === 0);
  if (allZero) return <div className="h-[80px] flex items-center justify-center text-navy-400 text-xs italic">No transactions in selected range</div>;

  return (
    <div className="h-[80px] w-full min-h-[80px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <defs>
            <linearGradient id={`colorIncome-${strokeColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            cursor={false} 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', 
              padding: '6px 10px', 
              fontSize: '10px' 
            }}
            formatter={(value: any, name: any, props: any) => [`RM ${Number(value).toLocaleString()}`, props.payload.name]}
            labelFormatter={() => ''}
          />
          <Area type="monotone" dataKey="income" stroke={strokeColor} strokeWidth={2} fillOpacity={1} fill={`url(#colorIncome-${strokeColor.replace('#', '')})`} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
