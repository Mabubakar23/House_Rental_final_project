import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

// Firebase Configuration (ensure this matches your setup)
const firebaseConfig = {
    apiKey: "AIzaSyA2LC916BFUO-LHC25Gek0y595GxFQA0ds",
    authDomain: "house-rentals-12c7d.firebaseapp.com",
    projectId: "house-rentals-12c7d",
    storageBucket: "house-rentals-12c7d.appspot.com",
    messagingSenderId: "38104073059",
    appId: "1:38104073059:web:19f5fe83b6601f29474956",
    measurementId: "G-54J13NNWH7",
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Function to fetch chat details for each property (Dynamic Channel)
async function fetchChatDetails(propertyId) {
    try {
        const propertyDocRef = doc(db, "properties", propertyId);
        const propertyDoc = await getDoc(propertyDocRef);

        if (propertyDoc.exists()) {
            const propertyData = propertyDoc.data();
            return {
                chatChannelId: propertyData.chatChannelId || null,
                chatChannelKey: propertyData.chatChannelKey || null,
            };
        } else {
            console.error("Property not found in Firestore.");
            return { chatChannelId: null, chatChannelKey: null };
        }
    } catch (error) {
        console.error("Error fetching chat details:", error.message);
        return { chatChannelId: null, chatChannelKey: null };
    }
}

// Function to open dynamic Firebase chat window
function openChatWindow(chatChannelId, chatChannelKey) {
    if (chatChannelId && chatChannelKey) {
        const chatUrl = `https://www.cbox.ws/box/?boxid=3542476&boxtag=e7grMY&tid=${chatChannelId}&tkey=${chatChannelKey}`;
        window.open(chatUrl, "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
    } else {
        openStaticCBoxChat(); // Fallback to static chat if no dynamic channel exists
    }
}

// Function to open static CBox chat window
function openStaticCBoxChat() {
    const chatUrl = "https://www.cbox.ws/box/?boxid=3542476&boxtag=e7grMY"; // Static URL
    window.open(chatUrl, "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
}

// Function to render properties with chat buttons
async function renderPropertiesWithChat() {
    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = ""; // Clear the container

    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        querySnapshot.forEach(async (doc) => {
            const property = doc.data();
            const propertyId = doc.id;

            // Fetch chat details for the property
            const { chatChannelId, chatChannelKey } = await fetchChatDetails(propertyId);

            const propertyCard = document.createElement("div");
            propertyCard.classList.add("property-card");

            propertyCard.innerHTML = `
                <h3>${property.title}</h3>
                <p>${property.description}</p>
                <p><strong>Price:</strong> $${property.price} per night</p>
                <p><strong>Location:</strong> ${property.location}</p>
                <p><strong>Rooms:</strong> ${property.rooms}</p>
                <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
                <div class="chat-button-container">
                    ${chatChannelId && chatChannelKey
                        ? `<button class="btn-chat" data-id="${chatChannelId}" data-key="${chatChannelKey}">
                            Start Live Communication (Dynamic Chat)
                        </button>`
                        : `<button class="btn-chat-cbox" data-title="${property.title}">
                            Start Live Communication (Static Chat)
                        </button>`
                    }
                </div>
            `;

            propertiesContainer.appendChild(propertyCard);
        });

        // Add event listeners for chat buttons
        document.querySelectorAll(".btn-chat").forEach((button) => {
            button.addEventListener("click", (e) => {
                const chatChannelId = e.target.dataset.id;
                const chatChannelKey = e.target.dataset.key;
                openChatWindow(chatChannelId, chatChannelKey);
            });
        });

        document.querySelectorAll(".btn-chat-cbox").forEach((button) => {
            button.addEventListener("click", (e) => {
                openStaticCBoxChat(); // Fallback for static chat
            });
        });
    } catch (error) {
        console.error("Error loading properties:", error.message);
        alert("Failed to load properties. Please try again.");
    }
}

// Initialize page when loaded
document.addEventListener("DOMContentLoaded", async () => {
    await renderPropertiesWithChat();
});


// Function to open Firebase dynamic chat window
function openChatWindow(chatChannelId, chatChannelKey) {
    const chatUrl = `https://www3.cbox.ws/box/?boxid=3542476&boxtag=e7grMY&tid=${chatChannelId}&tkey=${chatChannelKey}`;
    window.open(chatUrl, "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
}

// Function to open CBox static chat window
function openCBoxChat(propertyTitle) {
    const chatUrl = `https://www3.cbox.ws/box/?boxid=3542476&boxtag=e7grMY`;
    window.open(chatUrl, "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
}