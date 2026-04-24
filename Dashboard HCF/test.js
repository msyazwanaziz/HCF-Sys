const fs = require('fs');
const csvText = fs.readFileSync('dataset3.csv', 'utf8');

function parseCSV(str) {
    if (!str) return [];
    const arr = [];
    let quote = false;  
    let row = 0, col = 0;
    
    for (let c = 0; c < str.length; c++) {
        let cc = str[c], nc = str[c+1];
        arr[row] = arr[row] || [];
        arr[row][col] = arr[row][col] || '';

        if (cc === '"' && quote && nc === '"') { arr[row][col] += cc; ++c; continue; }
        if (cc === '"') { quote = !quote; continue; }
        if (cc === ',' && !quote) { ++col; continue; }
        if (cc === '\r' && nc === '\n' && !quote) { ++row; col = 0; ++c; continue; }
        if (cc === '\n' && !quote) { ++row; col = 0; continue; }
        if (cc === '\r' && !quote) { ++row; col = 0; continue; }

        arr[row][col] += cc;
    }
    return arr;
}

const rows = parseCSV(csvText);
const data = [];

const header = rows[0].join(',').toLowerCase();
const isNewFormat = header.includes('kod dana') && header.includes('fund category') && header.includes('bank');
console.log('isNewFormat:', isNewFormat);

for (let i = 1; i < Math.min(rows.length, 5); i++) {
    const row = rows[i];
    console.log('Row ' + i + ' length:', row.length);
    const clean = (val) => val ? val.toString().replace(/^"|"$/g, '').trim() : '';

    let dateRaw;
    if (isNewFormat) {
        if (row.length < 14) { console.log('skipped length'); continue; }
        dateRaw = clean(row[6]);
        if (dateRaw.includes(' ')) dateRaw = dateRaw.split(' ')[0]; // Handle 01/01/2025 00:00:00
        amountStr = clean(row[11]);
        
        let amount = parseFloat(amountStr.replace(/,/g, '').replace(/[^\d.-]/g, ''));
        console.log('Amount:', amount);
    }
    
    if (!dateRaw || !dateRaw.includes('/')) { console.log('skipped date:', dateRaw); continue; }

    const parts = dateRaw.split('/');
    const isoDate = parts.length === 3 ? `${parts[2].substring(0, 4)}-${parts[1]}-${parts[0]}` : 'unknown'; 
    console.log('Processed Date:', isoDate);
}
console.log('Total rows parsed:', rows.length);
