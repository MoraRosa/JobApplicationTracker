// ===================================
// MAIN APPLICATION
// ===================================

const App = {
    /**
     * Initialize the application
     */
    async init() {
        this.loadTheme();
        this.setupEventListeners();
        await this.loadAllData();
    },

    /**
     * Refresh data without showing loading/error states
     */
    async refreshData() {
        try {
            const { applications, resumes, templates } = await API.fetchAllData();
            
            State.setApplications(applications);
            State.setResumes(resumes);
            State.setTemplates(templates);
            
            this.renderDashboard();
        } catch (error) {
            console.error('Failed to refresh data:', error);
            alert('Failed to refresh data. Please try again.');
        }
    },

    /**
     * Load all data from Google Sheets
     */
    async loadAllData() {
        const loadingState = document.getElementById('loadingState');
        const errorState = document.getElementById('errorState');
        const mainContent = document.getElementById('mainContent');
        
        loadingState.style.display = 'block';
        errorState.style.display = 'none';
        mainContent.style.display = 'none';
        
        try {
            const { applications, resumes, templates } = await API.fetchAllData();
            
            State.setApplications(applications);
            State.setResumes(resumes);
            State.setTemplates(templates);
            
            this.renderDashboard();
            
            loadingState.style.display = 'none';
            mainContent.style.display = 'block';
            
        } catch (error) {
            console.error('Failed to load data:', error);
            loadingState.style.display = 'none';
            errorState.style.display = 'block';
        }
    },

    /**
     * Render entire dashboard
     */
    renderDashboard() {
        Tables.renderStats();
        Charts.renderAll();
        Tables.renderApplicationsTable();
        Tables.renderResumes();
        Tables.renderTemplates();
        Filters.populateFilters();
        Filters.updatePagination();
    },

    /**
     * Toggle theme (light/dark)
     */
    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        State.currentTheme = newTheme;
        
        // Update icon
        document.getElementById('sunIcon').style.display = newTheme === 'dark' ? 'none' : 'block';
        document.getElementById('moonIcon').style.display = newTheme === 'dark' ? 'block' : 'none';
        
        // Re-render charts with new theme colors
        Charts.destroyAll();
        Charts.renderAll();
    },

    /**
     * Load saved theme preference
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        State.currentTheme = savedTheme;
        
        document.getElementById('sunIcon').style.display = savedTheme === 'dark' ? 'none' : 'block';
        document.getElementById('moonIcon').style.display = savedTheme === 'dark' ? 'block' : 'none';
    },

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Remove active class from all buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show selected tab
        document.getElementById(`${tabName}Tab`).classList.add('active');
        event.target.classList.add('active');
    },

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Refresh button
        document.getElementById('refreshBtn').addEventListener('click', () => this.refreshData());
        
        // Search and filters
        document.getElementById('searchInput').addEventListener('input', () => Filters.applyFilters());
        document.getElementById('statusFilter').addEventListener('change', () => Filters.applyFilters());
        document.getElementById('staleFilter').addEventListener('change', () => Filters.applyFilters());
        document.getElementById('sortBy').addEventListener('change', () => Filters.applySorting());
        
        // Pagination
        document.getElementById('prevPage').addEventListener('click', () => Filters.prevPage());
        document.getElementById('nextPage').addEventListener('click', () => Filters.nextPage());
        document.getElementById('rowsPerPage').addEventListener('change', () => Filters.changeRowsPerPage());
        
        // Table sorting
        document.querySelectorAll('.applications-table th[data-sort]').forEach(th => {
            th.addEventListener('click', () => Filters.sortTable(th.getAttribute('data-sort')));
        });
        
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = btn.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Modal close
        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('detailModal').classList.remove('active');
        });
        
        // Close modal on outside click
        document.getElementById('detailModal').addEventListener('click', (e) => {
            if (e.target.id === 'detailModal') {
                document.getElementById('detailModal').classList.remove('active');
            }
        });

        // Date range filter
        document.getElementById('dateRangeFilter').addEventListener('change', (e) => {
            const value = e.target.value;
            const customRange = document.getElementById('customDateRange');
            
            if (value === 'custom') {
                customRange.style.display = 'flex';
            } else {
                customRange.style.display = 'none';
                Charts.dateRange = value;
                Charts.destroyAll();
                Charts.renderAll();
            }
        });
    }
};

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());