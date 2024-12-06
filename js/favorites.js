import {
    getFirestore,
    doc,
    getDocs,
    getDoc,
    collection
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { auth } from "./app.js";

const db = getFirestore();

/**
 * Fetches the user's favorite property IDs from the Firestore database.
 * @returns {Promise<Array>} - Array of property IDs marked as favorites by the current user.
 */
async function fetchFavoritePropertyIds() {
    const user = auth.currentUser;

    if (!user) {
        console.error("No user logged in.");
        return [];
    }

    try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            return userData.favorites || [];
        } else {
            console.error("User document does not exist.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching favorite property IDs:", error.message);
        return [];
    }
}

/**
 * Fetches property details based on a list of property IDs.
 * @param {Array} propertyIds - Array of property IDs to fetch details for.
 * @returns {Promise<Array>} - Array of property objects.
 */
async function fetchPropertiesByIds(propertyIds) {
    try {
        const propertyPromises = propertyIds.map(async (id) => {
            const propertyDocRef = doc(db, "properties", id);
            const propertyDoc = await getDoc(propertyDocRef);

            if (propertyDoc.exists()) {
                return { id, ...propertyDoc.data() };
            }
            return null;
        });

        const properties = await Promise.all(propertyPromises);
        return properties.filter((property) => property !== null); // Filter out null values
    } catch (error) {
        console.error("Error fetching properties:", error.message);
        return [];
    }
}

/**
 * Renders the favorite properties on the favorites page.
 * @param {Array} properties - Array of property objects to render.
 */
function renderFavoriteProperties(properties) {
    const favoritesContainer = document.getElementById("favorites-container");
    favoritesContainer.innerHTML = ""; // Clear existing content

    if (properties.length === 0) {
        favoritesContainer.innerHTML = "<p>No favorite properties yet.</p>";
        return;
    }

    properties.forEach((property) => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");

        propertyCard.innerHTML = `
            <h3>${property.title}</h3>
            <p>${property.description}</p>
            <p><strong>Price:</strong> $${property.price} per night</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Rooms:</strong> ${property.rooms}</p>
            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
        `;

        favoritesContainer.appendChild(propertyCard);
    });
}

/**
 * Fetches and displays the user's favorite properties on the favorites page.
 */
async function fetchAndRenderFavoriteProperties() {
    const favoritePropertyIds = await fetchFavoritePropertyIds();
    if (favoritePropertyIds.length > 0) {
        const favoriteProperties = await fetchPropertiesByIds(favoritePropertyIds);
        renderFavoriteProperties(favoriteProperties);
    } else {
        renderFavoriteProperties([]);
    }
}

// Function to render favorites on the page
function renderFavorites() {
    const container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Clear the container

    if (favorites.length === 0) {
        container.innerHTML = '<p>No favorite properties yet.</p>';
        return;
    }

    favorites.forEach(property => {
        const propertyDiv = document.createElement('div');
        propertyDiv.className = 'favorite-property';

        propertyDiv.innerHTML = `
            <h3>${property.title}</h3>
            <p><strong>Description:</strong> ${property.description}</p>
            <p><strong>Price per night:</strong> $${property.price}</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Rooms:</strong> ${property.rooms}, <strong>Bathrooms:</strong> ${property.bathrooms}</p>
            <button onclick="removeFromFavorites('${property.title}')">Remove</button>
        `;

        container.appendChild(propertyDiv);
    });
}

// Function to remove a property from favorites
function removeFromFavorites(title) {
    const updatedFavorites = favorites.filter(property => property.title !== title);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    location.reload(); // Reload the page to refresh the favorites
}

// Render favorites on page load
document.addEventListener('DOMContentLoaded', renderFavorites);




// Load favorites on page load
document.addEventListener("DOMContentLoaded", fetchAndRenderFavoriteProperties);

