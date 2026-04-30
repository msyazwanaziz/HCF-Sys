"use client";

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';

const incomeExpenseData = [
  { month: 'Jan', income: 4200, expense: 2400 },
  { month: 'Feb', income: 3800, expense: 2100 },
  { month: 'Mar', income: 5100, expense: 2800 },
  { month: 'Apr', income: 4600, expense: 2900 },
  { month: 'May', income: 5800, expense: 3200 },
  { month: 'Jun', income: 6200, expense: 3500 },
];

const fundSourcesData = [
  { name: 'Corporate Grants', value: 45 },
  { name: 'Individual Zakat', value: 30 },
  { name: 'Sadaqah', value: 15 },
  { name: 'Investments', value: 10 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];

export function IncomeExpenseChart() {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={incomeExpenseData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
          <Tooltip 
            cursor={{fill: '#f8fafc'}} 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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
  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={fundSourcesData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
          >
            {fundSourcesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            itemStyle={{ color: '#0f172a' }}
            formatter={(value) => `${value}%`}
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
