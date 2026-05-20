import { NextResponse } from "next/server";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1MRJibLnS07vXaiJ_r_hoU2UMDzK6-gbRM2YZw4zqYds/export?format=csv&gid=2146182837";
const TARGET_SHEET_URL = "https://docs.google.com/spreadsheets/d/1MRJibLnS07vXaiJ_r_hoU2UMDzK6-gbRM2YZw4zqYds/export?format=csv&gid=1005422743";

let cachedData: any = null;
let lastFetchTime = 0;
// Cache for 5 minutes in memory
const CACHE_DURATION_MS = 5 * 60 * 1000;

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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get('forceRefresh') === 'true';

    // If cache is valid and no force refresh, return cache
    if (!forceRefresh && cachedData && (Date.now() - lastFetchTime < CACHE_DURATION_MS)) {
      return NextResponse.json(cachedData);
    }

    const bustUrl = `${SHEET_URL}&t=${Date.now()}`;
    const targetBustUrl = `${TARGET_SHEET_URL}&t=${Date.now()}`;

    // Fetch both sheets concurrently
    const [sheetRes, targetRes] = await Promise.all([
      fetch(bustUrl),
      fetch(targetBustUrl)
    ]);

    const sheetText = await sheetRes.text();
    const targetText = await targetRes.text();

    const lines = sheetText.split('\n').filter(l => l.trim() !== '');
    const headers = parseCSVLine(lines[0]);

    // Finance Indices
    const dateIdx = headers.indexOf('Date');
    const creditIdx = headers.indexOf('Credit');
    const debitIdx = headers.indexOf('Debit');
    const fundCatIdx = headers.indexOf('Fund Category');
    const cat1Idx = headers.indexOf('Fund Category 1');

    // Revenue Indices
    const cat2Idx = headers.indexOf('Fund Category 2');
    const cat1_1Idx = headers.indexOf('Fund Category 1-1');
    const bankIdx = headers.indexOf('Bank Name');
    const branchIdx = headers.indexOf('NEGERI /JABATAN');
    
    const qIdx = headers.indexOf('Sumbangan Umum');
    const rIdx = headers.indexOf('Tabung Cahaya HQ');
    const sIdx = headers.indexOf('Fundraising');
    const tIdx = headers.indexOf('Ansar Initiative');
    const uIdx = headers.indexOf('Korporat');
    const vIdx = headers.indexOf('IKRAM');
    const wIdx = headers.indexOf('A. Agama');
    const xIdx = headers.indexOf('A. Kerajaan');
    const yIdx = headers.indexOf('Tabung Infaq Abadi');

    // Aggregation maps
    const monthlyData: Record<string, { income: number, expense: number }> = {};
    const sourcesData: Record<string, number> = {};
    let totalRestricted = 0;
    let totalUnrestricted = 0;
    const transactions: any[] = [];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
      let month = 'Unknown';
      if (parts.length === 3) {
        const monthNum = parseInt(parts[1], 10);
        month = monthNames[monthNum - 1] || 'Unknown';

        // Finance aggregations
        if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
        monthlyData[month].income += income;
        monthlyData[month].expense += expense;
      }

      if (income > 0) {
        let cat = row[fundCatIdx] || 'Others';
        if (cat.length > 20) cat = cat.substring(0, 20) + '...';
        if (!sourcesData[cat]) sourcesData[cat] = 0;
        sourcesData[cat] += income;
        
        const cat1 = row[cat1Idx] || '';
        if (cat1.toUpperCase().includes('UNRESTRICTED')) {
           totalUnrestricted += income;
        } else if (cat1.toUpperCase().includes('RESTRICTED') || cat1.toUpperCase().includes('ZAKAT')) {
           totalRestricted += income;
        } else {
           totalUnrestricted += income;
        }

        // Transactions logic for Revenue
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
          cat1_1: cat1_1Idx > -1 ? (row[cat1_1Idx] || 'Uncategorized') : 'Uncategorized',
          bankName: bankIdx > -1 ? (row[bankIdx] || 'Unknown') : 'Unknown',
          branch: branchIdx > -1 ? (row[branchIdx] || 'Unknown') : 'Unknown',
        });
      }
    }

    const formattedMonthly = Object.keys(monthlyData).map(m => ({
      month: m,
      income: Math.round(monthlyData[m].income),
      expense: Math.round(monthlyData[m].expense)
    }));
    
    const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    formattedMonthly.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));

    const formattedSources = Object.keys(sourcesData)
      .map(name => ({ name, value: Math.round(sourcesData[name]) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // TARGETS PARSING
    const targetLines = targetText.split('\n').filter(l => l.trim() !== '');
    const targets: Record<string, number> = {};
    
    let prevVal = 0;
    let parsingBranches = false;
    const sheetMonthHeaders = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    for (let i = 1; i < targetLines.length; i++) {
      const row = parseCSVLine(targetLines[i]);
      if (row.length < 2 || !row[0]) continue;

      const label = row[0].trim();
      
      if (label.startsWith('Branch (Negeri')) {
        parsingBranches = true;
        continue;
      }

      if (parsingBranches) {
        const overallStr = row[1]?.replace(/,/g, '').replace(/"/g, '') || '0';
        const overallVal = parseFloat(overallStr);
        if (!isNaN(overallVal) && overallVal > 0) {
          targets[label.toUpperCase()] = Math.round(overallVal);
        }
        
        sheetMonthHeaders.forEach((monthHeader, idx) => {
          const colIndex = 3 + idx;
          if (row[colIndex]) {
            const valStr = row[colIndex].replace(/,/g, '').replace(/"/g, '');
            const val = parseFloat(valStr);
            if (!isNaN(val)) {
              const standardizedMonth = monthNames[idx];
              targets[`${label.toUpperCase()}_${standardizedMonth}`] = Math.round(val);
            }
          }
        });
      } else {
        const valStr = row[1]?.replace(/,/g, '').replace(/"/g, '') || '0';
        const val = parseFloat(valStr);
        
        if (!isNaN(val)) {
          if (monthNames.includes(label)) {
            targets[label] = Math.round(val - prevVal);
            targets[`${label}_cum`] = Math.round(val);
            prevVal = val;
          } else {
            targets[label] = Math.round(val);
            targets[label.toUpperCase()] = Math.round(val);
          }
        }
      }
    }

    cachedData = {
      financeData: {
        incomeExpense: formattedMonthly,
        fundSources: formattedSources,
        restricted: totalRestricted,
        unrestricted: totalUnrestricted
      },
      revenueData: {
        transactions,
        targets
      }
    };
    lastFetchTime = Date.now();

    return NextResponse.json(cachedData);

  } catch (error) {
    console.error("Error fetching or parsing sheets data:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
