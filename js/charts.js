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
        this.renderInterviewSuccessChart();
        this.renderOfferConversionChart();
        this.renderResponseTimeChart();
    },

    /**
     * Filter applications by date range
     */
    getFilteredByDate() {
        // In 'all' mode, return ALL applications (even those without dates)
        if (this.dateRange === 'all') {
            return State.applications;
        }

        // For other filters, only use apps with dates
        const apps = State.applications.filter(a => a['Date Applied']);
        
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
            UI.alert('Please select both start and end dates');
            return;
        }

        this.customStart = start;
        this.customEnd = end;
        this.dateRange = 'custom';
        
        this.destroyAll();
        this.renderAll();
        Tables.renderStats(); // Update stats with custom range
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
     * Render application funnel chart
     */
    renderFunnelChart() {
        const apps = this.getFilteredByDate();
        
        const total = apps.length;
        const applied = apps.filter(a => a['Application Status'] === 'Applied').length;
        const screening = apps.filter(a => {
            const status = a['Application Status']?.toLowerCase() || '';
            return status.includes('screening') || status.includes('recruiter screen');
        }).length;
        const interviews = apps.filter(a => {
            const status = a['Application Status']?.toLowerCase() || '';
            return status.includes('interview') || a['Interview Stage'];
        }).length;
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
     * Render interview success rate chart
     */
    renderInterviewSuccessChart() {
        const apps = this.getFilteredByDate();
        
        const totalApplied = apps.length;
        const gotInterview = apps.filter(a => {
            const status = a['Application Status']?.toLowerCase() || '';
            return status.includes('interview') || 
                   status.includes('recruiter screen') || 
                   a['Interview Stage'];
        }).length;
        const noInterview = totalApplied - gotInterview;

        const successRate = totalApplied > 0 ? ((gotInterview / totalApplied) * 100).toFixed(1) : 0;

        const ctx = document.getElementById('interviewSuccessChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: [`Got Interview (${successRate}%)`, 'No Interview'],
                datasets: [{
                    data: [gotInterview, noInterview],
                    backgroundColor: [colors.PALETTE[3], colors.PALETTE[2]],
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
     * Render offer conversion rate chart
     */
    renderOfferConversionChart() {
        const apps = this.getFilteredByDate();
        
        const totalInterviews = apps.filter(a => 
            a['Application Status']?.toLowerCase().includes('interview') || 
            a['Interview Stage']
        ).length;
        
        const gotOffer = apps.filter(a => a['Application Status'] === 'Offer').length;
        const noOffer = totalInterviews - gotOffer;

        const offerRate = totalInterviews > 0 ? ((gotOffer / totalInterviews) * 100).toFixed(1) : 0;

        const ctx = document.getElementById('offerConversionChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: totalInterviews > 0 ? [`Got Offer (${offerRate}%)`, 'No Offer'] : ['No Interviews Yet'],
                datasets: [{
                    data: totalInterviews > 0 ? [gotOffer, noOffer] : [1],
                    backgroundColor: totalInterviews > 0 ? [colors.PALETTE[5], colors.PALETTE[0]] : [colors.PALETTE[1]],
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
     * Render average response time chart
     */
    renderResponseTimeChart() {
        const apps = this.getFilteredByDate();
        
        // Calculate response times (apps that got a response)
        const responseTimes = apps
            .filter(a => {
                const status = a['Application Status']?.toLowerCase() || '';
                const days = parseInt(a['Days Since Applied']);
                return status !== 'applied' && !isNaN(days);
            })
            .map(a => parseInt(a['Days Since Applied']));

        if (responseTimes.length === 0) {
            // No data - show placeholder
            const ctx = document.getElementById('responseTimeChart');
            const isDark = Utils.isDarkTheme();
            
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Waiting for responses...'],
                    datasets: [{
                        label: 'Days',
                        data: [0],
                        backgroundColor: isDark ? CONFIG.COLORS.DARK.PALETTE[1] : CONFIG.COLORS.LIGHT.PALETTE[1]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
            return;
        }

        // Group by time buckets
        const buckets = {
            '0-7 days': responseTimes.filter(d => d <= 7).length,
            '8-14 days': responseTimes.filter(d => d > 7 && d <= 14).length,
            '15-30 days': responseTimes.filter(d => d > 14 && d <= 30).length,
            '30+ days': responseTimes.filter(d => d > 30).length
        };

        const ctx = document.getElementById('responseTimeChart');
        const isDark = Utils.isDarkTheme();
        const colors = isDark ? CONFIG.COLORS.DARK : CONFIG.COLORS.LIGHT;
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(buckets),
                datasets: [{
                    label: 'Companies',
                    data: Object.values(buckets),
                    backgroundColor: colors.PRIMARY,
                    borderWidth: 0
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
                        grid: { display: false }
                    }
                }
            }
        });
    },

    /**
     * Destroy existing charts before re-rendering
     */
    destroyAll() {
        const chartIds = ['timelineChart', 'statusChart', 'funnelChart', 'responseChart', 'interviewSuccessChart', 'offerConversionChart', 'responseTimeChart'];
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