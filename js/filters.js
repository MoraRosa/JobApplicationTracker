// ===================================
// FILTERS & SEARCH
// ===================================

const Filters = {
    /**
     * Populate filter dropdowns
     */
    populateFilters() {
        const statusFilter = document.getElementById('statusFilter');
        const statuses = State.getUniqueStatuses();
        
        // Clear existing options (except "All Statuses")
        statusFilter.innerHTML = '<option value="">All Statuses</option>';
        
        statuses.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            statusFilter.appendChild(option);
        });
    },

    /**
     * Apply all active filters
     */
    applyFilters() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const staleFilter = document.getElementById('staleFilter').value;
        
        const filtered = State.applications.filter(app => {
            // Search filter
            const searchMatch = !searchTerm || 
                app['Company Name']?.toLowerCase().includes(searchTerm) ||
                app['Job Title']?.toLowerCase().includes(searchTerm) ||
                app['Location']?.toLowerCase().includes(searchTerm);
            
            // Status filter
            const statusMatch = !statusFilter || app['Application Status'] === statusFilter;
            
            // Stale filter
            let staleMatch = true;
            if (staleFilter === 'STALE') {
                staleMatch = app['Stale App Flag'] === 'STALE';
            } else if (staleFilter === 'ACTIVE') {
                staleMatch = app['Stale App Flag'] !== 'STALE';
            }
            
            return searchMatch && statusMatch && staleMatch;
        });
        
        State.setFilteredApplications(filtered);
        Tables.renderApplicationsTable();
    },

    /**
     * Sort table by column
     */
    sortTable(column) {
        if (State.sortColumn === column) {
            State.sortDirection = State.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            State.sortColumn = column;
            State.sortDirection = 'asc';
        }
        
        State.filteredApplications.sort((a, b) => {
            let aVal = a[column] || '';
            let bVal = b[column] || '';
            
            // Handle numbers
            if (!isNaN(aVal) && !isNaN(bVal)) {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            }
            
            if (aVal < bVal) return State.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return State.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        Tables.renderApplicationsTable();
    }
};

// Export
window.Filters = Filters;
