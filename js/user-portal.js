//User-portal.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
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

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJGhK05gIL-hnl_HJubmj16dIuiP0q4JU",
    authDomain: "residential-rental-hospitality.firebaseapp.com",
    projectId: "residential-rental-hospitality",
    storageBucket: "residential-rental-hospitality.firebasestorage.app",
    messagingSenderId: "716299420732",
    appId: "1:716299420732:web:2fb4e70235178bb0922f39",
    measurementId: "G-GGC25RS2EY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch all properties
async function fetchProperties() {
    try {
        const q = query(collection(db, "properties"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

    properties.forEach(property => {
        const propertyCard = document.createElement("div");
        propertyCard.classList.add("property-card");

        const isFavorited = property.favorites?.includes(auth.currentUser?.uid);
        const isRented = property.rentedBy;

        // Generate image HTML
        const imageHTML = property.images?.map(imageURL => `<img src="${imageURL}" alt="Property Image" class="property-image">`).join('') || '<p>No images available</p>';

        propertyCard.innerHTML = `
            <div class="property-images">${imageHTML}</div>
            <h3>${property.title}</h3>
            <p>${property.description}</p>
            <p><strong>Price:</strong> $${property.price} per night</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Rooms:</strong> ${property.rooms}</p>
            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
            ${isRented 
                ? `<p class="rented-status">Already Rented</p>` 
                : `<div>
                    <label for="rent-date-${property.id}">Select a Date:</label>
                    <input type="date" id="rent-date-${property.id}" class="rent-date" />
                    <button class="btn-rent" data-id="${property.id}">Rent Now</button>
                </div>`
            }
            <button class="btn-favorite" data-id="${property.id}">
                ${isFavorited ? "★ Favorited" : "♥ Favorite"}
            </button>
            <button class="btn-chat" data-title="${property.title}">Start Negotiation</button>
        `;

        propertiesContainer.appendChild(propertyCard);
    });

    addEventListeners();
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
        const propertySnap = await getDoc(propertyDocRef);

        if (!propertySnap.exists()) {
            alert("Property not found.");
            return;
        }

        const propertyData = propertySnap.data();
        if (propertyData.bookedDates?.includes(selectedDate)) {
            alert("The selected date is already booked. Please choose another date.");
            return;
        }

        await updateDoc(propertyDocRef, { bookedDates: arrayUnion(selectedDate) });
        alert(`Property rented successfully for ${selectedDate}!`);
        fetchAndRenderProperties();
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
            await updateDoc(propertyDocRef, { favorites: arrayRemove(user.uid) });
            button.textContent = "♥ Favorite";
            alert("Removed from favorites!");
        } else {
            await updateDoc(propertyDocRef, { favorites: arrayUnion(user.uid) });
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

// Add event listeners to property cards
function addEventListeners() {
    document.querySelectorAll(".btn-rent").forEach(button => {
        button.addEventListener("click", e => {
            const propertyId = e.target.dataset.id;
            const dateInput = document.getElementById(`rent-date-${propertyId}`);
            const selectedDate = dateInput.value;
            rentProperty(propertyId, selectedDate);
        });
    });

    document.querySelectorAll(".btn-favorite").forEach(button => {
        button.addEventListener("click", e => {
            const propertyId = e.target.dataset.id;
            toggleFavorite(propertyId, button);
        });
    });

    document.querySelectorAll(".btn-chat").forEach(button => {
        button.addEventListener("click", e => {
            const propertyTitle = e.target.dataset.title;
            startNegotiationChat(propertyTitle);
        });
    });
}

// Function to fetch and render properties on page load
async function fetchAndRenderProperties() {
    const properties = await fetchProperties();
    renderProperties(properties);
}

// Add event listener for page load
document.addEventListener("DOMContentLoaded", fetchAndRenderProperties);
