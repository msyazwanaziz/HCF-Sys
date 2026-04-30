"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, AreaChart, Area
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
}

let cachedRevenueData: RevTransaction[] | null = null;
let fetchRevenuePromise: Promise<RevTransaction[]> | null = null;

export async function getRevenueData(): Promise<RevTransaction[]> {
  if (cachedRevenueData) return cachedRevenueData;
  if (!fetchRevenuePromise) {
    fetchRevenuePromise = fetch(SHEET_URL).then(async res => {
      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim() !== '');
      
      const headers = parseCSVLine(lines[0]);
      
      const dateIdx = headers.indexOf('Date');
      const creditIdx = headers.indexOf('Credit');
      const cat1Idx = headers.indexOf('Fund Category 1');
      const cat2Idx = headers.indexOf('Fund Category 2');
      
      const qIdx = headers.indexOf('Sumbangan Umum');
      const rIdx = headers.indexOf('Tabung Cahaya HQ');
      const sIdx = headers.indexOf('Fund Raising');
      const tIdx = headers.indexOf('Ansar Initiative');
      const uIdx = headers.indexOf('Korporat');
      const vIdx = headers.indexOf('IKRAM');
      const wIdx = headers.indexOf('A. Agama');
      const xIdx = headers.indexOf('A. Kerajaan');
      const yIdx = headers.indexOf('Tabung Infaq Abadi');

      const transactions: RevTransaction[] = [];

      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length < Math.max(dateIdx, creditIdx)) continue;

        const dateStr = row[dateIdx];
        if (!dateStr || !dateStr.includes('/')) continue;
        
        const creditStr = row[creditIdx]?.replace(/,/g, '') || '0';
        const income = parseFloat(creditStr) || 0;

        if (income > 0) {
          const parts = dateStr.split('/');
          let month = 'Unknown';
          if (parts.length === 3) {
            const monthNum = parseInt(parts[1], 10);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            month = monthNames[monthNum - 1] || 'Unknown';
          }

          transactions.push({
            dateStr,
            month,
            cat1: cat1Idx > -1 ? (row[cat1Idx] || 'Uncategorized') : 'Uncategorized',
            cat2: cat2Idx > -1 ? (row[cat2Idx] || 'Uncategorized') : 'Uncategorized',
            income,
            sumbanganUmum: qIdx > -1 && !!row[qIdx],
            tabungCahayaHQ: rIdx > -1 && !!row[rIdx],
            fundRaising: sIdx > -1 && !!row[sIdx],
            ansarInitiative: tIdx > -1 && !!row[tIdx],
            korporat: uIdx > -1 && !!row[uIdx],
            ikram: vIdx > -1 && !!row[vIdx],
            agama: wIdx > -1 && !!row[wIdx],
            kerajaan: xIdx > -1 && !!row[xIdx],
            infaqAbadi: yIdx > -1 && !!row[yIdx],
          });
        }
      }

      cachedRevenueData = transactions;
      return cachedRevenueData;
    });
  }
  return fetchRevenuePromise;
}

const TARGET_SHEET_URL = "https://docs.google.com/spreadsheets/d/1MRJibLnS07vXaiJ_r_hoU2UMDzK6-gbRM2YZw4zqYds/export?format=csv&gid=1005422743";
let cachedRevenueTargets: Record<string, number> | null = null;
let fetchTargetsPromise: Promise<Record<string, number>> | null = null;

export async function getRevenueTargets(): Promise<Record<string, number>> {
  if (cachedRevenueTargets) return cachedRevenueTargets;
  if (!fetchTargetsPromise) {
    fetchTargetsPromise = fetch(TARGET_SHEET_URL).then(async res => {
      const text = await res.text();
      const lines = text.split('\n').filter(l => l.trim() !== '');
      const targets: Record<string, number> = {};
      
      for (let i = 1; i < lines.length; i++) {
        const row = parseCSVLine(lines[i]);
        if (row.length >= 2 && row[0] && row[1]) {
           const valStr = row[1].replace(/,/g, '').replace(/"/g, '');
           const val = parseFloat(valStr);
           if (!isNaN(val)) {
             targets[row[0].trim()] = val;
           }
        }
      }
      cachedRevenueTargets = targets;
      return targets;
    });
  }
  return fetchTargetsPromise;
}

export function RevenueDataWrapper({ children }: { children: (data: { transactions: RevTransaction[], targets: Record<string, number> }) => React.ReactNode }) {
  const [data, setData] = useState<{ transactions: RevTransaction[], targets: Record<string, number> } | null>(null);

  useEffect(() => {
    Promise.all([getRevenueData(), getRevenueTargets()]).then(([transactions, targets]) => {
      setData({ transactions, targets });
    });
  }, []);

  if (!data) return <div className="h-full w-full flex items-center justify-center p-12 text-navy-400">Loading live sheet data & targets...</div>;

  return <>{children(data)}</>;
}

export function InflowTrendChart({ data }: { data: any[] }) {
  return (
    <div className="h-[300px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
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
  return (
    <div className="h-[400px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
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
  return (
    <div className="h-[300px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
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
