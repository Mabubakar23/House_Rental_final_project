// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    setDoc, 
    doc, 
    getDoc, 
    getDocs 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Firebase configuration
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
const auth = getAuth(app);
const db = getFirestore(app);

/* =======================
   Authentication Functions
   ======================= */

// Sign-Up Function
export async function signUp(email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user role in Firestore
        await setDoc(doc(db, "users", user.uid), {
            email: email,
            role: role
        });

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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Redirect based on role
            if (userData.role === "owner") {
                window.location.href = '../html/owner-portal.html';
            } else if (userData.role === "user") {
                window.location.href = '../html/user-portal.html';
            } else {
                alert("Unknown role. Please contact support.");
            }
        } else {
            alert("No user data found. Please contact support.");
        }
    } catch (error) {
        alert('Sign-in error: ' + error.message);
    }
}

// Log-Out Function
export function logOut() {
    signOut(auth)
        .then(() => {
            alert("Logged out successfully!");
            window.location.href = "../index.html"; // Redirect to home page
        })
        .catch((error) => {
            alert("Error logging out: " + error.message);
        });
}

/* =======================
   Firestore Functions
   ======================= */

// Add Property Listing (For Owners)
export async function addPropertyListing(title, description, price, location, rooms, bathrooms) {
    try {
        await addDoc(collection(db, "properties"), {
            title,
            description,
            price,
            location,
            rooms,
            bathrooms,
            timestamp: new Date()
        });

        alert("Property listing added successfully!");
    } catch (error) {
        alert("Error adding property listing: " + error.message);
    }
}

// Fetch Property Listings (For Users)
export async function fetchProperties() {
    try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const properties = [];
        querySnapshot.forEach((doc) => {
            properties.push({ id: doc.id, ...doc.data() });
        });
        return properties;
    } catch (error) {
        alert("Error fetching properties: " + error.message);
        return [];
    }
}

// Add Support Message
export async function addSupportMessage(name, email, subject, message) {
    try {
        await addDoc(collection(db, "support"), {
            name,
            email,
            subject,
            message,
            timestamp: new Date()
        });

        alert("Support message sent successfully!");
    } catch (error) {
        alert("Error sending support message: " + error.message);
    }
}

/* =======================
   Auth State Listener
   ======================= */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in: ", user.email);
    } else {
        console.log("No user is signed in.");
    }
});