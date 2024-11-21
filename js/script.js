// js/script.js

const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

// Check if user has a saved preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
    toggleButton.textContent =
        savedTheme === 'light-mode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
}

// Add an event listener to toggle the theme
toggleButton.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.className = 'dark-mode';
        toggleButton.textContent = 'Switch to Light Mode';
        localStorage.setItem('theme', 'dark-mode'); // Save the preference
    } else {
        body.className = 'light-mode';
        toggleButton.textContent = 'Switch to Dark Mode';
        localStorage.setItem('theme', 'light-mode'); // Save the preference
    }
});
