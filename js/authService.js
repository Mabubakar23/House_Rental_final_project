//authService.js
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { firebaseConfig } from './app.js';

const auth = getAuth();
const db = getFirestore();

export async function signUp(email, password, role) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save role to Firestore
        await setDoc(doc(db, "users", user.uid), { role });
        alert("Account created successfully!");
        window.location.href = "signin.html";
    } catch (error) {
        alert("Error during sign up: " + error.message);
    }
}

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user role from Firestore
        const docSnap = await getDoc(doc(db, "users", user.uid));
        if (docSnap.exists()) {
            const role = docSnap.data().role;
            window.location.href = role === "owner" ? "owner-portal.html" : "user-portal.html";
        } else {
            throw new Error("No role assigned to this account.");
        }
    } catch (error) {
        alert("Error during sign in: " + error.message);
    }
}

export async function logout() {
    try {
        await signOut(auth);
        alert("Logged out successfully!");
        window.location.href = "index.html";
    } catch (error) {
        alert("Error during logout: " + error.message);
    }
}