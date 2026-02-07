// ===================================
// GOOGLE SHEETS API
// ===================================

const API = {
    /**
     * Fetch data from a specific Google Sheets tab
     */
    async fetchSheetData(tabName) {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${tabName}?key=${CONFIG.API_KEY}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const requireCompanyName = tabName === CONFIG.TABS.APPLICATIONS;
            return this.parseSheetData(data.values, requireCompanyName);
        } catch (error) {
            console.error(`Error fetching ${tabName}:`, error);
            throw error;
        }
    },

    /**
     * Parse sheet data into objects
     */
    parseSheetData(rows, requireCompanyName = false) {
        if (!rows || rows.length === 0) return [];
        
        const headers = rows[0];
        const data = [];
        
        // Start from row 1 (skip headers)
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const obj = {};
            
            // Map each cell to its header
            headers.forEach((header, index) => {
                obj[header] = row[index] || '';
            });
            
            // Filter logic based on tab type
            if (requireCompanyName) {
                // For Applications: only include rows with company name
                if (obj['Company Name'] && obj['Company Name'].trim()) {
                    data.push(obj);
                }
            } else {
                // For Templates/Resumes: include any row with at least one non-empty field
                const hasData = Object.values(obj).some(val => val && val.trim());
                if (hasData) {
                    data.push(obj);
                }
            }
        }
        
        return data;
    },

    /**
     * Fetch all sheet data
     */
    async fetchAllData() {
        const [applications, resumes, templates] = await Promise.all([
            this.fetchSheetData(CONFIG.TABS.APPLICATIONS),
            this.fetchSheetData(CONFIG.TABS.RESUMES),
            this.fetchSheetData(CONFIG.TABS.TEMPLATES)
        ]);
        
        return { applications, resumes, templates };
    }
};

// Export
window.API = API;
