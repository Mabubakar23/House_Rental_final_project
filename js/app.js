import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
    getAuth,
    setPersistence,
    browserLocalPersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    updateDoc,
    getDocs,
    query,
    where,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration
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

// Set Persistence
setPersistence(auth, browserLocalPersistence).catch((error) =>
    console.error("Error setting persistence:", error.message)
);

// User Authentication Functions
export async function signUp(email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role in Firestore
        await setDoc(doc(db, "users", user.uid), { email, role });
        alert("Account created successfully!");
        window.location.href = "../html/signin.html";
    } catch (error) {
        alert("Sign-up error: " + error.message);
    }
}

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role === "owner") {
                window.location.href = "../html/host-properties.html";
            } else if (userData.role === "user") {
                window.location.href = "../html/user-portal.html";
            }
        } else {
            throw new Error("User data not found in the database.");
        }
    } catch (error) {
        alert("Sign-in error: " + error.message);
    }
}

export function logOut() {
    signOut(auth)
        .then(() => {
            window.location.href = "../index.html";
        })
        .catch((error) => alert(error.message));
}

// Firestore Functions
async function createChatChannel(propertyTitle) {
    const apiUrl = `https://www3.cbox.ws/apis/threads.php?id=3-3542476-e7grMY&key=7cdc0daf6d524bd409cd70d7bdba3979&act=mkthread&name=${encodeURIComponent(
        propertyTitle
    )}`;

    const response = await fetch(apiUrl);
    const result = await response.text();
    const [status, threadId, threadKey] = result.split("\t");

    if (status !== "OK") {
        throw new Error("Failed to create chat channel: " + result);
    }

    return { threadId, threadKey };
}

export async function addPropertyListing(title, description, price, location, rooms, bathrooms) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in.");

    // Create chat channel
    const chatDetails = await createChatChannel(title);

    await addDoc(collection(db, "properties"), {
        title,
        description,
        price,
        location,
        rooms,
        bathrooms,
        hostId: user.uid,
        chatChannelId: chatDetails.threadId,
        chatChannelKey: chatDetails.threadKey,
        timestamp: new Date(),
    });
    alert("Property added successfully!");
}

export async function fetchProperties() {
    const querySnapshot = await getDocs(query(collection(db, "properties")));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Render Properties and Chat
async function renderProperties() {
    const properties = await fetchProperties();
    const propertiesContainer = document.getElementById("properties-container");
    propertiesContainer.innerHTML = ""; // Clear container

    properties.forEach((property) => {
        const propertyCard = document.createElement("div");
        propertyCard.className = "property-card";

        propertyCard.innerHTML = `
            <h3>${property.title}</h3>
            <p>${property.description}</p>
            <p><strong>Price:</strong> $${property.price} per night</p>
            <p><strong>Location:</strong> ${property.location}</p>
            <p><strong>Rooms:</strong> ${property.rooms}</p>
            <p><strong>Bathrooms:</strong> ${property.bathrooms}</p>
            <button class="btn-chat" data-id="${property.chatChannelId}" data-key="${property.chatChannelKey}">
                Start Negotiation
            </button>
        `;

        propertiesContainer.appendChild(propertyCard);
    });

    document.querySelectorAll(".btn-chat").forEach((button) =>
        button.addEventListener("click", (e) => {
            const chatChannelId = e.target.dataset.id;
            const chatChannelKey = e.target.dataset.key;

            if (!chatChannelId || !chatChannelKey) {
                alert("Chat channel is not available for this property.");
                return;
            }

            const chatUrl = `https://www3.cbox.ws/box/?boxid=3542476&boxtag=e7grMY&sec=main&tid=${chatChannelId}&tkey=${chatChannelKey}`;
            window.open(chatUrl, "_blank", "width=500,height=600,scrollbars=yes,resizable=yes");
        })
    );
}

// Initialize Page
document.addEventListener("DOMContentLoaded", async () => {
    await renderProperties();

    document.getElementById("logout").addEventListener("click", logOut);
});
