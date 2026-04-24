/**
 * admin.js
 * Handles data entry and mock authentication.
 */

document.addEventListener('DOMContentLoaded', () => {
    const dataEntryNav = document.getElementById('nav-data-entry');
    if (dataEntryNav) dataEntryNav.style.display = 'flex';


    // Set today's date automatically
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }

    // Form Submission
    const form = document.getElementById('inflow-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = document.getElementById('submit-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="ph ph-spinner animate-spin"></i> Processing...';
            btn.disabled = true;

            const record = {
                bank: document.getElementById('bank').value,
                amount: document.getElementById('amount').value,
                date: document.getElementById('date').value,
                reference: document.getElementById('reference').value,
                notes: document.getElementById('notes').value
            };

            try {
                await window.api.addRecord(record);
                showToast('Record added and syncing to Google Sheets', 'success');
                form.reset();
                document.getElementById('date').value = new Date().toISOString().split('T')[0];
            } catch (err) {
                showToast('Error syncing data', 'error');
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});

function showToast(message, type = 'success') {
    // Simple toast notification system
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    // toast.style.right = '20px'; /* removed right to align center initially then transition */
    toast.style.right = '-300px'; 
    toast.style.background = type === 'success' ? '#059669' : '#dc2626';
    toast.style.color = '#fff';
    toast.style.padding = '1rem 1.5rem';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.transition = 'right 0.3s ease';
    toast.style.zIndex = '9999';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';

    const icon = type === 'success' ? 'ph-check-circle' : 'ph-warning-circle';
    toast.innerHTML = `<i class="ph ${icon}" style="font-size: 1.2rem;"></i> <span>${message}</span>`;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.right = '20px';
    }, 10);

    setTimeout(() => {
        toast.style.right = '-300px';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
