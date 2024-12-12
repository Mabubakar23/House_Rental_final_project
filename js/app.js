//app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { 
    getAuth, 
    setPersistence, 
    browserLocalPersistence, 
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
    getDoc, // Importing getDoc to resolve the error
    deleteDoc, 
    getDocs, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA2LC916BFUO-LHC25Gek0y595GxFQA0ds",
    authDomain: "house-rentals-12c7d.firebaseapp.com",
    projectId: "house-rentals-12c7d",
    storageBucket: "house-rentals-12c7d.appspot.com",
    messagingSenderId: "38104073059",
    appId: "1:38104073059:web:19f5fe83b6601f29474956",
    measurementId: "G-54J13NNWH7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

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
export async function addPropertyListing(title, description, price, location, rooms, bathrooms, imageURLs) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user is logged in.");

    await addDoc(collection(db, "properties"), {
        title,
        description,
        price,
        location,
        rooms,
        bathrooms,
        hostId: user.uid,
        timestamp: new Date(),
        images: imageURLs || [] // store image URLs in Firestore
    });
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

// Fetch Public Properties
export async function fetchProperties() {
    const querySnapshot = await getDocs(
        query(collection(db, "properties"))
    );
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

// Function to handle UI updates based on user authentication status
export function checkAuthStatus() {
    onAuthStateChanged(auth, async (user) => {
        const loginLink = document.querySelector('a[href="signin.html"]');
        const signupLink = document.querySelector('a[href="signup.html"]');
        const logoutLink = document.getElementById('logout');
        const rentalPortalLink = document.querySelector('a[href="user-portal.html"]');
        const ownerPortalLink = document.querySelector('a[href="host-properties.html"]');
        const nav = document.querySelector('nav ul');

        // Remove any existing user email or profile picture to avoid duplicates
        const existingUserEmail = document.getElementById('user-email');
        const existingUserProfile = document.getElementById('user-profile-pic');
        if (existingUserEmail) existingUserEmail.remove();
        if (existingUserProfile) existingUserProfile.remove();

        if (user) {
            // User is logged in
            if (loginLink) loginLink.style.display = "none";
            if (signupLink) signupLink.style.display = "none";
            if (logoutLink) logoutLink.style.display = "inline";
            
            // Fetch user role from Firestore
            try {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();

                    if (userData.role === "user") {
                        if (rentalPortalLink) rentalPortalLink.style.display = "inline";
                        if (ownerPortalLink) ownerPortalLink.style.display = "none";
                    } else if (userData.role === "owner") {
                        if (rentalPortalLink) rentalPortalLink.style.display = "none";
                        if (ownerPortalLink) ownerPortalLink.style.display = "inline";
                    }
                }
            } catch (error) {
                console.error("Error fetching user role:", error);
            }

            // Display user's email as the account ID
            const userEmail = document.createElement("li");
            userEmail.textContent = ` | ${user.email} | `;
            userEmail.id = 'user-email';
            userEmail.style.marginLeft = "auto";
            nav.appendChild(userEmail);

            // Display user's profile picture or default profile picture
            const profilePic = document.createElement("li");
            profilePic.id = 'user-profile-pic';
            profilePic.style.marginLeft = "10px";
            profilePic.style.marginTop = "2px";

            const img = document.createElement("img");
            img.src = user.photoURL || '/images/profile-default.svg';
            img.alt = "User Profile";
            img.style.width = "25px";
            img.style.height = "25px";
            img.style.borderRadius = "50%";
            img.style.cursor = "pointer";
            img.style.verticalAlign = "middle";
            
            profilePic.appendChild(img);
            nav.appendChild(profilePic);
        } else {
            // User is not logged in
            if (loginLink) loginLink.style.display = "inline";
            if (signupLink) signupLink.style.display = "inline";
            if (logoutLink) logoutLink.style.display = "none";

            // Disable both portals
            if (rentalPortalLink) rentalPortalLink.style.display = "none";
            if (ownerPortalLink) ownerPortalLink.style.display = "none";
        }
    });
}
