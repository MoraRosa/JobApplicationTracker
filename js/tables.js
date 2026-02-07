// ===================================
// TABLES & MODALS
// ===================================

const Tables = {
    /**
     * Render stats cards
     */
    renderStats() {
        const stats = State.getStats();
        
        document.getElementById('totalApps').textContent = stats.total;
        document.getElementById('appliedCount').textContent = stats.applied;
        document.getElementById('interviewCount').textContent = stats.interviews;
        document.getElementById('offerCount').textContent = stats.offers;
        document.getElementById('rejectedCount').textContent = stats.rejected;
        document.getElementById('staleCount').textContent = stats.stale;
    },

    /**
     * Render applications table
     */
    renderApplicationsTable() {
        const tbody = document.getElementById('applicationsTableBody');
        tbody.innerHTML = '';
        
        const apps = Filters.getPaginatedData();
        
        if (apps.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No applications found</td></tr>';
            return;
        }
        
        apps.forEach(app => {
            const tr = document.createElement('tr');
            tr.onclick = () => this.showApplicationDetail(app);
            
            const status = app['Application Status'] || '';
            const statusClass = status.toLowerCase().replace(/\s+/g, '-');
            
            tr.innerHTML = `
                <td><strong>${app['Company Name']}</strong></td>
                <td>${app['Job Title']}</td>
                <td>${app['Location']}</td>
                <td><span class="status-badge status-${statusClass}">${status}</span></td>
                <td>${Utils.formatDate(app['Date Applied'])}</td>
                <td>${app['Days Since Applied'] || '-'}</td>
                <td>${app['Priority Score'] || '-'}</td>
                <td class="${app['Stale App Flag'] === 'STALE' ? 'flag-stale' : ''}">${app['Stale App Flag'] || '-'}</td>
            `;
            
            tbody.appendChild(tr);
        });
    },

    /**
     * Show application detail modal
     */
    showApplicationDetail(app) {
        const modal = document.getElementById('detailModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <div class="detail-header">
                <h2>${app['Company Name']}</h2>
                <h3>${app['Job Title']}</h3>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-clipboard-list"></i> Job Details</h4>
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
                <div class="modal-buttons">
                    ${app['Job Posting Link'] ? `<a href="${app['Job Posting Link']}" target="_blank" rel="noopener noreferrer" class="btn-modal"><i class="fas fa-file-alt"></i> Job Posting</a>` : ''}
                    ${app['LinkedIn Job Link'] ? `<a href="${app['LinkedIn Job Link']}" target="_blank" rel="noopener noreferrer" class="btn-modal"><i class="fab fa-linkedin"></i> LinkedIn</a>` : ''}
                    ${app['Company Website'] ? `<a href="${app['Company Website']}" target="_blank" rel="noopener noreferrer" class="btn-modal"><i class="fas fa-globe"></i> Company Site</a>` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-dollar-sign"></i> Compensation</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Salary Range</span>
                        <span class="detail-value">${Utils.formatSalaryRange(app['Salary Range Low'], app['Salary Range High'])}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">My Minimum</span>
                        <span class="detail-value">${Utils.formatMoney(app['My Minimum Salary'])}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-file-alt"></i> Application Materials</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">Resume Used</span>
                        <span class="detail-value">${app['Resume Used'] || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Cover Letter</span>
                        <span class="detail-value">${app['Cover Letter Used'] || '-'}</span>
                    </div>
                </div>
            </div>
            
            ${app['General Notes'] ? `
            <div class="detail-section">
                <h4><i class="fas fa-sticky-note"></i> Notes</h4>
                <p>${app['General Notes']}</p>
            </div>
            ` : ''}
        `;
        
        modal.classList.add('active');
    },

    /**
     * Render resumes
     */
    renderResumes() {
        const grid = document.getElementById('resumeGrid');
        grid.innerHTML = '';
        
        if (State.resumes.length === 0) {
            grid.innerHTML = '<p class="text-muted text-center">No resumes in library</p>';
            return;
        }
        
        State.resumes.forEach(resume => {
            const card = document.createElement('div');
            card.className = 'resume-card';
            
            card.innerHTML = `
                <h3>${resume['Resume ID'] || 'Untitled'}</h3>
                <p><strong>Focus:</strong> ${resume['Focus'] || '-'}</p>
                <p><strong>Version:</strong> ${resume['Version'] || '-'}</p>
                <p><strong>Last Updated:</strong> ${Utils.formatDate(resume['Last Updated'])}</p>
                ${resume['Notes'] ? `<p class="text-muted">${resume['Notes']}</p>` : ''}
                ${resume['File Link'] ? `<a href="${resume['File Link']}" target="_blank">View Resume</a>` : ''}
            `;
            
            grid.appendChild(card);
        });
    },

    /**
     * Render templates
     */
    renderTemplates() {
        const grid = document.getElementById('templatesGrid');
        grid.innerHTML = '';
        
        if (State.templates.length === 0) {
            grid.innerHTML = '<p class="text-muted text-center">No templates available</p>';
            return;
        }
        
        State.templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            
            card.innerHTML = `
                <h3>${template['Template Name'] || 'Untitled'}</h3>
                <p class="text-muted">${template['Use Case'] || ''}</p>
                <div class="template-body">${template['Email Body'] || ''}</div>
                <button onclick="Tables.copyTemplate('${template['Template Name']}')">Copy Template</button>
            `;
            
            grid.appendChild(card);
        });
    },

    /**
     * Copy template to clipboard
     */
    copyTemplate(templateName) {
        const template = State.templates.find(t => t['Template Name'] === templateName);
        if (!template) return;
        
        navigator.clipboard.writeText(template['Email Body']).then(() => {
            alert('Template copied to clipboard!');
        });
    }
};

// Export
window.Tables = Tables;