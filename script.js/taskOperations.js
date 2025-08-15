// Task Operations Module
const taskOperations = {
    async initTasks() {
        uiManager.showLoading();
        try {
            // Try to fetch from API first
            console.log("Attempting to fetch tasks from API...");
            const tasks = await api.fetchTasks();
            console.log("Tasks fetched from API:", tasks);
            dataManager.setTasks(tasks);
            uiManager.renderTasks();
            uiManager.hideLoading();
        } catch (error) {
            console.error("API fetch failed:", error);
            // If API fails, try localStorage
            const localTasks = dataManager.loadTasksFromLocalStorage();
            console.log("Tasks loaded from localStorage:", localTasks);
            if (localTasks && localTasks.length > 0) {
                console.log("Using tasks from localStorage.");
                dataManager.setTasks(localTasks);
                uiManager.renderTasks();
                uiManager.hideLoading();
                // Optionally, inform the user that data is local
                // alert("Displaying locally saved tasks. API unavailable.");
                // Or show a less intrusive message in the UI if desired.
            } else {
                // If both API fails and there are no local tasks (or local is empty)
                console.log("No tasks found in API or localStorage. Assuming new user or cleared data.");
                // Hide loading and show main content (which will be empty columns)
                uiManager.hideLoading(); // Hide the "Loading..." message
                uiManager.hideError();   // Ensure error message is hidden
                // Render tasks anyway to initialize counts and ensure UI is ready
                // Even if the array is empty, this sets up the board correctly.
                dataManager.setTasks([]); // Initialize with an empty array
                uiManager.renderTasks();  // Render empty columns
                // Alternatively, you could call uiManager.showError(); here if you prefer
                // to explicitly tell the user there are no tasks yet.
            }
        }
    },

    async addNewTask(newTask) {
        // Ensure task has an ID. For truly new tasks, API usually assigns.
        // For local fallback, generate one. Using timestamp + random suffix is common.
        // If newTask.id exists (e.g., from a previous local save attempt), keep it.
        if (newTask.id === undefined || newTask.id === null || newTask.id === '') {
             // Assign a temporary ID for local storage if needed, ensuring uniqueness
             newTask.id = 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        try {
            // Save to API
            console.log("Attempting to save task to API:", newTask);
            const createdTask = await api.saveTask(newTask);
            console.log("Task saved to API:", createdTask);
            dataManager.addTask(createdTask); // Add task returned by API (might have server-generated ID)
            uiManager.renderTasks(); // Re-render the updated list
        } catch (error) {
            // Fallback to local storage if API fails
            console.error("Failed to save task to API, saving locally:", error);
            // Use the ID we assigned or the one that was already there
            dataManager.addTask(newTask);
            uiManager.renderTasks();
            // Optionally, inform the user that the task is saved locally
            // alert("Task saved locally. Will be synced when API is available.");
        }
    },

    async updateTask(updatedTask) {
        // Ensure the task has an ID
        if (!updatedTask.id) {
            console.error("Cannot update task without an ID:", updatedTask);
            // Optionally, show an error to the user
            return;
        }

        // Check if it's a locally created task (string ID starting with 'local_')
        const isLocalTask = typeof updatedTask.id === 'string' && updatedTask.id.startsWith('local_');

        if (isLocalTask) {
            // If it's a local task, just update it in localStorage
            console.log("Updating local task:", updatedTask);
            dataManager.updateTask(updatedTask);
            uiManager.renderTasks();
             // Optionally, inform the user if it's only local
             // alert("Task updated locally.");
        } else {
            // Otherwise, try to update it via the API
            try {
                console.log("Attempting to update task in API:", updatedTask);
                const updatedTaskFromAPI = await api.updateTask(updatedTask);
                console.log("Task updated in API:", updatedTaskFromAPI);
                dataManager.updateTask(updatedTaskFromAPI); // Update with data from API
                uiManager.renderTasks(); // Re-render the updated list
            } catch (error) {
                // Fallback to local storage if API fails
                console.error("Failed to update task in API, updated locally:", error);
                dataManager.updateTask(updatedTask); // Update local copy
                uiManager.renderTasks();
                // Optionally, inform the user
                // alert("Task updated locally. Will be synced when API is available.");
            }
        }
    },

    async deleteTask(taskId) {
         // Check if it's a locally created task (string ID starting with 'local_')
        const isLocalTask = typeof taskId === 'string' && taskId.startsWith('local_');

        if (isLocalTask) {
            // If it's a local task, just delete it from localStorage
            console.log("Deleting local task:", taskId);
            dataManager.deleteTask(taskId);
            uiManager.renderTasks();
            modalManager.closeEditTaskModal();
             // Optionally, inform the user
             // alert("Local task deleted.");
        } else {
            // Otherwise, try to delete it via the API
            try {
                console.log("Attempting to delete task from API:", taskId);
                // Delete from API
                await api.deleteTask(taskId);
                console.log("Task deleted from API:", taskId);
                dataManager.deleteTask(taskId);
                uiManager.renderTasks();
                modalManager.closeEditTaskModal();
            } catch (error) {
                // Fallback to local storage if API fails
                console.error("Failed to delete task from API, deleted locally:", error);
                dataManager.deleteTask(taskId); // Delete local copy
                uiManager.renderTasks();
                modalManager.closeEditTaskModal();
                // Optionally, inform the user
                // alert("Task marked as deleted locally. Will be synced when API is available.");
            }
        }
    }
};

// Make taskOperations globally available
window.taskOperations = taskOperations;