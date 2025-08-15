// script.js/initialData.js

/**
 * Provides initial/default tasks for the application.
 * Used to populate localStorage on first run if API and localStorage are empty.
 */

// Define the initial set of tasks
export const initialTasks = [
  {
    id: 1,
    title: "Launch Epic Career 🚀",
    description: "Create a killer Resume",
    status: "todo",
    board: "Launch Career",
    priority: "medium" // Added default priority
  },
  {
    id: 2,
    title: "Master JavaScript 💛",
    description: "Get comfortable with the fundamentals",
    status: "doing",
    board: "Launch Career",
    priority: "high"
  },
  {
    id: 3,
    title: "Keep on Going 🏆",
    description: "You're almost there",
    status: "doing",
    board: "Launch Career",
    priority: "medium"
  },
  {
    id: 11,
    title: "Learn Data Structures and Algorithms 📚",
    description:
      "Study fundamental data structures and algorithms to solve coding problems efficiently",
    status: "todo",
    board: "Launch Career",
    priority: "low"
  },
  {
    id: 12,
    title: "Contribute to Open Source Projects 🌐",
    description:
      "Gain practical experience and collaborate with others in the software development community",
    status: "done",
    board: "Launch Career",
    priority: "medium"
  },
  {
    id: 13,
    title: "Build Portfolio Projects 🛠️",
    description:
      "Create a portfolio showcasing your skills and projects to potential employers",
    status: "done",
    board: "Launch Career",
    priority: "high"
  },
];

/**
 * Seeds localStorage with initialTasks if the tasks key is not found or empty.
 * @returns {Array|null} The initial tasks array if seeding occurred, otherwise null.
 */
export function seedLocalStorageIfEmpty() {
    // Import the key from dataManager. Assuming it's accessible.
    // If not, define it here or pass it as a parameter.
    const LOCAL_STORAGE_KEY = 'kanbanTasksV7'; // Match the key in dataManager.js

    try {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);

        // Check if localStorage is empty or has no tasks
        if (!storedTasks || storedTasks === 'null' || storedTasks === 'undefined' || JSON.parse(storedTasks).length === 0) {
            console.log("LocalStorage is empty or uninitialized for tasks. Seeding with initialTasks.");
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
            return initialTasks; // Indicate that seeding happened
        } else {
            console.log("LocalStorage already contains tasks. No seeding needed.");
            return null; // Indicate no seeding was needed
        }
    } catch (e) {
        console.error("Error checking or seeding localStorage with initialTasks:", e);
        return null; // Indicate seeding failed or was not needed due to error
    }
}

// If you need this module's functions globally accessible (less common with modules),
// you might consider assigning the exports to a global object, but typically 'import' is used.
// window.MyInitialDataModule = { initialTasks, seedLocalStorageIfEmpty };

// ... (rest of initialData.js content) ...

/**
 * Seeds localStorage with initialTasks if the tasks key is not found or empty.
 * @returns {Array|null} The initial tasks array if seeding occurred, otherwise null.
 */
export function seedLocalStorageIfEmpty() {
    // Use the same key as defined in dataManager.js for consistency
    const LOCAL_STORAGE_KEY = 'kanbanTasksV7';

    try {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);

        // Check if localStorage is uninitialized or has no tasks
        if (!storedTasks || storedTasks === 'null' || storedTasks === 'undefined' || (JSON.parse(storedTasks).length === 0)) {
            console.log("LocalStorage is empty or uninitialized for tasks. Seeding with initialTasks.");
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
            return initialTasks; // Indicate that seeding happened
        } else {
            console.log("LocalStorage already contains tasks. No seeding needed.");
            return null; // Indicate no seeding was needed
        }
    } catch (e) {
        console.error("Error checking or seeding localStorage with initialTasks:", e);
        // Return the initial tasks in case of parsing error, so the user sees something
        // This handles cases where storedTasks is invalid JSON
        try {
             const parsed = JSON.parse(storedTasks);
             if (!Array.isArray(parsed)) throw new Error("Stored data is not an array");
             // If parsing succeeds but length is 0, still seed
             if (parsed.length === 0) {
                 localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
                 return initialTasks;
             }
             // If parsing succeeds and has items, don't seed
             return null;
        } catch(parseError) {
            console.error("Stored tasks data is corrupt. Seeding with initialTasks.", parseError);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialTasks));
            return initialTasks;
        }
        // Original catch fallback if nested try also fails unexpectedly
        return null;
    }
}

// --- Make the seeding function globally accessible ---
// This allows non-module scripts like taskOperations.js to call it.
// We wrap the function to avoid exposing the internal `initialTasks` directly if needed,
// but here we expose the function itself.
window.seedLocalStorageIfEmptyFromInitialData = seedLocalStorageIfEmpty;

// Optional: Also expose initialTasks if other non-module scripts need direct access
// window.initialTasksDataFromInitialData = initialTasks;