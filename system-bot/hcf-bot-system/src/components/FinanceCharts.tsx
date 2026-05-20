"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

export function FinanceChartsContainer() {
  return (
    <>
      {/* Expose data via context or just render charts directly. */}
    </>
  );
}

// Rewriting individual components to fetch data (in a real app, use Context or SWR to avoid double fetching)
// For demonstration, we'll just fetch once in a shared module cache or let them double fetch. 
// Let's create a global promise to share the fetch.

const financeEventTarget = typeof window !== 'undefined' ? new EventTarget() : null;

let cachedData: any = null;
let fetchPromise: Promise<any> | null = null;

async function getSheetData(forceRefresh = false) {
  if (cachedData && !forceRefresh) return cachedData;
  if (!fetchPromise || forceRefresh) {
    const fetchUrl = forceRefresh ? '/api/analytics/sheets?forceRefresh=true' : '/api/analytics/sheets';
    fetchPromise = fetch(fetchUrl).then(async res => {
      const data = await res.json();
      cachedData = data.financeData;
      if (financeEventTarget) financeEventTarget.dispatchEvent(new Event('refreshed'));
      return cachedData;
    }).catch(err => {
      console.error("Finance Data Fetch Error:", err);
      fetchPromise = null;
      return { incomeExpense: [], fundSources: [], restricted: 0, unrestricted: 0 };
    });
  }
  return fetchPromise;
}

export function IncomeExpenseChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = () => getSheetData().then(res => setData(res.incomeExpense));
    load();
    const handler = () => load();
    if (financeEventTarget) financeEventTarget.addEventListener('refreshed', handler);
    return () => { if (financeEventTarget) financeEventTarget.removeEventListener('refreshed', handler); };
  }, []);

  if (!data.length) return <div className="h-[350px] flex items-center justify-center text-sm text-navy-400">Loading Google Sheet data...</div>;

  return (
    <div className="h-[350px] w-full animate-in fade-in duration-700 min-h-[350px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `RM ${(value/1000).toFixed(1)}k`} />
          <Tooltip 
            cursor={{fill: '#f8fafc'}} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, undefined]}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
          <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundSourcesChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = () => getSheetData().then(res => setData(res.fundSources));
    load();
    const handler = () => load();
    if (financeEventTarget) financeEventTarget.addEventListener('refreshed', handler);
    return () => { if (financeEventTarget) financeEventTarget.removeEventListener('refreshed', handler); };
  }, []);

  if (!data.length) return <div className="h-[300px] flex items-center justify-center text-sm text-navy-400">Loading...</div>;

  return (
    <div className="h-[300px] w-full flex items-center justify-center animate-in fade-in duration-700 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a' }}
            formatter={(value: any) => [`RM ${Number(value).toLocaleString()}`, undefined]}
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// A new component to render the restricted/unrestricted progress bar data
export function RestrictedFundsStatus() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = () => getSheetData().then(res => setData(res));
    load();
    const handler = () => load();
    if (financeEventTarget) financeEventTarget.addEventListener('refreshed', handler);
    return () => { if (financeEventTarget) financeEventTarget.removeEventListener('refreshed', handler); };
  }, []);

  if (!data) return <div className="h-16 animate-pulse bg-navy-50 dark:bg-navy-800 rounded-lg mt-4"></div>;

  const total = data.restricted + data.unrestricted;
  const restrictedPct = total > 0 ? Math.round((data.restricted / total) * 100) : 0;
  const unrestrictedPct = total > 0 ? Math.round((data.unrestricted / total) * 100) : 0;

  return (
    <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4 animate-in fade-in duration-700">
      <div>
        <div className="text-xs text-navy-500 font-medium mb-1">Restricted Funds</div>
        <div className="text-lg font-bold text-foreground">{restrictedPct}%</div>
        <div className="w-full bg-navy-100 rounded-full h-1.5 mt-2">
          <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${restrictedPct}%` }}></div>
        </div>
        <div className="text-[10px] text-navy-400 mt-1">RM {data.restricted.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-xs text-navy-500 font-medium mb-1">Unrestricted</div>
        <div className="text-lg font-bold text-foreground">{unrestrictedPct}%</div>
        <div className="w-full bg-navy-100 rounded-full h-1.5 mt-2">
          <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${unrestrictedPct}%` }}></div>
        </div>
        <div className="text-[10px] text-navy-400 mt-1">RM {data.unrestricted.toLocaleString()}</div>
      </div>
    </div>
  );
}

export function FinanceRefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await getSheetData(true);
    setIsRefreshing(false);
  };

  return (
    <button 
      onClick={handleRefresh} 
      disabled={isRefreshing}
      className="px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 border border-emerald-600/20 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
    >
      <svg className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
      {isRefreshing ? 'Refreshing...' : 'Refresh Live Data'}
    </button>
  );
}
