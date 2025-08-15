// UI Manager Module
const uiManager = {
    // DOM Elements
    elements: {
        // Task containers
        todoTasksContainer: document.getElementById('todo-tasks'),
        doingTasksContainer: document.getElementById('doing-tasks'),
        doneTasksContainer: document.getElementById('done-tasks'),
        // Count display elements
        todoCountEl: document.getElementById('todo-count'),
        doingCountEl: document.getElementById('doing-count'),
        doneCountEl: document.getElementById('done-count'),
        // Loading and Error States
        loadingMessage: document.getElementById('loading-message'),
        errorMessage: document.getElementById('error-message'),
        retryBtn: document.getElementById('retry-btn'),
        mainContent: document.getElementById('main-content'),
        // Sidebar Elements
        sideBarDiv: document.getElementById('side-bar-div'),
        layoutDiv: document.getElementById('layout'),
        hideSidebarBtn: document.getElementById('hide-sidebar-btn'),
        showSidebarBtn: document.getElementById('show-sidebar-btn'),
        // Mobile Elements
        logoMobile: document.querySelector('.logo-mobile'),
        mobileSidebarModal: document.getElementById('mobile-sidebar-modal'),
        closeMobileSidebarBtn: document.getElementById('close-mobile-sidebar-btn')
    },
    // UI State Management
    showLoading() {
        this.elements.loadingMessage.classList.remove('hidden');
        this.elements.errorMessage.classList.add('hidden');
        this.elements.mainContent.classList.add('hidden');
    },
    hideLoading() {
        this.elements.loadingMessage.classList.add('hidden');
        this.elements.mainContent.classList.remove('hidden');
    },
    showError() {
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.loadingMessage.classList.add('hidden');
        this.elements.mainContent.classList.add('hidden');
    },
    hideError() {
        this.elements.errorMessage.classList.add('hidden');
        this.elements.mainContent.classList.remove('hidden');
    },
    // Task Rendering
    updateColumnCounts() {
        const tasks = dataManager.getTasks();
        const todoCount = tasks.filter(t => t.status === 'todo').length;
        const doingCount = tasks.filter(t => t.status === 'doing').length;
        const doneCount = tasks.filter(t => t.status === 'done').length;
        if (this.elements.todoCountEl) this.elements.todoCountEl.textContent = todoCount;
        if (this.elements.doingCountEl) this.elements.doingCountEl.textContent = doingCount;
        if (this.elements.doneCountEl) this.elements.doneCountEl.textContent = doneCount;
    },
    createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-div';
        taskDiv.dataset.id = task.id;
        taskDiv.textContent = task.title;
        // Add priority dot
        const priorityDot = document.createElement('span');
        priorityDot.className = `priority-dot ${task.priority}`;
        taskDiv.appendChild(priorityDot);
        // Open the EDIT modal when clicked
        taskDiv.addEventListener('click', () => modalManager.openEditTaskModal(task));
        return taskDiv;
    },
    renderTasks() {
        // Clear existing tasks
        if (this.elements.todoTasksContainer) this.elements.todoTasksContainer.innerHTML = '';
        if (this.elements.doingTasksContainer) this.elements.doingTasksContainer.innerHTML = '';
        if (this.elements.doneTasksContainer) this.elements.doneTasksContainer.innerHTML = '';
        // Render tasks based on status
        const tasks = dataManager.getTasks();
        tasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            const container = this.getTaskContainerByStatus(task.status);
            if (container) {
                container.appendChild(taskElement);
            }
        });
        this.updateColumnCounts();
    },
    getTaskContainerByStatus(status) {
        switch (status) {
            case 'todo': return this.elements.todoTasksContainer;
            case 'doing': return this.elements.doingTasksContainer;
            case 'done': return this.elements.doneTasksContainer;
            default:
                console.warn(`Unknown status: ${status}`);
                return null;
        }
    },
    // Sidebar UI Management
    updateSidebarButtons() {
        const isHidden = this.elements.sideBarDiv.classList.contains('hidden');
        // Update hide/show sidebar button in the sidebar
        if (this.elements.hideSidebarBtn) {
            this.elements.hideSidebarBtn.innerHTML = isHidden ?
                '<span class="icon">▶</span> Show Sidebar' :
                '<span class="icon">◀</span> Hide Sidebar';
        }
        // Show/hide the show-sidebar button
        if (this.elements.showSidebarBtn) {
            this.elements.showSidebarBtn.style.display = isHidden ? 'block' : 'none';
        }
    },
    initSidebar() {
        const savedState = dataManager.loadSidebarState();
        if (savedState === 'hidden') {
            if (this.elements.sideBarDiv) this.elements.sideBarDiv.classList.add('hidden');
            if (this.elements.layoutDiv) this.elements.layoutDiv.classList.add('full-width');
            if (this.elements.showSidebarBtn) this.elements.showSidebarBtn.style.display = 'block';
        } else {
            if (this.elements.showSidebarBtn) this.elements.showSidebarBtn.style.display = 'none';
        }
        // Update button states
        this.updateSidebarButtons();
    },
    // Theme UI Management
    initTheme() {
        const savedTheme = dataManager.loadThemePreference();
        const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
        const mobileThemeToggleCheckbox = document.getElementById('mobile-theme-toggle-checkbox');
        if (savedTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
            if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = true;
        } else if (savedTheme === 'light') {
            document.body.removeAttribute('data-theme');
            if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
            if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = false;
        } else {
            // Fallback to system preference
            const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
            if (prefersDarkScheme.matches) {
                document.body.setAttribute('data-theme', 'dark');
                if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
                if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = true;
            } else {
                document.body.removeAttribute('data-theme');
                if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
                if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = false;
            }
        }
    },
    //  toggleTheme function
    toggleTheme() {
        // Get both checkboxes
        const themeToggleCheckbox = document.getElementById('theme-toggle-checkbox');
        const mobileThemeToggleCheckbox = document.getElementById('mobile-theme-toggle-checkbox');

        // Determine the desired theme state.
        // We'll use the desktop checkbox as the primary source.
        // If it's not found, fall back to the mobile one (though ideally both exist).
        let isDarkModeIntended = false;
        if (themeToggleCheckbox) {
            isDarkModeIntended = themeToggleCheckbox.checked;
        } else if (mobileThemeToggleCheckbox) {
            isDarkModeIntended = mobileThemeToggleCheckbox.checked;
        }
        // Optional: If neither checkbox is found, you could fall back to system preference or saved state,
        // but typically this function is only called when a checkbox exists and changes.

        // Apply the determined theme state
        if (isDarkModeIntended) {
            document.body.setAttribute('data-theme', 'dark');
            dataManager.saveThemePreference('dark');
            // Ensure both checkboxes are checked
            if (themeToggleCheckbox) themeToggleCheckbox.checked = true;
            if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = true;
        } else {
            document.body.removeAttribute('data-theme'); // Or set to 'light' if you prefer an explicit attribute
            dataManager.saveThemePreference('light');
            // Ensure both checkboxes are unchecked
            if (themeToggleCheckbox) themeToggleCheckbox.checked = false;
            if (mobileThemeToggleCheckbox) mobileThemeToggleCheckbox.checked = false;
        }
    }
};
// Make uiManager globally available
window.uiManager = uiManager;