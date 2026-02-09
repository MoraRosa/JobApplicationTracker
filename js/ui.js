// ===================================
// UI UTILITIES (Modals & Toasts)
// ===================================

const UI = {
    /**
     * Show custom alert modal (replaces browser alert)
     */
    alert(message) {
        const modal = document.getElementById('customModal');
        const body = document.getElementById('customModalBody');
        
        body.innerHTML = `<p>${message}</p>`;
        modal.classList.add('active');
    },

    /**
     * Show keyboard shortcuts help in custom modal
     */
    showKeyboardHelp() {
        const modal = document.getElementById('customModal');
        const body = document.getElementById('customModalBody');
        
        body.innerHTML = `
            <h3 style="margin-bottom: 1rem; color: var(--accent-primary);">⌨️ Keyboard Shortcuts</h3>
            <pre>Navigation:
  ↑ / ↓        Navigate table rows
  Enter        Open selected row details
  Escape       Close modal / Clear input

Search & Filter:
  /            Focus search box
  Ctrl/Cmd+R   Refresh data

Help:
  ?            Show this help</pre>
        `;
        modal.classList.add('active');
    },

    /**
     * Show toast notification
     */
    toast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        
        toast.innerHTML = `
            <div class="toast-icon">${icons[type] || icons.info}</div>
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// Export
window.UI = UI;
