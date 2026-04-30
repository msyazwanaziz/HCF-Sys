"use client";

import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, ReferenceLine
} from 'recharts';

const departmentPerformance = [
  { subject: 'Finance', score: 85, target: 80, fullMark: 100 },
  { subject: 'Operations', score: 72, target: 85, fullMark: 100 },
  { subject: 'Outreach', score: 90, target: 85, fullMark: 100 },
  { subject: 'Marketing', score: 65, target: 75, fullMark: 100 },
  { subject: 'HR & Admin', score: 88, target: 80, fullMark: 100 },
  { subject: 'IT', score: 78, target: 80, fullMark: 100 },
];

export function DepartmentRadarChart() {
  return (
    <div className="h-[350px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={departmentPerformance}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Current Score" dataKey="score" stroke="#10b981" strokeWidth={2} fill="#10b981" fillOpacity={0.4} />
          <Radar name="Target Score" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="3 3" fill="none" />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a' }}
            formatter={(value: any) => [`${value}%`, undefined]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

const quarterlyProgress = [
  { name: 'Q1', actual: 24, target: 25 },
  { name: 'Q2', actual: 45, target: 50 },
  { name: 'Q3', actual: 68, target: 75 },
  { name: 'Q4 (Proj)', actual: 92, target: 100 },
];

export function ProgressWaterfallChart() {
  return (
    <div className="h-[350px] w-full animate-in fade-in duration-700">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={quarterlyProgress} margin={{ top: 20, right: 30, left: -20, bottom: 0 }} barGap={0}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
          <Tooltip 
            cursor={{fill: '#f8fafc'}} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => [`${value}%`, undefined]}
          />
          <ReferenceLine y={100} stroke="#94a3b8" strokeDasharray="3 3" />
          <Bar dataKey="actual" name="Actual Progress" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
          <Bar dataKey="target" name="Target Plan" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
