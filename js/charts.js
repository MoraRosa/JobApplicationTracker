// ===================================
// CHARTS
// ===================================

const Charts = {
    dateRange: 'all', // Current date range filter
    customStart: null,
    customEnd: null,

    /**
     * Render all charts
     */
    renderAll() {
        this.renderTimelineChart();
        this.renderStatusChart();
        this.renderFunnelChart();
        this.renderResponseChart();
    },

    /**
     * Filter applications by date range
     */
    getFilteredByDate() {
        const apps = State.applications.filter(a => a['Date Applied']);
        
        if (this.dateRange === 'all') {
            return apps;
        }

        const now = new Date();
        const cutoffDate = new Date();

        switch (this.dateRange) {
            case '7':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case '30':
                cutoffDate.setDate(now.getDate() - 30);
                break;
            case '90':
                cutoffDate.setDate(now.getDate() - 90);
                break;
            case 'year':
                cutoffDate.setMonth(0, 1); // Jan 1st of current year
                break;
            case 'custom':
                if (!this.customStart || !this.customEnd) return apps;
                return apps.filter(app => {
                    const appDate = new Date(Utils.parseDateString(app['Date Applied']));
                    return appDate >= new Date(this.customStart) && appDate <= new Date(this.customEnd);
                });
        }

        return apps.filter(app => {
            const appDate = new Date(Utils.parseDateString(app['Date Applied']));
            return appDate >= cutoffDate;
        });
    },

    /**
     * Apply custom date range
     */
    applyCustomRange() {
        const start = document.getElementById('startDate').value;
        const end = document.getElementById('endDate').value;

        if (!start || !end) {
            alert('Please select both start and end dates');
            return;
        }

        this.customStart = start;
        this.customEnd = end;
        this.dateRange = 'custom';
        
        this.destroyAll();
        this.renderAll();
    },

    /**
     * Render timeline chart (applications over time)
     */
    renderTimelineChart() {
        const apps = this.getFilteredByDate();
        
        // Group by day
        const dayCounts = {};
        apps.forEach(app => {
            const dateStr = app['Date Applied'];
            const parsedDate = Utils.parseDateString(dateStr);
            if (parsedDate) {
                dayCounts[parsedDate] = (dayCounts[parsedDate] || 0) + 1;
            }
        });
        
        // Sort by date
        const sortedDays = Object.keys(dayCounts).sort();
        const labels = sortedDays.map(d => Utils.formatDate(new Date(d)));
        const data = sortedDays.map(d => dayCounts[d]);
        
        const ctx = document.getElementById('timelineChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Applications',
                    data: data,
                    borderColor: colors.PRIMARY,
                    backgroundColor: isDark ? 'rgba(196, 167, 125, 0.1)' : 'rgba(111, 78, 55, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            stepSize: 1,
                            color: isDark ? '#D4C5B4' : '#5D4037'
                        },
                        grid: {
                            color: isDark ? '#3A2F2A' : '#E0D5C7'
                        }
                    },
                    x: {
                        ticks: { color: isDark ? '#D4C5B4' : '#5D4037' },
                        grid: {
                            color: isDark ? '#3A2F2A' : '#E0D5C7'
                        }
                    }
                }
            }
        });
    },

    /**
     * Render status distribution chart
     */
    renderStatusChart() {
        const apps = this.getFilteredByDate();
        const statusCounts = {};
        
        apps.forEach(app => {
            const status = app['Application Status'] || 'Unknown';
            statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        
        const ctx = document.getElementById('statusChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(statusCounts),
                datasets: [{
                    data: Object.values(statusCounts),
                    backgroundColor: colors.PALETTE,
                    borderWidth: 2,
                    borderColor: isDark ? '#2B2320' : '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: isDark ? '#D4C5B4' : '#5D4037',
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    },

    /**
     * Render application funnel chart
     */
    renderFunnelChart() {
        const apps = this.getFilteredByDate();
        
        const total = apps.length;
        const applied = apps.filter(a => a['Application Status'] === 'Applied').length;
        const screening = apps.filter(a => a['Application Status']?.toLowerCase().includes('screening')).length;
        const interviews = apps.filter(a => 
            a['Application Status']?.toLowerCase().includes('interview') || 
            a['Interview Stage']
        ).length;
        const offers = apps.filter(a => a['Application Status'] === 'Offer').length;

        const ctx = document.getElementById('funnelChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Total', 'Applied', 'Screening', 'Interview', 'Offer'],
                datasets: [{
                    label: 'Applications',
                    data: [total, applied, screening, interviews, offers],
                    backgroundColor: [
                        colors.PALETTE[0],
                        colors.PALETTE[1],
                        colors.PALETTE[2],
                        colors.PALETTE[3],
                        colors.PALETTE[4]
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: { 
                            stepSize: 1,
                            color: isDark ? '#D4C5B4' : '#5D4037'
                        },
                        grid: {
                            color: isDark ? '#3A2F2A' : '#E0D5C7'
                        }
                    },
                    y: {
                        ticks: { color: isDark ? '#D4C5B4' : '#5D4037' },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    /**
     * Render response rate chart
     */
    renderResponseChart() {
        const apps = this.getFilteredByDate();
        
        const total = apps.length;
        const responded = apps.filter(a => {
            const status = a['Application Status']?.toLowerCase() || '';
            return status !== 'applied' && status !== '' && status !== 'unknown';
        }).length;
        const noResponse = total - responded;

        const responseRate = total > 0 ? ((responded / total) * 100).toFixed(1) : 0;

        const ctx = document.getElementById('responseChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Responded (${responseRate}%)`, 'No Response'],
                datasets: [{
                    data: [responded, noResponse],
                    backgroundColor: [colors.PALETTE[4], colors.PALETTE[1]],
                    borderWidth: 2,
                    borderColor: isDark ? '#2B2320' : '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: isDark ? '#D4C5B4' : '#5D4037',
                            padding: 15,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    },

    /**
     * Destroy existing charts before re-rendering
     */
    destroyAll() {
        const chartIds = ['timelineChart', 'statusChart', 'funnelChart', 'responseChart'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (canvas) {
                const chart = Chart.getChart(canvas);
                if (chart) {
                    chart.destroy();
                }
            }
        });
    }
};

// Export
window.Charts = Charts;