/**
 * Toggle the theme between light and dark mode.
 * Updates the DOM and persists the user's choice in localStorage.
 */
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle("dark-mode");

    // Update the localStorage with the current theme
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");

    // Update the toggle button text
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.textContent = isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
}

/**
 * Apply the saved theme on page load.
 * Checks localStorage for the previously saved theme preference.
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    } else {
        document.body.classList.remove("dark-mode");
    }

    // Update the toggle button text accordingly
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.textContent = savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    }
}

/**
 * Attach an event listener to the theme toggle button.
 * Ensures functionality for toggling themes on user interaction.
 */
function attachThemeToggleListener() {
    const themeToggleButton = document.getElementById("theme-toggle");
    if (themeToggleButton) {
        themeToggleButton.addEventListener("click", toggleTheme);
    }
}

/**
 * Initialize theme management on DOM content loaded.
 * Applies saved theme and sets up event listeners.
 */
document.addEventListener("DOMContentLoaded", () => {
    applySavedTheme();
    attachThemeToggleListener();
});
