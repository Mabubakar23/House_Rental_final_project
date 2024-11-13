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
