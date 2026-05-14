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
  Loader2,
  TrendingDown
} from "lucide-react";

export default function AnalysisDashboard() {
  const [selectedCat2, setSelectedCat2] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedBank, setSelectedBank] = useState('All');
  const [selectedBranch, setSelectedBranch] = useState('All');
  const [trendView, setTrendView] = useState<'monthly' | 'daily'>('monthly');
  const [unit, setUnit] = useState<'k' | 'm'>('k');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const formatValue = (val: number) => {
    if (unit === 'm') return `RM ${(val / 1000000).toFixed(2)}M`;
    return `RM ${(val / 1000).toFixed(1)}k`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 slide-in-from-bottom-2">
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

        const banks = new Set(rawData.map((tx: RevTransaction) => tx.bankName));
        const uniqueBanks = Array.from(banks).filter(b => b !== 'Unknown').sort();

        const branches = new Set(rawData.map((tx: RevTransaction) => tx.branch));
        const uniqueBranches = Array.from(branches).filter(b => b !== 'Unknown').sort();

        // Filter data
        const filteredData = rawData.filter((tx: RevTransaction) => {
          if (selectedCat2 !== 'All' && tx.cat2 !== selectedCat2) return false;
          if (selectedMonth !== 'All' && tx.month !== selectedMonth) return false;
          if (selectedBank !== 'All' && tx.bankName !== selectedBank) return false;
          if (selectedBranch !== 'All' && tx.branch !== selectedBranch) return false;
          return true;
        });

        // Compute Aggregations
        let totalInflow = 0;
        const trendMap: Record<string, number> = {};
        const cat1_1Map: Record<string, number> = {};
        const cat2Map: Record<string, number> = {};
        const bankMap: Record<string, number> = {};
        const branchMap: Record<string, number> = {};

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
          
          // Bank & Branch
          if (tx.bankName && tx.bankName !== 'Unknown') bankMap[tx.bankName] = (bankMap[tx.bankName] || 0) + tx.income;
          if (tx.branch && tx.branch !== 'Unknown') branchMap[tx.branch] = (branchMap[tx.branch] || 0) + tx.income;

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

        // Branch data for chart
        const branchData = Object.keys(branchMap)
          .map(name => ({ name, value: Math.round(branchMap[name]) }))
          .sort((a, b) => b.value - a.value);

        const sortedBanks = Object.entries(bankMap).sort((a, b) => b[1] - a[1]);
        const topBank = sortedBanks[0] || ['N/A', 0];
        const topCat1 = cat1Data[0] || { name: 'N/A', value: 0, target: 0 };
        const topCat2 = cat2Data[0] || { name: 'N/A', value: 0 };
        
        // Targets for scorecards
        const overallTarget = targets['Total Fund'] || targets['OVERALL'] || 8017439;
        
        // Total Actual based on filters
        const totalActual = totalInflow;
        const achievementPct = overallTarget > 0 ? Math.round((totalActual / overallTarget) * 100) : 0;

        const handleExport = () => {
          setIsExporting(true);
          setTimeout(() => {
            setIsExporting(false);
            setExportSuccess(true);
            setTimeout(() => setExportSuccess(false), 3000);
          }, 1500);
        };

        return (
          <div className="space-y-8 relative">
            {exportSuccess && (
              <div className="fixed top-8 right-8 z-[200] bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-right-8 duration-500 flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3" />
                </div>
                <span className="font-bold text-sm">Analysis report exported successfully!</span>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Financial Analysis Dashboard</h1>
                <p className="text-navy-500 mt-1">Advanced financial analysis with bank and branch filtering.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-emerald-600/20 flex items-center gap-2"
                >
                  {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  {isExporting ? "Exporting..." : "Export Analysis"}
                </button>
              </div>
            </div>

            {/* Slicers Row */}
            <div className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground mr-2">Core Filters:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-navy-500">Fund Source (Cat 2)</label>
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
                
                <div className="flex items-center gap-2 bg-navy-50 dark:bg-navy-900 rounded-lg p-1 border border-border ml-auto">
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

              <div className="flex flex-wrap items-center gap-6 border-t border-border pt-4">
                <div className="flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-bold text-foreground mr-2">Analysis Filters:</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-navy-500">Bank Name</label>
                  <select 
                    className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[200px]"
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    <option value="All">All Banks</option>
                    {uniqueBanks.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-medium text-navy-500">Branch (Negeri/Jabatan)</label>
                  <select 
                    className="bg-background border border-border text-sm rounded-lg px-3 py-1.5 text-navy-600 outline-none focus:ring-2 focus:ring-emerald-500/20 min-w-[200px]"
                    value={selectedBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                  >
                    <option value="All">All Branches</option>
                    {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Scorecard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard 
                title="Total Inflow" 
                value={formatValue(totalActual)} 
                trend={`${achievementPct}% of Target`} 
                trendUp={achievementPct >= 100} 
                icon={<Wallet className="w-6 h-6 text-emerald-500" />}
                subtitle={
                  <div className="flex flex-col">
                    <span className="text-navy-400">Target: {formatValue(overallTarget)}</span>
                  </div>
                }
              />
              <KPICard 
                title="Top Bank" 
                value={formatValue(topBank[1] as number)} 
                trend="Highest" 
                trendUp={true} 
                icon={<Building2 className="w-6 h-6 text-blue-500" />}
                subtitle={
                  <div className="flex flex-col">
                    <span className="text-foreground font-bold">{topBank[0]}</span>
                    <span className="text-navy-400">Primary contributor bank</span>
                  </div>
                }
              />
              <KPICard 
                title="Top Category 1 Fund" 
                value={formatValue(topCat1.value)} 
                trend="Highest" 
                trendUp={true} 
                icon={<BarChart3 className="w-6 h-6 text-amber-500" />}
                subtitle={
                  <div className="flex flex-col">
                    <span className="text-foreground font-bold">{topCat1.name}</span>
                    <span className="text-navy-400">Leading fund category 1</span>
                  </div>
                }
              />
              <KPICard 
                title="Top Category 2 Fund" 
                value={formatValue(topCat2.value)} 
                trend="Highest" 
                trendUp={true} 
                icon={<PieChart className="w-6 h-6 text-purple-500" />}
                subtitle={
                  <div className="flex flex-col">
                    <span className="text-foreground font-bold">{topCat2.name}</span>
                    <span className="text-navy-400">Leading fund category 2</span>
                  </div>
                }
              />
            </div>

            {/* Charts Section */}
            <div className="space-y-6">
              {/* Inflow Trend Chart */}
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Inflow Trend</h2>
                    <p className="text-sm text-navy-500">Historical performance trend based on filters</p>
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

              {/* Inflow vs Branch */}
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-foreground">Inflow vs Branch (Negeri/Jabatan)</h2>
                  <p className="text-sm text-navy-500">Revenue distribution by state or department</p>
                </div>
                <div className="flex-1">
                  <Category1Chart data={branchData} />
                </div>
              </div>

              {/* Fund Source Distribution */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">Inflow vs Category 1 Fund</h2>
                    <p className="text-sm text-navy-500">Revenue distribution by primary fund classification</p>
                  </div>
                  <div className="flex-1">
                    <HybridTableChart data={cat1Data} showChart={false} />
                  </div>
                </div>
                <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm flex flex-col">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-foreground">Inflow vs Category 2 Fund</h2>
                    <p className="text-sm text-navy-500">Revenue distribution by secondary fund sources</p>
                  </div>
                  <div className="flex-1">
                    <HybridTableChart data={cat2Data} showChart={false} />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Table */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-surface rounded-2xl p-6 border border-border shadow-sm">
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Category 1 Fund vs Target</h2>
                    <p className="text-sm text-navy-500">Detailed actual vs target performance analysis</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live Analysis Ledger
                  </div>
                </div>
                <HybridTableChart data={cat1Data} />
              </div>
            </div>
          </div>
        );
      }}
      </RevenueDataWrapper>
    </div>
  );
}
