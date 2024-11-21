// Add event listener to the theme toggle button
document.getElementById("theme-toggle").addEventListener("click", () => {
    // Toggle the dark-mode class on the body
    const isDark = document.body.classList.toggle("dark-mode");

    // Save the current theme in localStorage
    localStorage.setItem("theme", isDark ? "dark" : "light");
});

// Apply the saved theme on page load
document.addEventListener("DOMContentLoaded", () => {
    // Check the theme stored in localStorage
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
});

// Optional: Adjust theme toggle button text dynamically
const themeToggleButton = document.getElementById("theme-toggle");
document.addEventListener("DOMContentLoaded", () => {
    // Update button text based on the current theme
    if (localStorage.getItem("theme") === "dark") {
        themeToggleButton.textContent = "Switch to Light Mode";
    } else {
        themeToggleButton.textContent = "Switch to Dark Mode";
    }
});

// Update button text when toggling
themeToggleButton.addEventListener("click", () => {
    themeToggleButton.textContent = document.body.classList.contains("dark-mode")
        ? "Switch to Dark Mode"
        : "Switch to Light Mode";
});
