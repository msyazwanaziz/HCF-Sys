/**
 * API.js - Manages data connection and state
 * Fetches LIVE data from the provided Google Sheet with blazing fast local caching
 */

const DEFAULT_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/1zctJZmWk9h1lKC34RF4hqcgUhyoCcJhZfAcg6wCT-dQ/export?format=csv";
const CACHE_KEY = "hcf_csv_cache";

function getCsvExportUrl(userUrl) {
    if (!userUrl) return DEFAULT_SHEET_CSV_URL;
    if (userUrl.includes('export?format=csv')) return userUrl;
    
    // Extract the /d/ID portion
    const match = userUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
        let exportUrl = `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`;
        const gidMatch = userUrl.match(/[#&?]gid=([0-9]+)/);
        if (gidMatch && gidMatch[1]) {
            exportUrl += `&gid=${gidMatch[1]}`;
        }
        return exportUrl;
    }
    return DEFAULT_SHEET_CSV_URL;
}

class APIService {
    constructor() {
        this.cache = null;
    }

    // Helper to parse CSV manually
    parseCSV(str) {
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

    processCSVData(csvText) {
        const overrides = JSON.parse(localStorage.getItem('hcf_name_overrides') || '{}');
        const rows = this.parseCSV(csvText);
        const data = [];
        
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length < 11) continue; 
            
            // Clean quote marks and whitespace
            const clean = (val) => val ? val.toString().replace(/^"|"$/g, '').trim() : '';

            const dateRaw = clean(row[3]); 
            if (!dateRaw.includes('/')) continue; 

            const parts = dateRaw.split('/');
            const isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`; 
            
            let amountStr = clean(row[10]).replace(/,/g, '').replace(/[^\d.-]/g, '');
            let amount = parseFloat(amountStr);
            if (isNaN(amount) || amount === 0) continue; // Skip zero credit values

            let fundCategory = clean(row[5]) || 'Unknown';
            let negeri = clean(row[1]) || 'Unknown';
            let sumber = clean(row[0]) || 'Unknown';
            const txId = clean(row[2]) || `id-${i}`;
            const baseName = clean(row[6]) || '-';
            
            data.push({
                id: txId,
                date: isoDate,
                bank: fundCategory,
                amount: amount,
                reference: clean(row[2]) || '-',
                name: baseName,
                receiptName: overrides[txId] || baseName,
                transactionRef: clean(row[7]) || '-',
                status: 'synced',
                notes: baseName,
                negeri: negeri,
                sumber: sumber,
                fundCat1: clean(row[13]) || 'Unknown',
                fundCat2: clean(row[14]) || 'Unknown'
            });
        }

        data.sort((a, b) => new Date(b.date) - new Date(a.date));
        return data;
    }

    async getData() {
        if (this.cache) return this.cache;

        const localCsv = localStorage.getItem(CACHE_KEY);
        if (localCsv) {
            this.cache = this.processCSVData(localCsv);
            // Optionally run sync in background
            this.syncData();
            return this.cache;
        }

        return await this.syncData();
    }

    async syncData() {
        const dataSource = localStorage.getItem('hcf_data_source') || 'local';
        
        if (dataSource === 'google') {
            console.log("Fetching live data from Google Sheets API...");
            try {
                const userSheetUrl = localStorage.getItem('hcf_google_sheet_url') || DEFAULT_SHEET_CSV_URL;
                const baseUrl = getCsvExportUrl(userSheetUrl);
                const separator = baseUrl.includes('?') ? '&' : '?';
                const liveUrl = baseUrl + separator + "t=" + new Date().getTime();
                const proxy = "https://api.allorigins.win/raw?url=" + encodeURIComponent(liveUrl);
                
                const response = await fetch(proxy, { cache: 'no-store', headers: { 'Pragma': 'no-cache' } });
                if (!response.ok) throw new Error("Network response was not ok");
                
                const csvText = await response.text();
                if (csvText.includes('<!DOCTYPE html>') || csvText.includes('<html') || csvText.includes('401') || !csvText.includes(',')) {
                    throw new Error("Invalid CSV. You may have provided a private sheet URL or Google is blocking it.");
                }

                localStorage.setItem(CACHE_KEY, csvText);
                this.cache = this.processCSVData(csvText);
                return this.cache;
            } catch (err) {
                console.error("Google sync failed, falling back to cache.", err);
                const localCsv = localStorage.getItem(CACHE_KEY);
                if (localCsv) {
                    this.cache = this.processCSVData(localCsv);
                    return this.cache;
                }
            }
        }

        console.log("Awaiting local disk backup CSV...");
        
        return new Promise((resolve) => {
            const overlay = document.getElementById('file-overlay');
            const dataContent1 = document.querySelector('.stats-grid');
            const dataContent2 = document.querySelectorAll('.charts-grid');
            const dataContent3 = document.querySelector('.data-table-card');
            
            // Hide data, show upload overlay
            if (overlay) overlay.style.display = 'flex';
            if (dataContent1) dataContent1.style.display = 'none';
            dataContent2.forEach(grid => grid.style.display = 'none');
            if (dataContent3) dataContent3.style.display = 'none';

            const fileInput = document.getElementById('csv-file-input');
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const csvText = event.target.result;
                        localStorage.setItem(CACHE_KEY, csvText);
                        
                        this.cache = this.processCSVData(csvText);
                        
                        // Restore view
                        if (overlay) overlay.style.display = 'none';
                        if (dataContent1) dataContent1.style.display = 'grid';
                        dataContent2.forEach(grid => grid.style.display = 'grid');
                        if (dataContent3) dataContent3.style.display = 'block';
                        
                        // Callback to reload charts
                        resolve(this.cache);
                        
                        // Hard reload required to render dashboard fully with new data
                        if (window.loadData) window.loadData();
                    };
                    reader.readAsText(file);
                });
            }
        });
    }

    async addRecord(record) {
        return new Promise((resolve) => {
            setTimeout(() => {
                alert('In live Excel sync mode, please enter data directly into the Google Sheet.');
                resolve(record);
            }, 500);
        });
    }
}

const api = new APIService();
window.api = api;
