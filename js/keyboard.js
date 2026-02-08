// ===================================
// KEYBOARD SHORTCUTS
// ===================================

const Keyboard = {
    selectedRow: -1, // Currently selected table row index

    /**
     * Initialize keyboard event listeners
     */
    init() {
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    },

    /**
     * Handle all keyboard shortcuts
     */
    handleKeyPress(e) {
        // Ignore if user is typing in an input/textarea/select
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            // Allow Escape even in inputs
            if (e.key === 'Escape') {
                e.target.blur();
                this.closeModal();
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                this.closeModal();
                break;

            case '/':
                e.preventDefault();
                this.focusSearch();
                break;

            case 'ArrowDown':
                e.preventDefault();
                this.navigateDown();
                break;

            case 'ArrowUp':
                e.preventDefault();
                this.navigateUp();
                break;

            case 'Enter':
                e.preventDefault();
                this.openSelectedRow();
                break;

            case 'r':
            case 'R':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    App.refreshData();
                }
                break;

            case '?':
                e.preventDefault();
                this.showShortcutsHelp();
                break;
        }
    },

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.getElementById('detailModal');
        if (modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    },

    /**
     * Focus search input
     */
    focusSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.focus();
        searchInput.select();
    },

    /**
     * Navigate to next row
     */
    navigateDown() {
        const rows = document.querySelectorAll('#applicationsTableBody tr');
        if (rows.length === 0) return;

        // Remove current highlight
        this.clearHighlight();

        // Move down
        this.selectedRow = Math.min(this.selectedRow + 1, rows.length - 1);

        // Highlight new row
        this.highlightRow(rows[this.selectedRow]);
    },

    /**
     * Navigate to previous row
     */
    navigateUp() {
        const rows = document.querySelectorAll('#applicationsTableBody tr');
        if (rows.length === 0) return;

        // Remove current highlight
        this.clearHighlight();

        // Move up
        this.selectedRow = Math.max(this.selectedRow - 1, 0);

        // Highlight new row
        this.highlightRow(rows[this.selectedRow]);
    },

    /**
     * Clear row highlight
     */
    clearHighlight() {
        const rows = document.querySelectorAll('#applicationsTableBody tr');
        rows.forEach(row => row.classList.remove('keyboard-selected'));
    },

    /**
     * Highlight a row
     */
    highlightRow(row) {
        row.classList.add('keyboard-selected');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },

    /**
     * Open the currently selected row in modal
     */
    openSelectedRow() {
        const rows = document.querySelectorAll('#applicationsTableBody tr');
        if (this.selectedRow >= 0 && this.selectedRow < rows.length) {
            rows[this.selectedRow].click();
        }
    },

    /**
     * Reset selection when table changes
     */
    resetSelection() {
        this.selectedRow = -1;
        this.clearHighlight();
    },

    /**
     * Show keyboard shortcuts help
     */
    showShortcutsHelp() {
        const helpText = `
KEYBOARD SHORTCUTS:

Navigation:
  ↑ / ↓        Navigate table rows
  Enter        Open selected row details
  Escape       Close modal / Clear input

Search & Filter:
  /            Focus search box
  Ctrl/Cmd+R   Refresh data

Help:
  ?            Show this help
        `;

        alert(helpText);
    }
};

// Export
window.Keyboard = Keyboard;
