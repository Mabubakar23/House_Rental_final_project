// Import Firebase Authentication
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Initialize Firebase Auth
const auth = getAuth();

// Handle Form Submission
document.getElementById('signin-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Redirect to the user portal or dashboard
        window.location.href = "user-portal.html";
    } catch (error) {
        console.error("Error signing in:", error.message);
        ("Failed to sign in. Please check your email and password.");
    }
});
