// ===================================
// CONFIGURATION
// ===================================

const CONFIG = {
    // Replace these with your actual values
    API_KEY: 'AIzaSyD5uQ1BClLALWoTLwBo7C3ZN__IE2G9h4U',
    SHEET_ID: '1gh1WEjfYoBb91ZoySapr3GRv13c84tHu8YdY8pXB4Nw',
    
    // Tab names (must match your Google Sheet tabs exactly)
    TABS: {
        APPLICATIONS: 'Applications',
        RESUMES: 'Resume Library',
        TEMPLATES: 'Follow-Up Templates'
    }
};

// ===================================
// STATE MANAGEMENT
// ===================================

const state = {
    applications: [],
    resumes: [],
    templates: [],
    filteredApplications: [],
    sortColumn: null,
    sortDirection: 'asc'
};

// ===================================
// GOOGLE SHEETS API
// ===================================

async function fetchSheetData(tabName) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${CONFIG.SHEET_ID}/values/${tabName}?key=${CONFIG.API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return parseSheetData(data.values);
    } catch (error) {
        console.error(`Error fetching ${tabName}:`, error);
        throw error;
    }
}

function parseSheetData(rows) {
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
        
        // Only include rows that have at least a company name
        if (obj['Company Name'] && obj['Company Name'].trim()) {
            data.push(obj);
        }
    }
    
    return data;
}

// ===================================
// INITIALIZATION
// ===================================

async function init() {
    // Load theme preference
    loadTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Fetch all data
    await loadAllData();
}

async function loadAllData() {
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const mainContent = document.getElementById('mainContent');
    
    loadingState.style.display = 'block';
    errorState.style.display = 'none';
    mainContent.style.display = 'none';
    
    try {
        // Fetch all tabs
        const [applications, resumes, templates] = await Promise.all([
            fetchSheetData(CONFIG.TABS.APPLICATIONS),
            fetchSheetData(CONFIG.TABS.RESUMES),
            fetchSheetData(CONFIG.TABS.TEMPLATES)
        ]);
        
        state.applications = applications;
        state.resumes = resumes;
        state.templates = templates;
        state.filteredApplications = applications;
        
        // Render everything
        renderDashboard();
        
        loadingState.style.display = 'none';
        mainContent.style.display = 'block';
        
    } catch (error) {
        console.error('Failed to load data:', error);
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
    }
}

// ===================================
// RENDER DASHBOARD
// ===================================

function renderDashboard() {
    renderStats();
    renderCharts();
    renderApplicationsTable();
    renderResumes();
    renderTemplates();
    populateFilters();
}

// ===================================
// STATS SECTION
// ===================================

function renderStats() {
    const apps = state.applications;
    
    const total = apps.length;
    const applied = apps.filter(a => a['Application Status'] === 'Applied').length;
    const interviews = apps.filter(a => 
        a['Application Status']?.toLowerCase().includes('interview') || 
        a['Interview Stage']
    ).length;
    const offers = apps.filter(a => a['Application Status'] === 'Offer').length;
    const rejected = apps.filter(a => a['Application Status'] === 'Rejected').length;
    const stale = apps.filter(a => a['Stale App Flag'] === 'STALE').length;
    
    document.getElementById('totalApps').textContent = total;
    document.getElementById('appliedCount').textContent = applied;
    document.getElementById('interviewCount').textContent = interviews;
    document.getElementById('offerCount').textContent = offers;
    document.getElementById('rejectedCount').textContent = rejected;
    document.getElementById('staleCount').textContent = stale;
}

// ===================================
// CHARTS
// ===================================

function renderCharts() {
    renderTimelineChart();
    renderStatusChart();
}

function renderTimelineChart() {
    const apps = state.applications.filter(a => a['Date Applied']);
    
    // Group by week
    const weekCounts = {};
    apps.forEach(app => {
        const date = new Date(app['Date Applied']);
        if (!isNaN(date)) {
            const weekStart = getWeekStart(date);
            weekCounts[weekStart] = (weekCounts[weekStart] || 0) + 1;
        }
    });
    
    // Sort by date
    const sortedWeeks = Object.keys(weekCounts).sort();
    const labels = sortedWeeks.map(w => formatDate(new Date(w)));
    const data = sortedWeeks.map(w => weekCounts[w]);
    
    const ctx = document.getElementById('timelineChart');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Applications',
                data: data,
                borderColor: isDark ? '#C4A77D' : '#6F4E37',
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
}

function renderStatusChart() {
    const apps = state.applications;
    const statusCounts = {};
    
    apps.forEach(app => {
        const status = app['Application Status'] || 'Unknown';
        statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    const ctx = document.getElementById('statusChart');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    const colors = isDark ? 
        ['#C4A77D', '#8B7355', '#6F5A45', '#A0927F', '#8FAAC4', '#6FA97D'] :
        ['#6F4E37', '#A0826D', '#D4B5A0', '#8D6E63', '#6F8FAF', '#4A7C59'];
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: colors,
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
}

// ===================================
// APPLICATIONS TABLE
// ===================================

function renderApplicationsTable() {
    const tbody = document.getElementById('applicationsTableBody');
    tbody.innerHTML = '';
    
    if (state.filteredApplications.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No applications found</td></tr>';
        return;
    }
    
    state.filteredApplications.forEach(app => {
        const tr = document.createElement('tr');
        tr.onclick = () => showApplicationDetail(app);
        
        const status = app['Application Status'] || '';
        const statusClass = status.toLowerCase().replace(/\s+/g, '-');
        
        tr.innerHTML = `
            <td><strong>${app['Company Name']}</strong></td>
            <td>${app['Job Title']}</td>
            <td>${app['Location']}</td>
            <td><span class="status-badge status-${statusClass}">${status}</span></td>
            <td>${formatDate(app['Date Applied'])}</td>
            <td>${app['Days Since Applied'] || '-'}</td>
            <td>${app['Priority Score'] || '-'}</td>
            <td class="${app['Stale App Flag'] === 'STALE' ? 'flag-stale' : ''}">${app['Stale App Flag'] || '-'}</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function showApplicationDetail(app) {
    const modal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="detail-header">
            <h2>${app['Company Name']}</h2>
            <h3>${app['Job Title']}</h3>
        </div>
        
        <div class="detail-section">
            <h4>📋 Job Details</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Location</span>
                    <span class="detail-value">${app['Location'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Job Type</span>
                    <span class="detail-value">${app['Job Type'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Industry</span>
                    <span class="detail-value">${app['Industry'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status</span>
                    <span class="detail-value">${app['Application Status'] || '-'}</span>
                </div>
            </div>
            ${app['Job Posting Link'] ? `<p class="mt-2"><a href="${app['Job Posting Link']}" target="_blank" class="btn-primary">View Job Posting</a></p>` : ''}
        </div>
        
        <div class="detail-section">
            <h4>💰 Compensation</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Salary Range</span>
                    <span class="detail-value">${formatSalaryRange(app['Salary Range Low'], app['Salary Range High'])}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">My Minimum</span>
                    <span class="detail-value">${formatMoney(app['My Minimum Salary'])}</span>
                </div>
                ${app['Offer Amount'] ? `
                <div class="detail-item">
                    <span class="detail-label">Offer Amount</span>
                    <span class="detail-value">${formatMoney(app['Offer Amount'])}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📄 Application Materials</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Resume Used</span>
                    <span class="detail-value">${app['Resume Used'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Cover Letter</span>
                    <span class="detail-value">${app['Cover Letter Used'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Portfolio</span>
                    <span class="detail-value">${app['Portfolio Link'] ? `<a href="${app['Portfolio Link']}" target="_blank">View</a>` : '-'}</span>
                </div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📅 Timeline</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Date Applied</span>
                    <span class="detail-value">${formatDate(app['Date Applied'])}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Days Since Applied</span>
                    <span class="detail-value">${app['Days Since Applied'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Follow-Up Sent</span>
                    <span class="detail-value">${app['Follow-Up Sent'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Last Contact</span>
                    <span class="detail-value">${formatDate(app['Last Contact Date'])}</span>
                </div>
            </div>
        </div>
        
        ${app['Interview Stage'] ? `
        <div class="detail-section">
            <h4>💼 Interview</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Stage</span>
                    <span class="detail-value">${app['Interview Stage']}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Type</span>
                    <span class="detail-value">${app['Interview Type'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Dates</span>
                    <span class="detail-value">${app['Interview Dates'] || '-'}</span>
                </div>
            </div>
            ${app['Interview Feedback'] ? `<p class="mt-2"><strong>Feedback:</strong> ${app['Interview Feedback']}</p>` : ''}
        </div>
        ` : ''}
        
        <div class="detail-section">
            <h4>⭐ Ratings & Priority</h4>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Interest Level</span>
                    <span class="detail-value">${app['Interest Level'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Role Fit</span>
                    <span class="detail-value">${app['Role Fit'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Priority Score</span>
                    <span class="detail-value">${app['Priority Score'] || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Weighted Priority</span>
                    <span class="detail-value">${app['Weighted Priority Score'] || '-'}</span>
                </div>
            </div>
        </div>
        
        ${app['General Notes'] ? `
        <div class="detail-section">
            <h4>📝 Notes</h4>
            <p>${app['General Notes']}</p>
        </div>
        ` : ''}
    `;
    
    modal.classList.add('active');
}

// ===================================
// RESUMES
// ===================================

function renderResumes() {
    const grid = document.getElementById('resumeGrid');
    grid.innerHTML = '';
    
    if (state.resumes.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center">No resumes in library</p>';
        return;
    }
    
    state.resumes.forEach(resume => {
        const card = document.createElement('div');
        card.className = 'resume-card';
        
        card.innerHTML = `
            <h3>${resume['Resume ID'] || 'Untitled'}</h3>
            <p><strong>Focus:</strong> ${resume['Focus'] || '-'}</p>
            <p><strong>Version:</strong> ${resume['Version'] || '-'}</p>
            <p><strong>Last Updated:</strong> ${formatDate(resume['Last Updated'])}</p>
            ${resume['Notes'] ? `<p class="text-muted">${resume['Notes']}</p>` : ''}
            ${resume['File Link'] ? `<a href="${resume['File Link']}" target="_blank">View Resume</a>` : ''}
        `;
        
        grid.appendChild(card);
    });
}

// ===================================
// TEMPLATES
// ===================================

function renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '';
    
    if (state.templates.length === 0) {
        grid.innerHTML = '<p class="text-muted text-center">No templates available</p>';
        return;
    }
    
    state.templates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';
        
        card.innerHTML = `
            <h3>${template['Template Name'] || 'Untitled'}</h3>
            <p class="text-muted">${template['Use Case'] || ''}</p>
            <div class="template-body">${template['Email Body'] || ''}</div>
            <button onclick="copyTemplate('${template['Template Name']}')">Copy Template</button>
        `;
        
        grid.appendChild(card);
    });
}

function copyTemplate(templateName) {
    const template = state.templates.find(t => t['Template Name'] === templateName);
    if (!template) return;
    
    navigator.clipboard.writeText(template['Email Body']).then(() => {
        alert('Template copied to clipboard!');
    });
}

// ===================================
// FILTERS & SEARCH
// ===================================

function populateFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const statuses = [...new Set(state.applications.map(a => a['Application Status']).filter(Boolean))];
    
    statuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusFilter.appendChild(option);
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    const staleFilter = document.getElementById('staleFilter').value;
    
    state.filteredApplications = state.applications.filter(app => {
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
    
    renderApplicationsTable();
}

// ===================================
// SORTING
// ===================================

function sortTable(column) {
    if (state.sortColumn === column) {
        state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        state.sortColumn = column;
        state.sortDirection = 'asc';
    }
    
    state.filteredApplications.sort((a, b) => {
        let aVal = a[column] || '';
        let bVal = b[column] || '';
        
        // Handle numbers
        if (!isNaN(aVal) && !isNaN(bVal)) {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        }
        
        if (aVal < bVal) return state.sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return state.sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    renderApplicationsTable();
}

// ===================================
// THEME TOGGLE
// ===================================

function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update icon
    document.getElementById('sunIcon').style.display = newTheme === 'dark' ? 'none' : 'block';
    document.getElementById('moonIcon').style.display = newTheme === 'dark' ? 'block' : 'none';
    
    // Re-render charts with new theme colors
    renderCharts();
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    document.getElementById('sunIcon').style.display = savedTheme === 'dark' ? 'none' : 'block';
    document.getElementById('moonIcon').style.display = savedTheme === 'dark' ? 'block' : 'none';
}

// ===================================
// TABS
// ===================================

function switchTab(tabName) {
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
}

// ===================================
// EVENT LISTENERS
// ===================================

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', loadAllData);
    
    // Search and filters
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('statusFilter').addEventListener('change', applyFilters);
    document.getElementById('staleFilter').addEventListener('change', applyFilters);
    
    // Table sorting
    document.querySelectorAll('.applications-table th[data-sort]').forEach(th => {
        th.addEventListener('click', () => sortTable(th.getAttribute('data-sort')));
    });
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
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
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatMoney(value) {
    if (!value) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

function formatSalaryRange(low, high) {
    if (!low && !high) return '-';
    if (!high) return `${formatMoney(low)}+`;
    return `${formatMoney(low)} - ${formatMoney(high)}`;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
}

// ===================================
// START APP
// ===================================

document.addEventListener('DOMContentLoaded', init);
