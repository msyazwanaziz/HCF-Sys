"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export function CategoryWidgetGrid({ data, showChart = true }: { data: any[], showChart?: boolean }) {
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
        <div className="h-[250px] w-full bg-white dark:bg-navy-900 border border-border rounded-xl p-4 shadow-sm">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedData}
                cx="50%"
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
                layout="horizontal" 
                align="center" 
                verticalAlign="bottom" 
                iconType="circle"
                formatter={(value, entry: any) => {
                  const { payload } = entry;
                  const percent = totalValue > 0 ? ((payload.value / totalValue) * 100).toFixed(1) : 0;
                  return (
                    <span className="text-navy-600 dark:text-navy-300 font-bold text-xs uppercase ml-1 mr-3">
                      {value} <span className="text-emerald-500 ml-1">{percent}%</span>
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map((item, idx) => {
          const variance = item.value - (item.target || 0);
          const pct = (item.target || 0) > 0 ? Math.round((item.value / item.target) * 100) : 0;
          const distPct = totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : "0.0";
          const isPositive = variance >= 0;
          
          return (
            <div key={idx} className="bg-white dark:bg-navy-900 border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-foreground text-sm uppercase mb-2">{item.name}</h3>
                
                {hasTargets ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-black text-foreground tracking-tight tabular-nums">{formatVal(item.value)}</div>
                      <div className="text-xs text-navy-500 font-medium mt-1">Target: {formatVal(item.target || 0)}</div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-navy-500">Variance</span>
                        <span className={`text-xs font-bold tabular-nums ${isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {isPositive ? '+' : ''}{formatVal(variance)}
                        </span>
                      </div>
                      
                      <div className="mt-4">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-medium text-navy-500">Progress</span>
                          <span className="text-sm font-black text-foreground">{pct}%</span>
                        </div>
                        <div className="w-full bg-navy-100 dark:bg-navy-800 rounded-full h-2.5 shadow-inner overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <div className="text-2xl font-black text-foreground tracking-tight tabular-nums">{formatVal(item.value)}</div>
                    </div>
                    
                    <div className="pt-2 border-t border-border">
                      <div className="mt-4">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-medium text-navy-500">Distribution</span>
                          <span className="text-sm font-black text-foreground">{distPct}%</span>
                        </div>
                        <div className="w-full bg-navy-100 dark:bg-navy-800 rounded-full h-2.5 shadow-inner overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 bg-blue-500"
                            style={{ width: `${distPct}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
