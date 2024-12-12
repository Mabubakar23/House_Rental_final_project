import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, addDoc, getDoc, setDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import {app, checkAuthStatus, logOut} from '/js/app.js';

import { 
    setPersistence, 
    browserLocalPersistence, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { 
    collection, 
    query, 
    where 
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize Firebase
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Set Persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error.message);
});

// DOM Elements
const profileImg = document.getElementById('profile-img');
const profilePictureInput = document.getElementById('profile-picture-input');
const uploadPictureBtn = document.getElementById('upload-picture-btn');
const profileForm = document.getElementById('profile-form');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const bioInput = document.getElementById('bio');

// Load user profile on page load
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                nameInput.value = userData.name || '';
                emailInput.value = user.email;
                phoneInput.value = userData.phone || '';
                bioInput.value = userData.bio || '';
                if (userData.profilePicture) {
                    profileImg.src = userData.profilePicture;
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        alert('No user is signed in.');
        window.location.href = 'signin.html';
    }
});

// Upload profile picture
uploadPictureBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const file = profilePictureInput.files[0];
    if (file) {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert('No user is signed in.');
                return;
            }

            const fileRef = ref(storage, `/profile_pictures/${user.uid}-${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            await updateProfile(user, { photoURL: downloadURL });
            await setDoc(doc(db, "users", user.uid), { profilePicture: downloadURL }, { merge: true });

            profileImg.src = downloadURL;
            alert('Profile picture updated successfully.');
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert('Error uploading profile picture. Please try again.');
        }
    } else {
        alert('Please select a picture to upload.');
    }
});

// Save profile changes and reload the page
profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const user = auth.currentUser;
        if (!user) {
            alert('No user is signed in.');
            return;
        }

        const name = nameInput.value.trim();
        const phone = phoneInput.value.trim();
        const bio = bioInput.value.trim();

        await setDoc(doc(db, "users", user.uid), {
            name,
            phone,
            bio,
        }, { merge: true });

        alert('Profile updated successfully.');
        window.location.reload();
    } catch (error) {
        console.error("Error saving profile:", error);
        alert('Error saving profile information. Please try again.');
    }
});
