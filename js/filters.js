// ===================================
// FILTERS & SEARCH
// ===================================

const Filters = {
    currentPage: 1,
    rowsPerPage: 100,

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
     * Apply sorting based on dropdown
     */
    applySorting() {
        const sortBy = document.getElementById('sortBy').value;
        
        if (!sortBy) return;

        const [field, direction] = sortBy.split('-');

        State.filteredApplications.sort((a, b) => {
            let aVal, bVal;

            switch (field) {
                case 'company':
                    aVal = a['Company Name'] || '';
                    bVal = b['Company Name'] || '';
                    break;
                case 'date':
                    aVal = new Date(Utils.parseDateString(a['Date Applied']) || 0);
                    bVal = new Date(Utils.parseDateString(b['Date Applied']) || 0);
                    break;
                case 'priority':
                    aVal = parseFloat(a['Priority Score']) || 0;
                    bVal = parseFloat(b['Priority Score']) || 0;
                    break;
                default:
                    return 0;
            }

            if (direction === 'asc' || direction === 'oldest' || direction === 'low') {
                return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            } else {
                return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
            }
        });

        this.currentPage = 1; // Reset to first page
        Tables.renderApplicationsTable();
        this.updatePagination();
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
        
        // Apply current sorting
        this.applySorting();
        
        this.currentPage = 1; // Reset to first page
        Tables.renderApplicationsTable();
        this.updatePagination();
    },

    /**
     * Get paginated data
     */
    getPaginatedData() {
        if (this.rowsPerPage === 'all') {
            return State.filteredApplications;
        }

        const start = (this.currentPage - 1) * this.rowsPerPage;
        const end = start + this.rowsPerPage;
        return State.filteredApplications.slice(start, end);
    },

    /**
     * Update pagination controls
     */
    updatePagination() {
        const total = State.filteredApplications.length;
        const totalPages = this.rowsPerPage === 'all' ? 1 : Math.ceil(total / this.rowsPerPage);

        const start = this.rowsPerPage === 'all' ? 1 : (this.currentPage - 1) * this.rowsPerPage + 1;
        const end = this.rowsPerPage === 'all' ? total : Math.min(this.currentPage * this.rowsPerPage, total);

        document.getElementById('pageStart').textContent = total === 0 ? 0 : start;
        document.getElementById('pageEnd').textContent = end;
        document.getElementById('totalAppsCount').textContent = total;
        document.getElementById('pageInfo').textContent = this.rowsPerPage === 'all' ? 'All' : `Page ${this.currentPage} of ${totalPages}`;

        document.getElementById('prevPage').disabled = this.currentPage === 1;
        document.getElementById('nextPage').disabled = this.currentPage === totalPages || this.rowsPerPage === 'all';
    },

    /**
     * Go to previous page
     */
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            Tables.renderApplicationsTable();
            this.updatePagination();
        }
    },

    /**
     * Go to next page
     */
    nextPage() {
        const totalPages = Math.ceil(State.filteredApplications.length / this.rowsPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            Tables.renderApplicationsTable();
            this.updatePagination();
        }
    },

    /**
     * Change rows per page
     */
    changeRowsPerPage() {
        const value = document.getElementById('rowsPerPage').value;
        this.rowsPerPage = value === 'all' ? 'all' : parseInt(value);
        this.currentPage = 1;
        Tables.renderApplicationsTable();
        this.updatePagination();
    },

    /**
     * Sort table by column (for column header clicks)
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
        this.updatePagination();
    }
};

// Export
window.Filters = Filters;