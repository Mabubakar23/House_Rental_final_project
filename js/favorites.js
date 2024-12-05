// Retrieve favorites from localStorage
function getFavorites() {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  }
  
  // Save updated favorites to localStorage
  function saveFavorites(favorites) {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
  
  // Render favorites on the favorites page
  function renderFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Clear the container
  
    const favorites = getFavorites();
  
    if (favorites.length === 0) {
      container.innerHTML = '<p>No favorite properties yet.</p>';
      return;
    }
  
    favorites.forEach((property) => {
      const propertyDiv = document.createElement('div');
      propertyDiv.className = 'favorite-property';
  
      propertyDiv.innerHTML = `
        <div class="property-card">
          <h3>${property.title}</h3>
          <p><strong>Description:</strong> ${property.description}</p>
          <p><strong>Price per night:</strong> $${property.price}</p>
          <p><strong>Location:</strong> ${property.location}</p>
          <p><strong>Rooms:</strong> ${property.rooms}, <strong>Bathrooms:</strong> ${property.bathrooms}</p>
          <button onclick="removeFromFavorites('${property.id}')">Remove</button>
        </div>
      `;
  
      container.appendChild(propertyDiv);
    });
  }
  
  // Remove a property from favorites
  function removeFromFavorites(id) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((property) => property.id !== id);
    saveFavorites(updatedFavorites);
    renderFavorites(); // Re-render the favorites list
    alert('Property removed from favorites!');
  }
  
  // Initialize the favorites page
  document.addEventListener('DOMContentLoaded', renderFavorites);
  