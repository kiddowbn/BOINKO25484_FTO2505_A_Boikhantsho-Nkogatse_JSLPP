// Data Manager Module
const LOCAL_STORAGE_KEY = 'kanbanTasksV7';
const THEME_STORAGE_KEY = 'themePreference';
const SIDEBAR_STORAGE_KEY = 'sidebarState';
const dataManager = {
    tasks: [],
    // Local Storage Methods
    saveTasksToLocalStorage(tasks) {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        } catch (e) {
            console.error("Error saving tasks to localStorage:", e);
        }
    },
    loadTasksFromLocalStorage() {
        try {
            const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
            return storedTasks ? JSON.parse(storedTasks) : null;
        } catch (e) {
            console.error("Error parsing tasks from localStorage:", e);
            return null;
        }
    },
    // Theme Methods
    saveThemePreference(theme) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    },
    loadThemePreference() {
        return localStorage.getItem(THEME_STORAGE_KEY);
    },
    // Sidebar Methods
    saveSidebarState(state) {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, state);
    },
    loadSidebarState() {
        return localStorage.getItem(SIDEBAR_STORAGE_KEY);
    },
    // Task Management Methods
    setTasks(newTasks) {
        this.tasks = newTasks;
        this.saveTasksToLocalStorage(newTasks);
    },
    getTasks() {
        return this.tasks;
    },
    addTask(task) {
        this.tasks.push(task);
        this.saveTasksToLocalStorage(this.tasks);
    },
    updateTask(updatedTask) {
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
            this.tasks[index] = updatedTask;
            this.saveTasksToLocalStorage(this.tasks);
        }
    },
    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasksToLocalStorage(this.tasks);
    }
};
// Make dataManager globally available
window.dataManager = dataManager;