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
    
    filteredTransactions = allTransactions.filter(tx => {
        // Search across Reference, Name, Receipt Name, Transaction Ref, Bank, Category, State, Amount
        const searchableText = `${tx.reference || ''} ${tx.name || ''} ${tx.receiptName || ''} ${tx.transactionRef || ''} ${tx.bank || ''} ${tx.fundCat1 || ''} ${tx.negeri || ''} ${tx.amount || ''}`.toLowerCase();
        return searchableText.includes(searchTerm);
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
        
        let displayBank = (item.bank && item.bank.length > 25) ? item.bank.substring(0, 25) + '...' : (item.bank || 'Unknown');
        let displayCat = (item.fundCat1 && item.fundCat1.length > 25) ? item.fundCat1.substring(0, 25) + '...' : (item.fundCat1 || 'Unknown');
        let displayState = (item.negeri && item.negeri.length > 20) ? item.negeri.substring(0, 20) + '...' : (item.negeri || 'Unknown');
        let displayBankName = (item.name && item.name.length > 20) ? item.name.substring(0, 20) + '...' : (item.name || '-');
        let rawReceiptName = item.receiptName || item.name || '-';
        let displayReceiptName = (rawReceiptName.length > 20) ? rawReceiptName.substring(0, 20) + '...' : rawReceiptName;
        let displayTransRef = (item.transactionRef && item.transactionRef.length > 20) ? item.transactionRef.substring(0, 20) + '...' : (item.transactionRef || '-');
        
        const isOverridden = item.name !== item.receiptName && item.receiptName !== undefined;
        
        const receiptBadge = hasReceipt 
            ? `<span style="display: block; margin-top: 4px; padding: 0.1rem 0.4rem; background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 4px; font-size: 0.7rem; width: max-content;"><i class="ph ph-check-circle"></i> Receipt Issued</span>` 
            : '';
        const actionColor = hasReceipt ? '#4ade80' : 'var(--accent-primary)';

        tr.innerHTML = `
            <td>${item.date || '-'}</td>
            <td><strong style="color: var(--text-primary);">${item.reference || '-'}</strong></td>
            <td style="color: var(--text-secondary); font-size: 0.9rem;">${displayBankName}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.4rem;">
                    <span style="font-weight: 500; ${isOverridden ? 'color: var(--accent-primary);' : ''}">${displayReceiptName}</span>
                    <button onclick="editReceiptName('${item.id}', '${rawReceiptName.replace(/'/g, "\\'")}')" style="background: none; border: none; cursor: pointer; color: var(--text-secondary); padding: 0;" title="Edit Donor Name">
                        <i class="ph ph-pencil-simple"></i>
                    </button>
                </div>
            </td>
            <td style="color: var(--text-secondary); font-size: 0.9rem;">${displayTransRef}</td>
            <td><span class="bank-tag" style="background: rgba(1, 112, 185, 0.1); color: #38bdf8; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.85rem;">${displayBank}</span></td>
            <td>${displayCat}</td>
            <td>${displayState}</td>
            <td style="font-weight: 500;">${formatCurrency(item.amount)}</td>
            <td>
                <span class="status-badge ${statusClass}" style="padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem;">${statusText}</span>
                ${receiptBadge}
            </td>
            <td style="text-align: center;">
                <button onclick="window.open('receipt.html?id=${encodeURIComponent(item.id)}', '_blank')" style="background: none; border: none; cursor: pointer; color: ${actionColor}; padding: 0.2rem;" title="${hasReceipt ? 'View Receipt' : 'Print Receipt'}">
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
