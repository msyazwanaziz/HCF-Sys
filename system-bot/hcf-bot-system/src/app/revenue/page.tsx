"use client";

import { useState } from 'react';
import KPICard from "@/components/KPICard";
import { 
  RevenueDataWrapper, 
  RevTransaction,
  InflowTrendChart, 
  Category1Chart, 
  SpecialCategoryChart,
  HybridTableChart,
  FundSourceDoughnutChart
} from "@/components/RevenueCharts";
import { 
  Target, 
  Wallet, 
  PieChart, 
  BarChart3, 
  Building2,
  Download,
  Filter,
  CheckCircle2,
  TrendingUp,
  Settings2,
  Loader2
} from "lucide-react";

export default function RevenueDashboard() {
  const [selectedCat2, setSelectedCat2] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [trendView, setTrendView] = useState<'monthly' | 'daily'>('monthly');
  const [unit, setUnit] = useState<'k' | 'm'>('k');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatValue = (val: number) => {
    if (unit === 'm') return `RM ${(val / 1000000).toFixed(2)}M`;
    return `RM ${(val / 1000).toFixed(1)}k`;
  };

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
        const cat1_1Map: Record<string, number> = {};
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

          // Cat 1-1 & 2
          if (tx.cat1_1) cat1_1Map[tx.cat1_1] = (cat1_1Map[tx.cat1_1] || 0) + tx.income;
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

        // Correctly map Fund Source targets (Cat 1-1)
        const cat1Data = Object.keys(cat1_1Map)
          .map(name => {
            const targetKey = name.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            return { 
              name, 
              value: Math.round(cat1_1Map[name]),
              target: targets[targetKey] || targets[name] || targets[name.toUpperCase()] || 0
            };
          })
          .sort((a, b) => b.value - a.value);

        const topCat1 = cat1Data[0] || { name: 'N/A', value: 0 };
        const topCat2 = cat2Data[0] || { name: 'N/A', value: 0 };
        const specialSum = group1Data.reduce((acc: number, cur: any) => acc + cur.value, 0) + group2Data.reduce((acc: number, cur: any) => acc + cur.value, 0);

        // Targets for scorecards
        const overallTarget = targets['Total Fund'] || targets['OVERALL'] || 8017439;
        const totalActual = rawData.reduce((acc, tx) => acc + tx.income, 0);
        const achievementPct = overallTarget > 0 ? Math.round((totalActual / overallTarget) * 100) : 0;
        
        const cat1Target = cat1Data.reduce((acc, cur) => acc + cur.target, 0);
        const specialTarget = group1Data.reduce((acc, cur) => acc + cur.target, 0) + group2Data.reduce((acc, cur) => acc + cur.target, 0);

        const handleExport = () => {
          setIsExporting(true);
          setTimeout(() => {
            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
          }, 1500);
        };

        return (
          <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 relative">
            {exportSuccess && (
              <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right-8 duration-500 flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span className="font-bold text-sm">Revenue report exported successfully!</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Income & Revenue Summaries</h1>
                <p className="text-navy-500 mt-1">Live inflow mapping based on Google Sheets data sources.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isExporting ? "Exporting..." : "Export Sheet"}
                </button>
              </div>
            </div>

            {/* Slicers Row */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground mr-2">Filters:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-navy-500">Fund Source</label>
                  <select 
                    className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[200px]"
                    value={selectedCat2}
                    onChange={(e) => setSelectedCat2(e.target.value)}
                  >
                    <option value="All">All Sources</option>
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

              <div className="flex items-center gap-2 bg-navy-50 dark:bg-navy-900 rounded-lg p-1 border border-border">
                <button 
                  onClick={() => setUnit('k')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === 'k' ? 'bg-white dark:bg-navy-800 text-emerald-600 shadow-sm' : 'text-navy-500'}`}
                >
                  RM (k)
                </button>
                <button 
                  onClick={() => setUnit('m')}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${unit === 'm' ? 'bg-white dark:bg-navy-800 text-emerald-600 shadow-sm' : 'text-navy-500'}`}
                >
                  RM (M)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Total Inflow (YTD)" 
                value={formatValue(totalActual)} 
                trend={`${achievementPct}% Achievement`} 
                trendUp={achievementPct >= 100} 
                icon={<Wallet className="w-6 h-6" />}
                subtitle={
                  <div className="flex flex-col">
                    <span>Target: {formatValue(overallTarget)}</span>
                    <span className="text-[10px] text-navy-400 mt-1">Full: RM {totalActual.toLocaleString()}</span>
                  </div>
                }
              />
              <KPICard 
                title="Fund Source (Top)" 
                value={formatValue(topCat1.value)} 
                trend={topCat1.name} 
                trendUp={true} 
                icon={<PieChart className="w-6 h-6" />}
                subtitle={`Target: ${formatValue(cat1Target)}`}
              />
              <KPICard 
                title="Special Partners" 
                value={formatValue(specialSum)} 
                trend={`${Math.round((specialSum / specialTarget) * 100)}% of Target`} 
                trendUp={specialSum >= specialTarget} 
                icon={<Building2 className="w-6 h-6" />}
                subtitle={`Target: ${formatValue(specialTarget)}`}
              />
              <KPICard 
                title="Performance Status" 
                value={achievementPct >= 75 ? "Healthy" : achievementPct >= 50 ? "Caution" : "At Risk"} 
                trend="Live Data" 
                trendUp={achievementPct >= 75} 
                icon={<TrendingUp className="w-6 h-6" />}
                subtitle="Based on overall OKR targets"
              />
            </div>

            <div className="space-y-6">
              {/* Trend Full Width */}
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Inflow Trend Strategic Analysis</h2>
                    <p className="text-sm text-navy-500">Live monthly and daily revenue performance tracking</p>
                  </div>
                  <div className="flex items-center bg-navy-50 dark:bg-navy-900 rounded-lg p-1 border border-border">
                    <button 
                      onClick={() => setTrendView('monthly')}
                      className={`px-3 py-1 text-[10px] font-medium rounded-md transition-colors ${trendView === 'monthly' ? 'bg-white dark:bg-navy-800 text-foreground shadow-sm' : 'text-navy-500 hover:text-foreground'}`}
                    >
                      Monthly
                    </button>
                    <button 
                      onClick={() => setTrendView('daily')}
                      className={`px-3 py-1 text-[10px] font-medium rounded-md transition-colors ${trendView === 'daily' ? 'bg-white dark:bg-navy-800 text-foreground shadow-sm' : 'text-navy-500 hover:text-foreground'}`}
                    >
                      Daily
                    </button>
                  </div>
                </div>
                <div className="flex-1">
                  <InflowTrendChart data={trendChartData} />
                </div>
              </div>

              {/* Fund Source Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">Fund Distribution</h2>
                    <p className="text-sm text-navy-500">Categorical breakdown</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <FundSourceDoughnutChart data={cat1Data} />
                  </div>
                </div>
                <div className="lg:col-span-2 bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">Fund Source Performance Ledger</h2>
                    <p className="text-sm text-navy-500">Detailed mapping of Restricted & Unrestricted allocations</p>
                  </div>
                  <div className="flex-1">
                    <HybridTableChart data={cat1Data} showChart={false} />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Sumbangan & Tabung (Col Q-T, Y)</h2>
                  <p className="text-sm text-navy-500">Target vs Actual Performance Breakdown</p>
                </div>
                <HybridTableChart data={group1Data} />
              </div>
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Agencies & Corporate (Col U-X)</h2>
                  <p className="text-sm text-navy-500">Target vs Actual Performance Breakdown</p>
                </div>
                <HybridTableChart data={group2Data} />
              </div>
            </div>
          </div>
        );
      }}
    </RevenueDataWrapper>
  );
}
