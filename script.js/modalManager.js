// Modal Manager Module
const modalManager = {
    // DOM Elements
    elements: {
        // Modals
        addTaskModal: document.getElementById('add-task-modal'),
        editTaskModal: document.getElementById('edit-task-modal'),
        // Add Task Modal Elements
        addTaskTitle: document.getElementById('add-task-title'),
        addTaskDescription: document.getElementById('add-task-description'),
        addTaskStatus: document.getElementById('add-task-status'),
        addTaskPriority: document.getElementById('add-task-priority'),
        titleError: document.getElementById('title-error'),
        descriptionError: document.getElementById('description-error'),
        // Edit Task Modal Elements
        editTaskId: document.getElementById('edit-task-id'),
        editTaskTitle: document.getElementById('edit-task-title'),
        editTaskDescription: document.getElementById('edit-task-description'),
        editTaskStatus: document.getElementById('edit-task-status'),
        editTaskPriority: document.getElementById('edit-task-priority'),
        editTitleError: document.getElementById('edit-title-error'),
        editDescriptionError: document.getElementById('edit-description-error'),
        // Buttons
        openAddModalBtn: document.getElementById('add-task-btn'),
        closeAddModalBtn: document.getElementById('close-add-modal-btn'),
        addTaskSubmitBtn: document.getElementById('create-task-btn'),
        closeEditModalBtn: document.getElementById('close-edit-modal-btn'),
        editTaskSubmitBtn: document.getElementById('save-task-btn'),
        deleteTaskBtn: document.getElementById('delete-task-btn')
    },
    currentTaskId: null,
    // Add Task Modal Methods
    openAddTaskModal() {
        const {
            addTaskTitle, addTaskDescription, addTaskStatus, addTaskPriority,
            titleError, descriptionError
        } = this.elements;
        if (addTaskTitle) addTaskTitle.value = '';
        if (addTaskDescription) addTaskDescription.value = '';
        if (addTaskStatus) addTaskStatus.value = 'todo'; // Default status
        if (addTaskPriority) addTaskPriority.value = 'medium'; // Default priority
        // Hide error messages
        if (titleError) titleError.classList.add('hidden');
        if (descriptionError) descriptionError.classList.add('hidden');
        const { addTaskModal } = this.elements;
        if (addTaskModal) {
            addTaskModal.classList.remove('hidden');
        }
    },
    closeAddTaskModal() {
        const { addTaskModal } = this.elements;
        if (addTaskModal) {
            addTaskModal.classList.add('hidden');
        }
    },
    validateAddTaskForm() {
        const {
            addTaskTitle, addTaskDescription,
            titleError, descriptionError
        } = this.elements;
        let isValid = true;
        if (addTaskTitle && addTaskTitle.value.trim() === '') {
            if (titleError) {
                titleError.classList.remove('hidden');
            }
            isValid = false;
        } else {
            if (titleError) {
                titleError.classList.add('hidden');
            }
        }
        if (addTaskDescription && addTaskDescription.value.trim() === '') {
            if (descriptionError) {
                descriptionError.classList.remove('hidden');
            }
            isValid = false;
        } else {
            if (descriptionError) {
                descriptionError.classList.add('hidden');
            }
        }
        return isValid;
    },
    handleAddTaskSubmit() {
        if (!this.validateAddTaskForm()) {
            return;
        }
        const {
            addTaskTitle, addTaskDescription, addTaskStatus, addTaskPriority
        } = this.elements;
        const title = addTaskTitle ? addTaskTitle.value.trim() : '';
        const description = addTaskDescription ? addTaskDescription.value.trim() : '';
        const status = addTaskStatus ? addTaskStatus.value : 'todo';
        const priority = addTaskPriority ? addTaskPriority.value : 'medium';
        const newTask = {
            title: title,
            description: description,
            status: status,
            priority: priority
        };
        taskOperations.addNewTask(newTask);
        this.closeAddTaskModal();
    },
    // Edit Task Modal Methods
    openEditTaskModal(task) {
        this.currentTaskId = task.id; // Store the ID
        const {
            editTaskId, editTaskTitle, editTaskDescription,
            editTaskStatus, editTaskPriority,
            editTitleError, editDescriptionError
        } = this.elements;
        if (editTaskId) editTaskId.value = task.id;
        if (editTaskTitle) editTaskTitle.value = task.title || '';
        if (editTaskDescription) editTaskDescription.value = task.description || '';
        if (editTaskStatus) editTaskStatus.value = task.status || 'todo';
        if (editTaskPriority) editTaskPriority.value = task.priority || 'medium';
        // Hide error messages
        if (editTitleError) editTitleError.classList.add('hidden');
        if (editDescriptionError) editDescriptionError.classList.add('hidden');
        const { editTaskModal } = this.elements;
        if (editTaskModal) {
            editTaskModal.classList.remove('hidden');
        }
    },
    closeEditTaskModal() {
        const { editTaskModal } = this.elements;
        if (editTaskModal) {
            editTaskModal.classList.add('hidden');
        }
        this.currentTaskId = null; // Clear the ID
    },
    validateEditTaskForm() {
        const {
            editTaskTitle, editTaskDescription,
            editTitleError, editDescriptionError
        } = this.elements;
        let isValid = true;
        if (editTaskTitle && editTaskTitle.value.trim() === '') {
            if (editTitleError) {
                editTitleError.classList.remove('hidden');
            }
            isValid = false;
        } else {
            if (editTitleError) {
                editTitleError.classList.add('hidden');
            }
        }
        if (editTaskDescription && editTaskDescription.value.trim() === '') {
            if (editDescriptionError) {
                editDescriptionError.classList.remove('hidden');
            }
            isValid = false;
        } else {
            if (editDescriptionError) {
                editDescriptionError.classList.add('hidden');
            }
        }
        return isValid;
    },
    handleEditTaskSubmit() {
        if (this.currentTaskId === null) {
             console.error("No task ID set for editing.");
             this.closeEditTaskModal(); // Close modal if no task is set
             return;
        }
        if (!this.validateEditTaskForm()) {
            return;
        }
        const {
            editTaskTitle, editTaskDescription,
            editTaskStatus, editTaskPriority
        } = this.elements;
        const title = editTaskTitle ? editTaskTitle.value.trim() : '';
        const description = editTaskDescription ? editTaskDescription.value.trim() : '';
        const status = editTaskStatus ? editTaskStatus.value : 'todo';
        const priority = editTaskPriority ? editTaskPriority.value : 'medium';
        const updatedTask = {
            id: this.currentTaskId,
            title: title,
            description: description,
            status: status,
            priority: priority
        };
        taskOperations.updateTask(updatedTask);
        this.closeEditTaskModal();
    },
    handleDeleteTask() {
        if (this.currentTaskId !== null) {
            if (confirm("Are you sure you want to delete this task?")) {
                taskOperations.deleteTask(this.currentTaskId);
            }
        }
    },
    // Initialize Event Listeners
    initEventListeners() {
        const {
            openAddModalBtn, closeAddModalBtn, addTaskSubmitBtn,
            closeEditModalBtn, editTaskSubmitBtn, deleteTaskBtn,
            closeMobileSidebarBtn, retryBtn
        } = this.elements;
        // Add Task Modal Event Listeners
        if (openAddModalBtn) {
            openAddModalBtn.addEventListener('click', () => this.openAddTaskModal());
        }
        if (closeAddModalBtn) {
            closeAddModalBtn.addEventListener('click', () => this.closeAddTaskModal());
        }
        if (addTaskSubmitBtn) {
            addTaskSubmitBtn.addEventListener('click', () => this.handleAddTaskSubmit());
        }
        // Edit Task Modal Event Listeners
        if (closeEditModalBtn) {
            closeEditModalBtn.addEventListener('click', () => this.closeEditTaskModal());
        }
        if (editTaskSubmitBtn) {
            editTaskSubmitBtn.addEventListener('click', () => this.handleEditTaskSubmit());
        }
        if (deleteTaskBtn) {
            deleteTaskBtn.addEventListener('click', () => this.handleDeleteTask());
        }
        // Mobile Sidebar Event Listeners
        if (uiManager.elements.logoMobile) {
            uiManager.elements.logoMobile.addEventListener('click', () => sidebarManager.openMobileSidebar());
        }
        if (closeMobileSidebarBtn) {
            closeMobileSidebarBtn.addEventListener('click', () => sidebarManager.closeMobileSidebar());
        }
        // Retry button for error state
        if (retryBtn) {
            retryBtn.addEventListener('click', () => taskOperations.initTasks());
        }
        // Close modals if clicked outside of content
        window.addEventListener('click', (event) => {
            const { addTaskModal, editTaskModal } = this.elements;
            const { mobileSidebarModal } = uiManager.elements;
            if (addTaskModal && event.target === addTaskModal) {
                this.closeAddTaskModal();
            }
            if (editTaskModal && event.target === editTaskModal) {
                this.closeEditTaskModal();
            }
            if (mobileSidebarModal && event.target === mobileSidebarModal) {
                sidebarManager.closeMobileSidebar();
            }
        });
    }
};
// Make modalManager globally available
window.modalManager = modalManager;