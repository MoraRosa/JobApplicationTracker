// ===================================
// CONFIGURATION
// ===================================

const CONFIG = {
    // API Configuration
    API_KEY: 'AIzaSyD5uQ1BClLALWoTLwBo7C3ZN__IE2G9h4U',
    SHEET_ID: '1gh1WEjfYoBb91ZoySapr3GRv13c84tHu8YdY8pXB4Nw',
    
    // Tab names (must match your Google Sheet tabs exactly)
    TABS: {
        APPLICATIONS: 'Applications',
        RESUMES: 'Resume Library',
        TEMPLATES: 'Follow-Up Templates'
    },
    
    // Chart colors
    COLORS: {
        LIGHT: {
            PRIMARY: '#6F4E37',
            SECONDARY: '#A0826D',
            PALETTE: ['#6F4E37', '#A0826D', '#D4B5A0', '#8D6E63', '#6F8FAF', '#4A7C59']
        },
        DARK: {
            PRIMARY: '#C4A77D',
            SECONDARY: '#8B7355',
            PALETTE: ['#C4A77D', '#8B7355', '#6F5A45', '#A0927F', '#8FAAC4', '#6FA97D']
        }
    }
};

// Export for use in other modules
window.CONFIG = CONFIG;
