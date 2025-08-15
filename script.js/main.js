// Main Application Entry Point
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    uiManager.initTheme(); // Set initial theme
    uiManager.initSidebar(); // Set initial sidebar state
    taskOperations.initTasks(); // Fetch and initialize tasks
    // Initialize event listeners
    modalManager.initEventListeners();
    // Initialize sidebar toggle buttons
    const { hideSidebarBtn, showSidebarBtn } = uiManager.elements;
    if (hideSidebarBtn) {
        hideSidebarBtn.addEventListener('click', () => sidebarManager.toggleSidebar());
    }
    if (showSidebarBtn) {
        showSidebarBtn.addEventListener('click', () => sidebarManager.showSidebar());
    }
    // Initialize theme toggle buttons
    const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
    const mobileThemeToggleCheckbox = document.getElementById('mobile-theme-toggle-checkbox');
    if (themeToggleCheckbox) {
        themeToggleCheckbox.addEventListener('change', () => uiManager.toggleTheme());
    }
    if (mobileThemeToggleCheckbox) {
        mobileThemeToggleCheckbox.addEventListener('change', () => uiManager.toggleTheme());
    }
});