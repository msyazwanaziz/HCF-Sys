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
        
        let displayBank = item.bank.length > 20 ? item.bank.substring(0, 20) + '...' : item.bank;

        tr.innerHTML = `
            <td>${item.date}</td>
            <td><strong>${item.reference}</strong></td>
            <td><span class="bank-tag" style="background: rgba(1, 112, 185, 0.1); color: #0170B9;">${displayBank}</span></td>
            <td style="font-weight: 500;">${formatCurrency(item.amount)}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
        `;
        tbody.appendChild(tr);
    });

    if (displayData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);">No data found for the selected filters.</td></tr>';
    }
}

function renderCharts(data) {
    const chartColorSecondary = '#94a3b8'; // Adjusted for dark theme
    const gridColor = 'rgba(255, 255, 255, 0.05)';

    // 1. Trend Chart Data (Group by date or month)
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

    if (trendChartInstance) {
        trendChartInstance.destroy();
    }

    const ctxTrend = document.getElementById('trendChart').getContext('2d');
    
    let gradient = ctxTrend.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(1, 112, 185, 0.5)'); // Brand blue
    gradient.addColorStop(1, 'rgba(1, 112, 185, 0)');

    trendChartInstance = new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: trendPeriod === 'monthly' ? trendLabels : trendLabels.map(l => {
                if(l.length > 5) return l.substring(5);
                return l;
            }), 
            datasets: [{
                label: trendPeriod === 'monthly' ? 'Monthly Inflow (RM)' : 'Daily Inflow (RM)',
                data: trendValues,
                borderColor: '#0170B9',
                backgroundColor: gradient,
                borderWidth: 2,
                pointBackgroundColor: '#0170B9',
                pointBorderColor: '#fff',
                pointRadius: 4,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { color: gridColor, drawBorder: false }, ticks: { color: chartColorSecondary } },
                y: { grid: { color: gridColor, drawBorder: false }, ticks: { color: chartColorSecondary } }
            }
        }
    });

    // 2. Fund Category 1 Pie Chart
    const fundCat1Totals = {};
    data.forEach(item => {
        let key = item.fundCat1;
        if (!key || key === 'Unknown') key = 'Uncategorized';
        fundCat1Totals[key] = (fundCat1Totals[key] || 0) + Number(item.amount);
    });
    
    if (fundCat1ChartInstance) fundCat1ChartInstance.destroy();
    
    const ctxFundCat1 = document.getElementById('fundCat1Chart').getContext('2d');
    fundCat1ChartInstance = new Chart(ctxFundCat1, {
        type: 'doughnut',
        data: {
            labels: Object.keys(fundCat1Totals),
            datasets: [{
                data: Object.values(fundCat1Totals),
                backgroundColor: ['#0170B9', '#38bdf8', '#0ea5e9', '#0284c7', '#94a3b8'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: { position: 'bottom', labels: { color: '#f8fafc', padding: 10 } }
            }
        }
    });

    // 3. Negeri/Jabatan Bar Chart (Horizontal)
    const negeriTotals = {};
    data.forEach(item => {
        let key = item.negeri;
        if (!key || key === 'Unknown') key = 'Other';
        negeriTotals[key] = (negeriTotals[key] || 0) + Number(item.amount);
    });
    const sortedNegeri = Object.entries(negeriTotals).sort((a,b) => b[1] - a[1]);
    
    if (negeriChartInstance) negeriChartInstance.destroy();
    
    const ctxNegeri = document.getElementById('negeriChart').getContext('2d');
    // Need a solid blue for bars
    let barGradient = ctxNegeri.createLinearGradient(0, 0, 400, 0);
    barGradient.addColorStop(0, '#0284c7');
    barGradient.addColorStop(1, '#38bdf8');

    negeriChartInstance = new Chart(ctxNegeri, {
        type: 'bar',
        data: {
            labels: sortedNegeri.map(i => i[0]),
            datasets: [{
                label: 'Inflow Amount (RM)',
                data: sortedNegeri.map(i => i[1]),
                backgroundColor: barGradient,
                borderRadius: 4
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
        let key = item.fundCat2;
        if (!key || key === 'Unknown') key = 'Uncategorized';
        // Trim long names for chart readability
        key = key.length > 25 ? key.substring(0, 25) + '...' : key;
        fundCat2Totals[key] = (fundCat2Totals[key] || 0) + Number(item.amount);
    });
    const sortedCat2 = Object.entries(fundCat2Totals).sort((a,b) => b[1] - a[1]).slice(0, 8); // Top 8
    
    if (fundCat2ChartInstance) fundCat2ChartInstance.destroy();
    
    const ctxCat2 = document.getElementById('fundCat2Chart').getContext('2d');
    fundCat2ChartInstance = new Chart(ctxCat2, {
        type: 'bar',
        data: {
            labels: sortedCat2.map(i => i[0]),
            datasets: [{
                label: 'Inflow by Subcategory (RM)',
                data: sortedCat2.map(i => i[1]),
                backgroundColor: '#0170B9',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { grid: { display: false }, ticks: { color: chartColorSecondary, maxRotation: 45, minRotation: 45 } },
                y: { grid: { color: gridColor }, ticks: { color: chartColorSecondary } }
            }
        }
    });

    // 5. Sumber (Source) Bar Chart
    const sumberTotals = {};
    data.forEach(item => {
        let key = item.sumber;
        if (!key || key === 'Unknown') key = 'Uncategorized';
        sumberTotals[key] = (sumberTotals[key] || 0) + Number(item.amount);
    });
    const sortedSumber = Object.entries(sumberTotals).sort((a,b) => b[1] - a[1]);
    
    if (sumberChartInstance) sumberChartInstance.destroy();
    
    const ctxSumber = document.getElementById('sumberChart').getContext('2d');
    let sumberGradient = ctxSumber.createLinearGradient(0, 0, 400, 0);
    sumberGradient.addColorStop(0, '#f43f5e'); // neon pinkish red
    sumberGradient.addColorStop(1, '#8b5cf6'); // deep purple
    
    sumberChartInstance = new Chart(ctxSumber, {
        type: 'bar',
        data: {
            labels: sortedSumber.map(i => i[0]),
            datasets: [{
                label: 'Inflow Amount (RM)',
                data: sortedSumber.map(i => i[1]),
                backgroundColor: sumberGradient,
                borderRadius: 4
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
