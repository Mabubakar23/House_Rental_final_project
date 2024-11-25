//script.js
// Theme toggle logic
const toggleButton = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.className = savedTheme;
    toggleButton.textContent =
        savedTheme === 'light-mode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
}

toggleButton.addEventListener('click', () => {
    const currentTheme = body.classList.contains('light-mode') ? 'dark-mode' : 'light-mode';
    body.className = currentTheme;
    toggleButton.textContent = currentTheme === 'light-mode' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    localStorage.setItem('theme', currentTheme);
});
