// Import required functions from app.js
import { addSupportMessage } from "./app.js";

// Select the support form element
const supportForm = document.getElementById('support-form');

// Add event listener to handle form submission
supportForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Collect form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Validate input fields
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        // Call addSupportMessage to send data to Firebase
        await addSupportMessage(name, email, subject, message);

        // Display success message and reset form
        alert('Your message has been sent successfully!');
        supportForm.reset();
    } catch (error) {
        // Log and display error message
        console.error('Error sending message:', error.message);
        alert('Failed to send your message. Please try again later.');
    }
});
