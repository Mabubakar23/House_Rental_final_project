// Import Firebase SDK (only needed if using ES6 modules, otherwise include in HTML directly)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; // Added getDocs

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Sign-Up Function (with Role)
export function signUp(email, password, role) {
    return createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Save user role in Firestore
            await setDoc(doc(db, "users", user.uid), {
                email: email,
                role: role
            });

            alert('Account created successfully');
            window.location.href = 'signin.html'; // Redirect to sign-in page
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
}

// Sign-In Function (with Role Check and Redirection)
export function signIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // Fetch user role from Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.role === "host") {
                    window.location.href = 'host-dashboard.html'; // Redirect to host dashboard
                } else {
                    window.location.href = 'user-dashboard.html'; // Redirect to user dashboard
                }
            } else {
                console.error("No user role found!");
            }
        })
        .catch((error) => {
            alert('Error: ' + error.message);
        });
}

// Function to add a property listing (for hosts)
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
    } catch (error) {
        throw new Error("Failed to add property listing: " + error.message);
    }
}

// Function to retrieve property listings (for users)
export async function fetchProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"));
    const properties = [];
    querySnapshot.forEach((doc) => {
        properties.push({ id: doc.id, ...doc.data() });
    });
    return properties;
}
