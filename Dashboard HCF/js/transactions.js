let allTransactions = [];
let filteredTransactions = [];
let currentPage = 1;
const rowsPerPage = 15;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load data from existing API
        allTransactions = await window.api.getData();
        
        if (!allTransactions || allTransactions.length === 0) {
            // Attempt to sync once if empty
            await window.api.syncData();
            allTransactions = await window.api.getData();
        }
        
        // Sort transactions by date descending (assuming 'date' is a parseable string)
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filteredTransactions = [...allTransactions];
        
        // Event listeners for search
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                currentPage = 1; // Reset to page 1 on search
                applyFilters();
            });
        }
        
        // Populate select dropdowns for column filters
        const bankSelect = document.getElementById('filter-bank');
        const catSelect = document.getElementById('filter-cat');
        const stateSelect = document.getElementById('filter-state');
        
        const uniqueBanks = [...new Set(allTransactions.map(t => t.bank).filter(Boolean))].sort();
        const uniqueCats = [...new Set(allTransactions.map(t => t.fundCat1).filter(Boolean))].sort();
        const uniqueStates = [...new Set(allTransactions.map(t => t.negeri).filter(Boolean))].sort();
        
        if (bankSelect) uniqueBanks.forEach(b => bankSelect.add(new Option(b, b)));
        if (catSelect) uniqueCats.forEach(c => catSelect.add(new Option(c, c)));
        if (stateSelect) uniqueStates.forEach(s => stateSelect.add(new Option(s, s)));

        // Event listeners for column filters
        document.querySelectorAll('.col-filter').forEach(el => {
            el.addEventListener('input', () => {
                currentPage = 1;
                applyFilters();
            });
            el.addEventListener('change', () => {
                currentPage = 1;
                applyFilters();
            });
        });
        
        setupColumnToggle();
        renderTable();
    } catch (err) {
        console.error("Error loading transactions:", err);
        document.getElementById('transaction-tbody').innerHTML = 
            `<tr><td colspan="11" style="text-align:center; padding: 2rem; color:#ef4444;">Failed to load transaction data.</td></tr>`;
    }
});

function applyFilters() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    // Gather column filters
    const colFilters = {};
    document.querySelectorAll('.col-filter').forEach(el => {
        if (el.value.trim() !== '') {
            colFilters[el.dataset.key] = el.value.toLowerCase();
        }
    });

    filteredTransactions = allTransactions.filter(tx => {
        // 1. Global search
        if (searchTerm) {
            const searchableText = `${tx.reference || ''} ${tx.name || ''} ${tx.receiptName || ''} ${tx.transactionRef || ''} ${tx.bank || ''} ${tx.fundCat1 || ''} ${tx.negeri || ''} ${tx.amount || ''}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) return false;
        }

        // 2. Column specific filters
        for (const key in colFilters) {
            const filterVal = colFilters[key];
            let cellVal = String(tx[key] || '').toLowerCase();
            // exact match for dropdowns, partial match for inputs
            const isDropdown = document.querySelector(`.col-filter[data-key="${key}"]`).tagName === 'SELECT';
            
            if (isDropdown) {
                if (cellVal !== filterVal) return false;
            } else {
                if (!cellVal.includes(filterVal)) return false;
            }
        }
        
        return true;
    });
    
    renderTable();
}

function formatCurrency(amount) {
    const num = Number(amount);
    if (isNaN(num)) return 'RM 0.00';
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR'
    }).format(num);
}

function renderTable() {
    const tbody = document.getElementById('transaction-tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    const totalRows = filteredTransactions.length;
    
    if (totalRows === 0) {
        tbody.innerHTML = `<tr><td colspan="11" style="text-align:center; padding: 2rem; color:var(--text-secondary);">No transactions found matching your criteria.</td></tr>`;
        document.getElementById('pagination-controls').style.display = 'none';
        return;
    }
    
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
    
    const displayData = filteredTransactions.slice(startIndex, endIndex);
    const receiptDataMap = JSON.parse(localStorage.getItem('hcf_receipt_data') || '{}');
    
    displayData.forEach(item => {
        const tr = document.createElement('tr');
        
        const hasReceipt = !!receiptDataMap[item.id];
        const statusClass = item.status === 'synced' ? 'status-synced' : 'status-pending';
        const statusText = item.status === 'synced' ? 'Synced' : 'Pending';
        
        let bankClass = 'tag-maybank';
        if (item.bank && item.bank.toLowerCase().includes('cimb')) bankClass = 'tag-cimb';
        if (item.bank && item.bank.toLowerCase().includes('bimb')) bankClass = 'tag-bimb';
        
        let displayBank = (item.bank && item.bank.length > 25) ? item.bank.substring(0, 25) + '...' : (item.bank || 'Unknown');
        let displayCat = (item.fundCat1 && item.fundCat1.length > 25) ? item.fundCat1.substring(0, 25) + '...' : (item.fundCat1 || 'Unknown');
        let displayState = (item.negeri && item.negeri.length > 20) ? item.negeri.substring(0, 20) + '...' : (item.negeri || 'Unknown');
        let displayBankName = (item.name && item.name.length > 20) ? item.name.substring(0, 20) + '...' : (item.name || '-');
        let rawReceiptName = item.receiptName || item.name || '-';
        let displayReceiptName = (rawReceiptName.length > 20) ? rawReceiptName.substring(0, 20) + '...' : rawReceiptName;
        let displayTransRef = (item.transactionRef && item.transactionRef.length > 20) ? item.transactionRef.substring(0, 20) + '...' : (item.transactionRef || '-');
        
        const isOverridden = item.name !== item.receiptName && item.receiptName !== undefined;
        
        const receiptBadge = hasReceipt 
            ? `<div style="margin-top: 8px; display: flex;"><span style="padding: 4px 10px; background: rgba(52, 211, 153, 0.1); color: var(--accent-success); border: 1px solid rgba(52, 211, 153, 0.2); border-radius: var(--radius-xs); font-size: 0.7rem; font-weight: 700;"><i class="ph-bold ph-check"></i> RECEIPT READY</span></div>` 
            : '';
        const actionColor = hasReceipt ? 'var(--accent-success)' : 'var(--accent-primary)';

        tr.innerHTML = `
            <td>${item.date || '-'}</td>
            <td><strong style="color: var(--accent-primary);">${item.reference || '-'}</strong></td>
            <td style="color: var(--text-secondary); font-size: 0.85rem;">${displayBankName}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span style="font-weight: 600; ${isOverridden ? 'color: var(--accent-secondary);' : ''}">${displayReceiptName}</span>
                    <button onclick="editReceiptName('${item.id}', '${rawReceiptName.replace(/'/g, "\\'")}')" style="background: none; border: none; cursor: pointer; color: var(--text-muted); padding: 0; font-size: 1rem;" title="Edit Donor Name">
                        <i class="ph ph-pencil-simple"></i>
                    </button>
                </div>
            </td>
            <td style="color: var(--text-muted); font-family: monospace; font-size: 0.8rem;">${displayTransRef}</td>
            <td><span class="bank-tag ${bankClass}">${displayBank}</span></td>
            <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${displayCat}</span></td>
            <td><span style="font-size: 0.85rem; color: var(--text-secondary);">${displayState}</span></td>
            <td style="font-weight: 700; color: #fff;">${formatCurrency(item.amount)}</td>
            <td>
                <span class="status-badge ${statusClass}">${statusText}</span>
                ${receiptBadge}
            </td>
            <td style="text-align: center;">
                <button onclick="window.open('receipt.html?id=${encodeURIComponent(item.id)}', '_blank')" style="background: var(--bg-surface); border: 1px solid var(--border-color-light); border-radius: var(--radius-sm); cursor: pointer; color: ${actionColor}; padding: 0.5rem; transition: var(--transition-base);" title="${hasReceipt ? 'View Receipt' : 'Print Receipt'}">
                    <i class="ph ph-printer" style="font-size: 1.2rem;"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    updatePagination(startIndex + 1, endIndex, totalRows);
}

// Refresh table if a receipt was generated in another tab
window.addEventListener('focus', () => {
    if (document.getElementById('transaction-tbody')) {
        renderTable();
    }
});

function updatePagination(start, end, total) {
    const paginationControls = document.getElementById('pagination-controls');
    if (!paginationControls) return;
    
    paginationControls.style.display = 'flex';
    document.getElementById('page-start').textContent = start;
    document.getElementById('page-end').textContent = end;
    document.getElementById('total-rows').textContent = total;
    
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage * rowsPerPage >= total;
}

// Global function to be called by pagination buttons
window.editReceiptName = function(id, currentName) {
    const newName = prompt("Update exact Donor Full Name for Receipt:", currentName);
    if (newName !== null && newName.trim() !== "" && newName.trim() !== currentName) {
        const validName = newName.trim();
        const overrides = JSON.parse(localStorage.getItem('hcf_name_overrides') || '{}');
        overrides[id] = validName;
        localStorage.setItem('hcf_name_overrides', JSON.stringify(overrides));
        
        // update memory
        const tx = allTransactions.find(t => t.id === id);
        if (tx) {
            tx.receiptName = validName;
            
            // Sync backward with API class cache
            if (window.api && window.api.cache) {
                const apiTx = window.api.cache.find(c => c.id === id);
                if (apiTx) apiTx.receiptName = validName;
            }
        }
        applyFilters();
    }
};

window.changePage = function(delta) {
    const totalRows = filteredTransactions.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage);
    
    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= maxPage) {
        currentPage = newPage;
        renderTable();
    }
};

window.reloadTransactions = async function() {
    try {
        const tbody = document.getElementById('transaction-tbody');
        if (tbody) tbody.innerHTML = '<tr><td colspan="11" style="text-align:center; padding: 2rem; color:var(--text-secondary);">Reloading data...</td></tr>';
        
        // Refresh data using the updated mappings
        allTransactions = await window.api.getData();
        allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        filteredTransactions = [...allTransactions];
        
        applyFilters();
    } catch (err) {
        console.error("Error reloading transactions:", err);
    }
};

const COLUMN_NAMES = [
    "Date", "Reference ID", "Bank Name", "Receipt Name", 
    "Transaction Ref", "Bank Account", "Category 1", 
    "State/Region", "Amount (RM)", "Status", "Action"
];

function setupColumnToggle() {
    const menu = document.getElementById('columns-menu');
    if (!menu) return;
    
    // Load saved preferences or default to all true
    const savedCols = JSON.parse(localStorage.getItem('hcf_visible_cols') || '[]');
    let visibleCols = savedCols.length > 0 ? savedCols : COLUMN_NAMES.map((_, i) => i);
    
    // Generate menu
    menu.innerHTML = '';
    COLUMN_NAMES.forEach((name, index) => {
        const isChecked = visibleCols.includes(index) ? 'checked' : '';
        menu.innerHTML += `
            <label class="column-toggle">
                <input type="checkbox" value="${index}" ${isChecked} onchange="toggleColumn(this.value, this.checked)">
                ${name}
            </label>
        `;
        
        // Apply initial state
        if (!visibleCols.includes(index)) {
            hideColumnCSS(index);
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.columns-dropdown-wrapper')) {
            menu.classList.remove('show');
        }
    });
}

window.toggleColumn = function(index, isVisible) {
    index = parseInt(index);
    let visibleCols = JSON.parse(localStorage.getItem('hcf_visible_cols') || '[]');
    if (visibleCols.length === 0) visibleCols = COLUMN_NAMES.map((_, i) => i);
    
    if (isVisible) {
        if (!visibleCols.includes(index)) visibleCols.push(index);
        showColumnCSS(index);
    } else {
        visibleCols = visibleCols.filter(c => c !== index);
        hideColumnCSS(index);
    }
    
    localStorage.setItem('hcf_visible_cols', JSON.stringify(visibleCols));
};

function hideColumnCSS(index) {
    const styleId = 'hide-col-' + index;
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            #transaction-table th:nth-child(${index + 1}),
            #transaction-table td:nth-child(${index + 1}) {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

function showColumnCSS(index) {
    const style = document.getElementById('hide-col-' + index);
    if (style) style.remove();
}
