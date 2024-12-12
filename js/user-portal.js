import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    query,
    getDocs,
    updateDoc,
    doc,
    arrayUnion,
    arrayRemove,
    getDoc
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {app, checkAuthStatus, logOut} from '/js/app.js';

const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch all properties
async function fetchProperties() {
    try {
        const q = query(collection(db, "properties"));
        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        return properties;
    } catch (error) {
        console.error("Error fetching properties:", error.message);
        alert("Failed to load properties. Please try again.");
        return [];
    }
}

// Function to render properties in the user dashboard
function renderProperties(properties) {
    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = ""; // Clear the container

    properties.forEach((property, index) => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");

        const isFavorited = property.favorites?.includes(auth.currentUser?.uid);
        const isRented = property.rentedBy;

        // Generate image HTML
        const imageHTML = property.images?.map(imageURL => `<img src="${imageURL}" alt="Property Image" class="property-image">`).join('') || '<p>No images available</p>';

        propertyCard.innerHTML = `
            <h3>${property.title}</h3>
            <p>${property.description}</p>
            <p><strong>Price:</strong> $${property.price} per night</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Rooms:</strong> ${property.rooms}</p>
            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
            ${isRented 
                ? `<p class="rented-status">Already Rented</p>` 
                : `<div>

                    <div class="calendar-container" id="calendar-${index}">
                        <label for="flatpickr-${index}" class="calendar-label">Select Dates:</label>
                        <input type="text" id="flatpickr-${index}" class="flatpickr">
                        <div class="selected-dates">
                            <span><strong>Start:</strong> <span id="start-date-${index}">None</span></span>
                            <span><strong>End:</strong> <span id="end-date-${index}">None</span></span>
                        </div>
                    </div>                  
                    <button class="btn-rent" data-id="${property.id}">Rent Now</button>
                    <button class="btn-favorite" data-id="${property.id}">
                        ${isFavorited ? "★ Favorited" : "♥ Favorite"}
                    </button>
                    <button class="btn-chat" data-title="${property.title}">Start Negotiation</button>
                    </div>`
            }
        `;

        propertiesContainer.appendChild(propertyCard);
        // Initialize Flatpickr
        flatpickr(`#flatpickr-${index}`, {
            mode: "range",
            onChange: function(selectedDates) {
                if (selectedDates.length === 2) {
                    const [startDate, endDate] = selectedDates;
                    document.getElementById(`start-date-${index}`).innerText = startDate.toLocaleDateString();
                    document.getElementById(`end-date-${index}`).innerText = endDate.toLocaleDateString();
                }
            },
        });  
        
    });

    // Add event listeners
    document.querySelectorAll(".btn-rent").forEach((button) => {
        button.addEventListener("click", (e) => {
            const propertyId = e.target.dataset.id;
            const dateInput = document.getElementById(`rent-date-${propertyId}`);
            const selectedDate = dateInput.value;
            rentProperty(propertyId, selectedDate);
        });
    });

    document.querySelectorAll(".btn-favorite").forEach((button) => {
        button.addEventListener("click", (e) => {
            const propertyId = e.target.dataset.id;
            toggleFavorite(propertyId, button);
        });
    });

    document.querySelectorAll(".btn-chat").forEach((button) => {
        button.addEventListener("click", (e) => {
            const propertyTitle = e.target.dataset.title;
            startNegotiationChat(propertyTitle);
        });
    });
}

// Function to handle property renting
async function rentProperty(propertyId, selectedDate) {
    if (!selectedDate) {
        alert("Please select a date to rent the property.");
        return;
    }

    const user = auth.currentUser;

    if (!user) {
        alert("You need to sign in to rent a property.");
        return;
    }

    try {
        const propertyDocRef = doc(db, "properties", propertyId);
        const propertySnap = await getDocs(propertyDocRef);
        const propertyData = propertySnap.data();

        if (propertyData.bookedDates?.includes(selectedDate)) {
            alert("The selected date is already booked. Please choose another date.");
            return;
        }

        // Update Firestore with the booked date
        await updateDoc(propertyDocRef, {
            bookedDates: arrayUnion(selectedDate),
        });

        alert(`Property rented successfully for ${selectedDate}!`);
        fetchAndRenderProperties(); // Re-render properties after renting
    } catch (error) {
        console.error("Error renting property:", error.message);
        alert("Failed to rent the property. Try again later.");
    }
}

// Function to toggle favorite status
async function toggleFavorite(propertyId, button) {
    const user = auth.currentUser;

    if (!user) {
        alert("You need to sign in to favorite a property.");
        return;
    }

    const propertyDocRef = doc(db, "properties", propertyId);
    const isFavorited = button.textContent.includes("★");

    try {
        if (isFavorited) {
            await updateDoc(propertyDocRef, {
                favorites: arrayRemove(user.uid),
            });
            button.textContent = "♥ Favorite";
            alert("Removed from favorites!");
        } else {
            await updateDoc(propertyDocRef, {
                favorites: arrayUnion(user.uid),
            });
            button.textContent = "★ Favorited";
            alert("Added to favorites!");
        }
    } catch (error) {
        console.error("Error toggling favorite:", error.message);
        alert("Failed to update favorite status. Try again later.");
    }
}

// Function to start negotiation chat
function startNegotiationChat(propertyTitle) {
    const chatWindow = window.open(
        "https://www3.cbox.ws/box/?boxid=3542306&boxtag=hsUZEg",
        "_blank",
        "width=500,height=600,scrollbars=yes,resizable=yes"
    );
    chatWindow.document.title = `Negotiation - ${propertyTitle}`;
}

// Function to fetch and render properties on page load
async function fetchAndRenderProperties() {
    const properties = await fetchProperties();
    if (properties) {
        renderProperties(properties);
    }
}

// Add event listener for page load
document.addEventListener("DOMContentLoaded", fetchAndRenderProperties);
