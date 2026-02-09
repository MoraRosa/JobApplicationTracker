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
     * Get stats from applications (optionally filtered)
     */
    getStats(apps = null) {
        const data = apps || this.applications;
        
        return {
            total: data.length,
            applied: data.filter(a => a['Application Status'] === 'Applied').length,
            interviews: data.filter(a => {
                const status = a['Application Status']?.toLowerCase() || '';
                return status.includes('interview') || 
                       status.includes('recruiter screen') || 
                       a['Interview Stage'];
            }).length,
            offers: data.filter(a => a['Application Status'] === 'Offer').length,
            rejected: data.filter(a => a['Application Status'] === 'Rejected').length,
            stale: data.filter(a => a['Stale App Flag'] === 'STALE').length
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