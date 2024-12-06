//app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    setPersistence, 
    browserLocalPersistence, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    setDoc, 
    doc, 
    getDoc, // Importing getDoc to resolve the error
    deleteDoc, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2LC916BFUO-LHC25Gek0y595GxFQA0ds",
    authDomain: "house-rentals-12c7d.firebaseapp.com",
    projectId: "house-rentals-12c7d",
    storageBucket: "house-rentals-12c7d.firebasestorage.app",
    messagingSenderId: "38104073059",
    appId: "1:38104073059:web:19f5fe83b6601f29474956",
    measurementId: "G-54J13NNWH7"
    
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

// Set Persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error.message);
});

/* =======================
   Authentication Functions
   ======================= */

// Sign-Up Function
export async function signUp(email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role in Firestore
        await setDoc(doc(db, "users", user.uid), { email, role });
        alert('Account created successfully!');
        window.location.href = '../html/signin.html'; // Redirect to sign-in page
    } catch (error) {
        alert('Sign-up error: ' + error.message);
    }
}

// Sign-In Function
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch user role from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid)); // Corrected getDoc usage
        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.role === "owner") {
                window.location.href = '../html/host-properties.html';
            } else if (userData.role === "user") {
                window.location.href = '../html/user-portal.html';
            }
        } else {
            throw new Error("User data not found in the database.");
        }
    } catch (error) {
        alert('Sign-in error: ' + error.message);
    }
}

// Log-Out Function
export function logOut() {
    signOut(auth)
        .then(() => {
            window.location.href = "../index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
}

/* =======================
   Firestore Functions
   ======================= */

// Add Property
export async function addPropertyListing(title, description, price, location, rooms, bathrooms) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in.");

    // Create chat channel
   // const chatDetails = await createChatChannel(title);

    await addDoc(collection(db, "properties"), {
        title,
        description,
        price,
        location,
        rooms,
        bathrooms,
        hostId: user.uid,
       // chatChannelId: chatDetails.threadId,
        // chatChannelKey: chatDetails.threadKey,
        timestamp: new Date(),
    });
    alert("Property added successfully!");
}

// Fetch Public Properties
export async function fetchProperties() {
    const querySnapshot = await getDocs(
        query(collection(db, "properties"))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch Properties for Host
export async function fetchHostProperties() {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in.");

    const querySnapshot = await getDocs(
        query(collection(db, "properties"), where("hostId", "==", user.uid))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete Property
export async function deleteProperty(propertyId) {
    await deleteDoc(doc(db, "properties", propertyId));
}


// Add Support Message
export async function addSupportMessage(name, email, subject, message) {
    try {
        await addDoc(collection(db, "supportMessages"), {
            name,
            email,
            subject,
            message,
            timestamp: new Date()
        });
        alert('Support message sent successfully!');
    } catch (error) {
        throw new Error("Error saving support message: " + error.message);
    }
}


// Initialize Page
document.addEventListener("DOMContentLoaded", async () => {
    await renderProperties();

    document.getElementById("logout").addEventListener("click", logOut);
});
