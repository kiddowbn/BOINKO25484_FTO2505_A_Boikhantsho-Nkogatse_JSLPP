// Task Operations Module
const taskOperations = {
    async initTasks() {
        uiManager.showLoading();
        try {
            // Try to fetch from API first
            const tasks = await api.fetchTasks();
            dataManager.setTasks(tasks);
            uiManager.renderTasks();
            uiManager.hideLoading();
        } catch (error) {
            // If API fails, try localStorage
            const localTasks = dataManager.loadTasksFromLocalStorage();
            if (localTasks) {
                dataManager.setTasks(localTasks);
                uiManager.renderTasks();
                uiManager.hideLoading();
                // Show a warning that we're using local data
                console.warn("Using local storage data due to API failure");
            } else {
                // If both fail, show error
                uiManager.showError();
            }
        }
    },
    async addNewTask(newTask) {
        try {
            // Save to API
            const createdTask = await api.saveTask(newTask);
            dataManager.addTask(createdTask);
            uiManager.renderTasks(); // Re-render the updated list
        } catch (error) {
            // Fallback to local storage if API fails
            newTask.id = Date.now(); // Generate local ID
            dataManager.addTask(newTask);
            uiManager.renderTasks();
            console.error("Failed to save task to API, saved locally:", error);
        }
    },
    async updateTask(updatedTask) {
        try {
            // Update in API
            const updatedTaskFromAPI = await api.updateTask(updatedTask);
            dataManager.updateTask(updatedTaskFromAPI);
            uiManager.renderTasks(); // Re-render the updated list
        } catch (error) {
            // Fallback to local storage if API fails
            dataManager.updateTask(updatedTask);
            uiManager.renderTasks();
            console.error("Failed to update task in API, updated locally:", error);
        }
    },
    async deleteTask(taskId) {
        try {
            // Delete from API
            await api.deleteTask(taskId);
            dataManager.deleteTask(taskId);
            uiManager.renderTasks();
            modalManager.closeEditTaskModal();
        } catch (error) {
            // Fallback to local storage if API fails
            dataManager.deleteTask(taskId);
            uiManager.renderTasks();
            modalManager.closeEditTaskModal();
            console.error("Failed to delete task from API, deleted locally:", error);
        }
    }
};
// Make taskOperations globally available
window.taskOperations = taskOperations;