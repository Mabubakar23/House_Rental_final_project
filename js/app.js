// Import Firebase SDK (only needed if using ES6 modules, otherwise include in HTML directly)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js"; // Added getDocs
import { getStorage, ref, uploadBytes, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js';

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


// Upload multiple house pictures
export async function uploadHousePictures(files) {
    try {
        const storage = getStorage(); // Initialize Firebase Storage
        const folderPath = 'house_picture/';
        let uploadPromises = [];

        for (let file of files) {
            // Generate a unique file name using timestamp
            const uniqueFileName = `${Date.now()}-${file.name}`;
            const fileRef = ref(storage, `${folderPath}${uniqueFileName}`);

            // Upload the file and get the download URL
            const uploadTask = uploadBytes(fileRef, file).then(async (snapshot) => {
                const downloadURL = await getDownloadURL(snapshot.ref);
                console.log(`Uploaded file: ${file.name}, URL: ${downloadURL}`);
                return downloadURL;
            });

            uploadPromises.push(uploadTask);
        }

        // Wait for all uploads to complete
        return await Promise.all(uploadPromises);
    } catch (error) {
        console.error("Error uploading house pictures:", error);
        throw new Error("Failed to upload house pictures. Please try again.");
    }
}


// Function to add a property listing (for hosts), including picture links
export async function addPropertyListing(title, description, price, location, rooms, bathrooms, pictureLinks = []) {
    try {
        const db = getFirestore();
        const propertyData = {
            title,
            description,
            price,
            location,
            rooms,
            bathrooms,
            pictures: pictureLinks, // Save picture links in Firestore
            createdAt: new Date(),
        };

        const docRef = await addDoc(collection(db, 'properties'), propertyData);
        console.log(`Property added with ID: ${docRef.id}`);
        return docRef.id;
    } catch (error) {
        console.error("Error adding property listing:", error);
        throw new Error("Failed to add property listing. Please try again.");
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
