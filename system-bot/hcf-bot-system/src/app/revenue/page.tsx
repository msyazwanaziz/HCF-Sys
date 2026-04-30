"use client";

import { useState } from 'react';
import KPICard from "@/components/KPICard";
import { 
  RevenueDataWrapper, 
  RevTransaction,
  InflowTrendChart, 
  Category1Chart, 
  SpecialCategoryChart 
} from "@/components/RevenueCharts";
import { 
  Wallet, 
  PieChart, 
  BarChart3, 
  Building2,
  Download,
  Filter
} from "lucide-react";

export default function RevenueDashboard() {
  const [selectedCat2, setSelectedCat2] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [trendView, setTrendView] = useState<'monthly' | 'daily'>('monthly');

  return (
    <RevenueDataWrapper>
      {(data) => {
        const rawData = data.transactions;
        const targets = data.targets;

        // Extract unique options for slicers
        const cats = new Set(rawData.map((tx: RevTransaction) => tx.cat2));
        const uniqueCat2 = Array.from(cats).filter(c => c !== 'Uncategorized').sort();

        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const months = new Set(rawData.map((tx: RevTransaction) => tx.month));
        const uniqueMonths = Array.from(months).filter(m => m !== 'Unknown').sort((a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b));

        // Filter data
        const filteredData = rawData.filter((tx: RevTransaction) => {
          if (selectedCat2 !== 'All' && tx.cat2 !== selectedCat2) return false;
          if (selectedMonth !== 'All' && tx.month !== selectedMonth) return false;
          return true;
        });

        // Compute Aggregations
        let totalInflow = 0;
        const trendMap: Record<string, number> = {};
        const cat1Map: Record<string, number> = {};
        const cat2Map: Record<string, number> = {};
        const group1Cats = {
          'Sumbangan Umum': 0,
          'Tabung Cahaya HQ': 0,
          'Fund Raising': 0,
          'Ansar Initiative': 0,
          'Tabung Infaq Abadi': 0
        };
        const group2Cats = {
          'Korporat': 0,
          'IKRAM': 0,
          'Agensi Agama': 0,
          'Agensi Kerajaan': 0
        };

        filteredData.forEach((tx: RevTransaction) => {
          totalInflow += tx.income;
          
          // Trend
          const trendKey = trendView === 'monthly' ? tx.month : tx.dateStr;
          trendMap[trendKey] = (trendMap[trendKey] || 0) + tx.income;

          // Cat 1 & 2
          if (tx.cat1) cat1Map[tx.cat1] = (cat1Map[tx.cat1] || 0) + tx.income;
          if (tx.cat2) cat2Map[tx.cat2] = (cat2Map[tx.cat2] || 0) + tx.income;

          // Group 1
          if (tx.sumbanganUmum) group1Cats['Sumbangan Umum'] += tx.income;
          if (tx.tabungCahayaHQ) group1Cats['Tabung Cahaya HQ'] += tx.income;
          if (tx.fundRaising) group1Cats['Fund Raising'] += tx.income;
          if (tx.ansarInitiative) group1Cats['Ansar Initiative'] += tx.income;
          if (tx.infaqAbadi) group1Cats['Tabung Infaq Abadi'] += tx.income;
          
          // Group 2
          if (tx.korporat) group2Cats['Korporat'] += tx.income;
          if (tx.ikram) group2Cats['IKRAM'] += tx.income;
          if (tx.agama) group2Cats['Agensi Agama'] += tx.income;
          if (tx.kerajaan) group2Cats['Agensi Kerajaan'] += tx.income;
        });

        // Format for Recharts
        const trendChartData = Object.keys(trendMap).map(name => ({
          name,
          income: Math.round(trendMap[name])
        }));

        if (trendView === 'monthly') {
          const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          trendChartData.sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
        } else {
          // Sort dates
          trendChartData.sort((a, b) => {
            const [d1, m1, y1] = a.name.split('/');
            const [d2, m2, y2] = b.name.split('/');
            return new Date(`${y1}-${m1}-${d1}`).getTime() - new Date(`${y2}-${m2}-${d2}`).getTime();
          });
        }

        const cat1Data = Object.keys(cat1Map)
          .map(name => ({ 
            name, 
            value: Math.round(cat1Map[name]),
            target: targets[name] || 0
          }))
          .sort((a, b) => b.value - a.value);

        const cat2Data = Object.keys(cat2Map)
          .map(name => ({ name, value: Math.round(cat2Map[name]) }))
          .sort((a, b) => b.value - a.value);

        const group1Data = Object.keys(group1Cats)
          .map(name => ({ 
            name, 
            value: Math.round(group1Cats[name as keyof typeof group1Cats]),
            target: targets[name] || 0
          }))
          .filter(item => item.value > 0 || item.target > 0)
          .sort((a, b) => b.value - a.value);

        const group2Data = Object.keys(group2Cats)
          .map(name => ({ 
            name, 
            value: Math.round(group2Cats[name as keyof typeof group2Cats]),
            target: targets[name] || 0
          }))
          .filter(item => item.value > 0 || item.target > 0)
          .sort((a, b) => b.value - a.value);

        const topCat1 = cat1Data[0] || { name: 'N/A', value: 0 };
        const topCat2 = cat2Data[0] || { name: 'N/A', value: 0 };
        const specialSum = group1Data.reduce((acc: number, cur: any) => acc + cur.value, 0) + group2Data.reduce((acc: number, cur: any) => acc + cur.value, 0);

        return (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Income & Revenue Summaries</h1>
                <p className="text-navy-500 mt-1">Live inflow mapping based on Google Sheets data sources.</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Sheet
                </button>
              </div>
            </div>

            {/* Slicers Row */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center gap-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-bold text-foreground mr-2">Filters:</span>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-navy-500">Fund Category 2</label>
                <select 
                  className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[200px]"
                  value={selectedCat2}
                  onChange={(e) => setSelectedCat2(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {uniqueCat2.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-navy-500">Month</label>
                <select 
                  className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[120px]"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="All">All Months</option>
                  {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Total Inflow (Filtered)" 
                value={`RM ${(totalInflow / 1000).toFixed(1)}k`} 
                trend="Real-time" 
                trendUp={true} 
                icon={<Wallet className="w-6 h-6" />}
                subtitle="Sum of matching transactions"
              />
              <KPICard 
                title="Top Category 1" 
                value={`RM ${(topCat1.value / 1000).toFixed(1)}k`} 
                trend={topCat1.name} 
                trendUp={true} 
                icon={<PieChart className="w-6 h-6" />}
                subtitle="Highest contributor by Fund Cat 1"
              />
              <KPICard 
                title="Top Category 2" 
                value={`RM ${(topCat2.value / 1000).toFixed(1)}k`} 
                trend={topCat2.name.substring(0, 15)} 
                trendUp={true} 
                icon={<BarChart3 className="w-6 h-6" />}
                subtitle="Highest contributor by Fund Cat 2"
              />
              <KPICard 
                title="Special Partners" 
                value={`RM ${(specialSum / 1000).toFixed(1)}k`} 
                trend="U to Y" 
                trendUp={true} 
                icon={<Building2 className="w-6 h-6" />}
                subtitle="Agencies, Corporate & IKRAM"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Total Inflow Trend</h2>
                    <p className="text-sm text-navy-500">Timeline of incoming transactions</p>
                  </div>
                  <div className="flex items-center bg-navy-50 dark:bg-navy-900 rounded-lg p-1 border border-border">
                    <button 
                      onClick={() => setTrendView('daily')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${trendView === 'daily' ? 'bg-white dark:bg-navy-800 text-foreground shadow-sm' : 'text-navy-500 hover:text-foreground'}`}
                    >
                      Daily
                    </button>
                    <button 
                      onClick={() => setTrendView('monthly')}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${trendView === 'monthly' ? 'bg-white dark:bg-navy-800 text-foreground shadow-sm' : 'text-navy-500 hover:text-foreground'}`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <InflowTrendChart data={trendChartData} />
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                <div className="mb-2">
                  <h2 className="text-lg font-bold text-foreground">Fund Category</h2>
                  <p className="text-sm text-navy-500">Restricted vs Unrestricted</p>
                </div>
                <div className="flex-1 flex flex-col justify-center min-h-[300px]">
                  <Category1Chart data={cat1Data} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Sumbangan & Tabung (Col Q-T, Y)</h2>
                  <p className="text-sm text-navy-500">Target vs Actual</p>
                </div>
                <SpecialCategoryChart data={group1Data} />
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Agencies & Corporate (Col U-X)</h2>
                  <p className="text-sm text-navy-500">Target vs Actual</p>
                </div>
                <SpecialCategoryChart data={group2Data} />
              </div>
            </div>
          </div>
        );
      }}
    </RevenueDataWrapper>
  );
}
