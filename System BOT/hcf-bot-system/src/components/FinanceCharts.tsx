"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1MRJibLnS07vXaiJ_r_hoU2UMDzK6-gbRM2YZw4zqYds/export?format=csv&gid=2146182837";
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

function parseCSVLine(line: string) {
  const result = [];
  let inQuotes = false;
  let currentVal = '';
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(currentVal.trim());
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  result.push(currentVal.trim());
  return result;
}

export function FinanceChartsContainer() {
  const [incomeExpenseData, setIncomeExpenseData] = useState<{ month: string, income: number, expense: number }[]>([]);
  const [fundSourcesData, setFundSourcesData] = useState<{ name: string, value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();
        const lines = text.split('\n').filter(l => l.trim() !== '');
        
        const headers = parseCSVLine(lines[0]);
        const dateIdx = headers.indexOf('Date');
        const creditIdx = headers.indexOf('Credit');
        const debitIdx = headers.indexOf('Debit');
        const fundCatIdx = headers.indexOf('Fund Category');

        const monthlyData: Record<string, { income: number, expense: number }> = {};
        const sourcesData: Record<string, number> = {};

        // Parse rows
        for (let i = 1; i < lines.length; i++) {
          const row = parseCSVLine(lines[i]);
          if (row.length < Math.max(dateIdx, creditIdx, debitIdx, fundCatIdx)) continue;

          const dateStr = row[dateIdx];
          if (!dateStr || !dateStr.includes('/')) continue;
          
          // Parse amount (remove commas and quotes)
          const creditStr = row[creditIdx]?.replace(/,/g, '') || '0';
          const debitStr = row[debitIdx]?.replace(/,/g, '') || '0';
          const creditVal = parseFloat(creditStr);
          const debitVal = parseFloat(debitStr);
          const income = isNaN(creditVal) ? 0 : creditVal;
          const expense = isNaN(debitVal) ? 0 : debitVal;

          // Group by Month-Year (e.g., 01/01/2026 -> Jan)
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const monthNum = parseInt(parts[1], 10);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = monthNames[monthNum - 1] || 'Unknown';

            if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
            monthlyData[month].income += income;
            monthlyData[month].expense += expense;
          }

          // Group Fund Sources (only income > 0)
          if (income > 0) {
            let cat = row[fundCatIdx] || 'Others';
            if (cat.length > 20) cat = cat.substring(0, 20) + '...';
            if (!sourcesData[cat]) sourcesData[cat] = 0;
            sourcesData[cat] += income;
          }
        }

        // Format for Recharts
        const formattedMonthly = Object.keys(monthlyData).map(month => ({
          month,
          income: Math.round(monthlyData[month].income),
          expense: Math.round(monthlyData[month].expense)
        }));

        // Sort months roughly (assuming data is sequential or just sort by a predefined array)
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        formattedMonthly.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

        // Get top 6 fund sources
        const formattedSources = Object.keys(sourcesData)
          .map(name => ({ name, value: Math.round(sourcesData[name]) }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 6);

        setIncomeExpenseData(formattedMonthly);
        setFundSourcesData(formattedSources);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching sheet data:", err);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="h-full w-full flex items-center justify-center text-navy-400">Loading live data from Google Sheets...</div>;
  }

  return (
    <>
      {/* Expose data via context or just render charts directly. 
          To avoid breaking the page structure, we will just export the charts as components that use this data. 
          Actually, since page.tsx imports IncomeExpenseChart and FundSourcesChart separately, 
          it's better to fetch in a parent or fetch in each. We'll export the individual charts and fetch in them. */}
    </>
  );
}

// Rewriting individual components to fetch data (in a real app, use Context or SWR to avoid double fetching)
// For demonstration, we'll just fetch once in a shared module cache or let them double fetch. 
// Let's create a global promise to share the fetch.

let cachedData: any = null;
let fetchPromise: Promise<any> | null = null;

async function getSheetData() {
  if (cachedData) return cachedData;
  if (!fetchPromise) {
    fetchPromise = fetch(SHEET_URL).then(async res => {
      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim() !== '');
      
      const headers = parseCSVLine(lines[0]);
      const dateIdx = headers.indexOf('Date');
      const creditIdx = headers.indexOf('Credit');
      const debitIdx = headers.indexOf('Debit');
      const fundCatIdx = headers.indexOf('Fund Category');

      const monthlyData: Record<string, { income: number, expense: number }> = {};
      const sourcesData: Record<string, number> = {};
      let totalRestricted = 0;
      let totalUnrestricted = 0;

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length < Math.max(dateIdx, creditIdx, debitIdx, fundCatIdx)) continue;

        const dateStr = row[dateIdx];
        if (!dateStr || !dateStr.includes('/')) continue;
        
        const creditStr = row[creditIdx]?.replace(/,/g, '') || '0';
        const debitStr = row[debitIdx]?.replace(/,/g, '') || '0';
        const income = parseFloat(creditStr) || 0;
        const expense = parseFloat(debitStr) || 0;

        const parts = dateStr.split('/');
        if (parts.length === 3) {
          const monthNum = parseInt(parts[1], 10);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const month = monthNames[monthNum - 1] || 'Unknown';

          if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
          monthlyData[month].income += income;
          monthlyData[month].expense += expense;
        }

        if (income > 0) {
          let cat = row[fundCatIdx] || 'Others';
          if (cat.length > 20) cat = cat.substring(0, 20) + '...';
          if (!sourcesData[cat]) sourcesData[cat] = 0;
          sourcesData[cat] += income;
          
          // Try to guess restricted vs unrestricted based on Fund Category 1 if it exists
          const cat1Idx = headers.indexOf('Fund Category 1');
          if (cat1Idx > -1) {
             const cat1 = row[cat1Idx] || '';
             if (cat1.toUpperCase().includes('UNRESTRICTED')) {
                totalUnrestricted += income;
             } else if (cat1.toUpperCase().includes('RESTRICTED') || cat1.toUpperCase().includes('ZAKAT')) {
                totalRestricted += income;
             } else {
                totalUnrestricted += income;
             }
          }
        }
      }

      const formattedMonthly = Object.keys(monthlyData).map(month => ({
        month,
        income: Math.round(monthlyData[month].income),
        expense: Math.round(monthlyData[month].expense)
      }));
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      formattedMonthly.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

      const formattedSources = Object.keys(sourcesData)
        .map(name => ({ name, value: Math.round(sourcesData[name]) }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      cachedData = { incomeExpense: formattedMonthly, fundSources: formattedSources, restricted: totalRestricted, unrestricted: totalUnrestricted };
      return cachedData;
    });
  }
  return fetchPromise;
}

export function IncomeExpenseChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getSheetData().then(res => setData(res.incomeExpense));
  }, []);

  if (!data.length) return <div className="h-[350px] flex items-center justify-center text-sm text-navy-400">Loading Google Sheet data...</div>;

  return (
    <div className="h-[350px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
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
    getSheetData().then(res => setData(res.fundSources));
  }, []);

  if (!data.length) return <div className="h-[300px] flex items-center justify-center text-sm text-navy-400">Loading...</div>;

  return (
    <div className="h-[300px] w-full flex items-center justify-center animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
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
    getSheetData().then(res => setData(res));
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
