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

const searchInput = document.getElementById('search-input');
const clearButton = document.getElementById('clear-button');

// Show the clear button if there's text in the input
searchInput.addEventListener('input', () => {
    clearButton.style.display = searchInput.value ? 'inline' : 'none';
});

// Clear the search input field
function clearSearch() {
    searchInput.value = '';
    clearButton.style.display = 'none';
    searchInput.focus(); // Focus back on the input
}

// Perform the search action
function performSearch() {
    const query = searchInput.value;
    if (query) {
        alert(`Searching for: ${query}`);
        // Implement the actual search functionality here.
    } else {
        alert('Please enter a search term.');
    }
}