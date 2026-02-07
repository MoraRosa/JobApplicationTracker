// ===================================
// STATE MANAGEMENT
// ===================================

const State = {
    // Raw data from sheets
    applications: [],
    resumes: [],
    templates: [],
    
    // Filtered/sorted data
    filteredApplications: [],
    
    // UI state
    sortColumn: null,
    sortDirection: 'asc',
    currentTheme: 'light',
    
    /**
     * Update applications data
     */
    setApplications(data) {
        this.applications = data;
        this.filteredApplications = data;
    },
    
    /**
     * Update resumes data
     */
    setResumes(data) {
        this.resumes = data;
    },
    
    /**
     * Update templates data
     */
    setTemplates(data) {
        this.templates = data;
    },
    
    /**
     * Update filtered applications
     */
    setFilteredApplications(data) {
        this.filteredApplications = data;
    },
    
    /**
     * Get stats from current applications
     */
    getStats() {
        const apps = this.applications;
        
        return {
            total: apps.length,
            applied: apps.filter(a => a['Application Status'] === 'Applied').length,
            interviews: apps.filter(a => 
                a['Application Status']?.toLowerCase().includes('interview') || 
                a['Interview Stage']
            ).length,
            offers: apps.filter(a => a['Application Status'] === 'Offer').length,
            rejected: apps.filter(a => a['Application Status'] === 'Rejected').length,
            stale: apps.filter(a => a['Stale App Flag'] === 'STALE').length
        };
    },
    
    /**
     * Get unique statuses
     */
    getUniqueStatuses() {
        return [...new Set(this.applications.map(a => a['Application Status']).filter(Boolean))];
    }
};

// Export
window.State = State;
