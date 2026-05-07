/**
 * dashboard.js
 * Handles the logic for rendering logic, charts, and data filtering
 */

let allData = [];
let trendChartInstance = null;
let fundCat1ChartInstance = null;
let negeriChartInstance = null;
let fundCat2ChartInstance = null;
let sumberChartInstance = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Show spinner
    // Load immediately
    await loadData();

    // Event Listeners for Slicers
    document.getElementById('month-slicer').addEventListener('change', updateDashboard);
    document.getElementById('bank-slicer').addEventListener('change', updateDashboard);
    document.getElementById('negeri-slicer').addEventListener('change', updateDashboard);
    document.getElementById('sumber-slicer').addEventListener('change', updateDashboard);
    document.getElementById('trend-period').addEventListener('change', updateDashboard);

    // Initial background sync slightly delayed
    setTimeout(triggerSync, 500);

    const syncBtn = document.getElementById('sync-button');
    if (syncBtn) {
        syncBtn.addEventListener('click', triggerSync);
    }
});

async function triggerSync() {
    const syncStatus = document.getElementById('sync-status');
    const syncIcon = document.getElementById('sync-icon');
    
    if (syncIcon) syncIcon.classList.add('animate-spin');
    if (syncStatus) syncStatus.textContent = 'Syncing...';
    
    await window.api.syncData();
    await loadData();
    
    if (syncIcon) syncIcon.classList.remove('animate-spin');
    if (syncStatus) syncStatus.textContent = 'Refresh Sync';
}

async function loadData() {
    allData = await window.api.getData();
    
    // Populate dynamic slicers
    const bankSlicer = document.getElementById('bank-slicer');
    const existingBank = bankSlicer.value;
    
    // Get unique banks
    const uniqueBanks = [...new Set(allData.map(item => item.bank))].filter(b => b);
    bankSlicer.innerHTML = '<option value="all">All Accounts</option>';
    uniqueBanks.sort().forEach(bank => {
        const option = document.createElement('option');
        option.value = bank;
        option.textContent = bank.length > 25 ? bank.substring(0, 25) + '...' : bank;
        bankSlicer.appendChild(option);
    });
    if (uniqueBanks.includes(existingBank)) bankSlicer.value = existingBank;

    // Populate Negeri Slicer
    const negeriSlicer = document.getElementById('negeri-slicer');
    const existingNegeri = negeriSlicer.value;
    const uniqueNegeri = [...new Set(allData.map(item => item.negeri))].filter(n => n && n !== 'Unknown');
    negeriSlicer.innerHTML = '<option value="all">All Regions</option>';
    uniqueNegeri.sort().forEach(neg => {
        const option = document.createElement('option');
        option.value = neg; option.textContent = neg;
        negeriSlicer.appendChild(option);
    });
    if (uniqueNegeri.includes(existingNegeri)) negeriSlicer.value = existingNegeri;

    // Populate Sumber Slicer
    const sumberSlicer = document.getElementById('sumber-slicer');
    const existingSumber = sumberSlicer.value;
    const uniqueSumber = [...new Set(allData.map(item => item.sumber))].filter(s => s && s !== 'Unknown');
    sumberSlicer.innerHTML = '<option value="all">All Sources</option>';
    uniqueSumber.sort().forEach(src => {
        const option = document.createElement('option');
        option.value = src; option.textContent = src;
        sumberSlicer.appendChild(option);
    });
    if (uniqueSumber.includes(existingSumber)) sumberSlicer.value = existingSumber;

    updateDashboard();
}

function updateDashboard() {
    const monthFilter = document.getElementById('month-slicer').value;
    const bankFilter = document.getElementById('bank-slicer').value;
    const negeriFilter = document.getElementById('negeri-slicer').value;
    const sumberFilter = document.getElementById('sumber-slicer').value;

    let filteredData = allData.filter(item => {
        const itemDate = new Date(item.date);
        const itemMonth = (itemDate.getMonth() + 1).toString(); // 1-12
        
        const monthMatch = monthFilter === 'all' || itemMonth === monthFilter;
        const bankMatch = bankFilter === 'all' || item.bank === bankFilter;
        const negeriMatch = negeriFilter === 'all' || item.negeri === negeriFilter;
        const sumberMatch = sumberFilter === 'all' || item.sumber === sumberFilter;

        return monthMatch && bankMatch && negeriMatch && sumberMatch;
    });

    updateStats(filteredData);
    renderTable(filteredData);
    renderCharts(filteredData);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR'
    }).format(amount);
}

function updateStats(data) {
    const total = data.reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Find top 2 highest accounts for the stat cards
    const bankTotals = {};
    data.forEach(item => {
        bankTotals[item.bank] = (bankTotals[item.bank] || 0) + Number(item.amount);
    });
    const sortedBanks = Object.entries(bankTotals).sort((a, b) => b[1] - a[1]);
    
    const topBank1Name = sortedBanks.length > 0 ? sortedBanks[0][0] : 'Primary Account';
    const topBank1Total = sortedBanks.length > 0 ? sortedBanks[0][1] : 0;
    
    const topBank2Name = sortedBanks.length > 1 ? sortedBanks[1][0] : 'Secondary Account';
    const topBank2Total = sortedBanks.length > 1 ? sortedBanks[1][1] : 0;

    document.getElementById('total-inflow').textContent = formatCurrency(total);
    
    const maybankEl = document.getElementById('maybank-total');
    if (maybankEl) {
        maybankEl.textContent = formatCurrency(topBank1Total);
        // Also update the title
        maybankEl.previousElementSibling.firstElementChild.textContent = topBank1Name;
    }
    
    const cimbEl = document.getElementById('cimb-total');
    if (cimbEl) {
        cimbEl.textContent = formatCurrency(topBank2Total);
        cimbEl.previousElementSibling.firstElementChild.textContent = topBank2Name;
    }
    
    document.getElementById('total-tx').textContent = data.length;
}

function renderTable(data) {
    const tbody = document.getElementById('transaction-tbody');
    tbody.innerHTML = '';
    
    // Show only the latest 10
    const displayData = data.slice(0, 10);

    displayData.forEach(item => {
        const tr = document.createElement('tr');
        
        const statusClass = item.status === 'synced' ? 'status-synced' : 'status-pending';
        const statusText = item.status === 'synced' ? 'Synced' : 'Pending';
        
        let bankClass = 'tag-maybank';
        if (item.bank.toLowerCase().includes('cimb')) bankClass = 'tag-cimb';
        if (item.bank.toLowerCase().includes('bimb')) bankClass = 'tag-bimb';
        
        let displayBank = item.bank.length > 20 ? item.bank.substring(0, 20) + '...' : item.bank;

        tr.innerHTML = `
            <td>${item.date}</td>
            <td><strong style="color: var(--accent-primary)">${item.reference}</strong></td>
            <td><span class="bank-tag ${bankClass}">${displayBank}</span></td>
            <td style="font-weight: 700; color: #fff;">${formatCurrency(item.amount)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding: 3rem;color:var(--text-secondary);">No data found for the selected filters.</td></tr>';
    }
}

function renderCharts(data) {
    const chartColorSecondary = '#94a3b8'; 
    const gridColor = 'rgba(255, 255, 255, 0.05)';
    const accentPrimary = '#38bdf8';
    const accentSecondary = '#818cf8';

    // 1. Trend Chart Data
    const trendPeriod = document.getElementById('trend-period').value;
    const trendMap = {};
    const chronological = [...data].sort((a,b) => new Date(a.date) - new Date(b.date));
    
    chronological.forEach(item => {
        let key = item.date;
        if (trendPeriod === 'monthly') {
            const dateObj = new Date(item.date);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            key = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
        }
        if (!trendMap[key]) trendMap[key] = 0;
        trendMap[key] += Number(item.amount);
    });

    const trendLabels = Object.keys(trendMap);
    const trendValues = Object.values(trendMap);

    if (trendChartInstance) trendChartInstance.destroy();

    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    let gradient = ctxTrend.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');

    trendChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: trendPeriod === 'monthly' ? trendLabels : trendLabels.map(l => l.substring(5)), 
            datasets: [{
                label: 'Inflow (RM)',
                data: trendValues,
                borderColor: accentPrimary,
                backgroundColor: gradient,
                borderWidth: 3,
                pointBackgroundColor: accentPrimary,
                pointBorderColor: '#fff',
                pointHoverRadius: 6,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    padding: 12,
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    displayColors: false
                }
            },
            scales: {
                x: { grid: { display: false }, ticks: { color: chartColorSecondary, font: { size: 11 } } },
                y: { grid: { color: gridColor }, ticks: { color: chartColorSecondary, font: { size: 11 } } }
            }
        }
    });

    // 2. Fund Category 1 Doughnut
    const fundCat1Totals = {};
    data.forEach(item => {
        let key = item.fundCat1 || 'Uncategorized';
        fundCat1Totals[key] = (fundCat1Totals[key] || 0) + Number(item.amount);
    });
    
    if (fundCat1ChartInstance) fundCat1ChartInstance.destroy();
    
    fundCat1ChartInstance = new Chart(document.getElementById('fundCat1Chart'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(fundCat1Totals),
            datasets: [{
                data: Object.values(fundCat1Totals),
                backgroundColor: [accentPrimary, accentSecondary, '#fb7185', '#34d399', '#fbbf24'],
                borderWidth: 4,
                borderColor: '#0f172a',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            plugins: {
                legend: { position: 'bottom', labels: { color: chartColorSecondary, font: { size: 11 }, padding: 20, usePointStyle: true } }
            }
        }
    });

    // 3. Negeri/Jabatan Bar Chart (Horizontal)
    const negeriTotals = {};
    data.forEach(item => {
        let key = item.negeri || 'Other';
        negeriTotals[key] = (negeriTotals[key] || 0) + Number(item.amount);
    });
    const sortedNegeri = Object.entries(negeriTotals).sort((a,b) => b[1] - a[1]).slice(0, 10);
    
    if (negeriChartInstance) negeriChartInstance.destroy();
    const ctxNegeri = document.getElementById('negeriChart').getContext('2d');
    let barGradient = ctxNegeri.createLinearGradient(0, 0, 400, 0);
    barGradient.addColorStop(0, accentPrimary);
    barGradient.addColorStop(1, accentSecondary);

    negeriChartInstance = new Chart(ctxNegeri, {
        type: 'bar',
        data: {
            labels: sortedNegeri.map(i => i[0]),
            datasets: [{
                data: sortedNegeri.map(i => i[1]),
                backgroundColor: barGradient,
                borderRadius: 6,
                barThickness: 12
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: chartColorSecondary } },
                y: { grid: { display: false }, ticks: { color: chartColorSecondary } }
            }
        }
    });

    // 4. Fund Category 2 Bar Chart
    const fundCat2Totals = {};
    data.forEach(item => {
        let key = item.fundCat2 || 'Uncategorized';
        key = key.length > 20 ? key.substring(0, 20) + '...' : key;
        fundCat2Totals[key] = (fundCat2Totals[key] || 0) + Number(item.amount);
    });
    const sortedCat2 = Object.entries(fundCat2Totals).sort((a,b) => b[1] - a[1]).slice(0, 8);
    
    if (fundCat2ChartInstance) fundCat2ChartInstance.destroy();
    fundCat2ChartInstance = new Chart(document.getElementById('fundCat2Chart'), {
        type: 'bar',
        data: {
            labels: sortedCat2.map(i => i[0]),
            datasets: [{
                data: sortedCat2.map(i => i[1]),
                backgroundColor: 'rgba(129, 140, 248, 0.8)',
                borderRadius: 6,
                barThickness: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: chartColorSecondary, font: { size: 10 }, maxRotation: 45, minRotation: 45 } },
                y: { grid: { color: gridColor }, ticks: { color: chartColorSecondary } }
            }
        }
    });

    // 5. Sumber (Source) Bar Chart
    const sumberTotals = {};
    data.forEach(item => {
        let key = item.sumber || 'Other';
        sumberTotals[key] = (sumberTotals[key] || 0) + Number(item.amount);
    });
    const sortedSumber = Object.entries(sumberTotals).sort((a,b) => b[1] - a[1]);
    
    if (sumberChartInstance) sumberChartInstance.destroy();
    const ctxSumber = document.getElementById('sumberChart').getContext('2d');
    let sGradient = ctxSumber.createLinearGradient(0, 0, 400, 0);
    sGradient.addColorStop(0, '#fb7185');
    sGradient.addColorStop(1, '#818cf8');
    
    sumberChartInstance = new Chart(ctxSumber, {
        type: 'bar',
        data: {
            labels: sortedSumber.map(i => i[0]),
            datasets: [{
                data: sortedSumber.map(i => i[1]),
                backgroundColor: sGradient,
                borderRadius: 6,
                barThickness: 12
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor }, ticks: { color: chartColorSecondary } },
                y: { grid: { display: false }, ticks: { color: chartColorSecondary } }
            }
        }
    });
}
