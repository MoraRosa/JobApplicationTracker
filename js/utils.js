// ===================================
// UTILITY FUNCTIONS
// ===================================

const Utils = {
    /**
     * Format date string to readable format
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date)) return dateString;
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
    },

    /**
     * Format money value to USD currency
     */
    formatMoney(value) {
        if (!value || value === '') return '-';
        
        // If it's already a formatted currency string, return it
        if (typeof value === 'string' && value.includes('$')) {
            return value;
        }
        
        // Otherwise parse and format
        const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
        if (isNaN(num)) return '-';
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency: 'USD', 
            maximumFractionDigits: 0 
        }).format(num);
    },

    /**
     * Format salary range
     */
    formatSalaryRange(low, high) {
        if (!low && !high) return '-';
        if (!high) return `${this.formatMoney(low)}+`;
        return `${this.formatMoney(low)} - ${this.formatMoney(high)}`;
    },

    /**
     * Get the Monday of the week for a given date
     */
    getWeekStart(date) {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    },

    /**
     * Parse date from M/D/YYYY format to YYYY-MM-DD
     */
    parseDateString(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            const year = parts[2];
            const month = parts[0].padStart(2, '0');
            const day = parts[1].padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        return null;
    },

    /**
     * Check if current theme is dark
     */
    isDarkTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    },

    /**
     * Debounce function for search inputs
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export
window.Utils = Utils;