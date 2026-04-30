"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell
} from 'recharts';

const donationData = [
  { name: 'Jan', current: 4000, target: 2400 },
  { name: 'Feb', current: 3000, target: 1398 },
  { name: 'Mar', current: 2000, target: 9800 },
  { name: 'Apr', current: 2780, target: 3908 },
  { name: 'May', current: 1890, target: 4800 },
  { name: 'Jun', current: 2390, target: 3800 },
  { name: 'Jul', current: 3490, target: 4300 },
];

const allocationData = [
  { name: 'Education', value: 400 },
  { name: 'Health', value: 300 },
  { name: 'Community', value: 300 },
  { name: 'Emergency', value: 200 },
];

export function DonationsTrendChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={donationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `RM ${value/1000}k`} />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorTarget)" />
          <Area type="monotone" dataKey="current" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FundAllocationChart() {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={allocationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#0f172a', fontWeight: 500, fontSize: 12}} width={80} />
          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
            {allocationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
