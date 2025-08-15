// Sidebar Manager Module
const sidebarManager = {
    toggleSidebar() {
        const { sideBarDiv, layoutDiv } = uiManager.elements;
        if (sideBarDiv && layoutDiv) {
            sideBarDiv.classList.toggle('hidden');
            layoutDiv.classList.toggle('full-width');
            // Save sidebar state to localStorage
            const isHidden = sideBarDiv.classList.contains('hidden');
            dataManager.saveSidebarState(isHidden ? 'hidden' : 'visible');
            // Update button text/icons
            uiManager.updateSidebarButtons();
        }
    },
    showSidebar() {
        const { sideBarDiv, layoutDiv } = uiManager.elements;
        if (sideBarDiv && layoutDiv) {
            sideBarDiv.classList.remove('hidden');
            layoutDiv.classList.remove('full-width');
            // Save sidebar state to localStorage
            dataManager.saveSidebarState('visible');
            // Update button text/icons
            uiManager.updateSidebarButtons();
        }
    },
    openMobileSidebar() {
        const { mobileSidebarModal } = uiManager.elements;
        if (mobileSidebarModal) {
            mobileSidebarModal.classList.remove('hidden');
        }
    },
    closeMobileSidebar() {
        const { mobileSidebarModal } = uiManager.elements;
        if (mobileSidebarModal) {
            mobileSidebarModal.classList.add('hidden');
        }
    }
};
// Make sidebarManager globally available
window.sidebarManager = sidebarManager;