import { addPropertyListing, logOut } from './app.js';

/* =======================
   DOM Event Listeners
   ======================= */
document.addEventListener('DOMContentLoaded', () => {
    const propertyFormsContainer = document.getElementById('property-forms-container');
    const addPropertyFormButton = document.getElementById('add-property-form');
    const submitPropertiesButton = document.getElementById('submit-properties');

    // Function to add a new property form
    addPropertyFormButton.addEventListener('click', () => {
        const newForm = document.createElement('form');
        newForm.classList.add('property-form');
        newForm.innerHTML = `
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" name="title" placeholder="Property title" required>
            </div>
            <div class="form-group">
                <label for="description">Description</label>
                <textarea name="description" placeholder="Property description" required></textarea>
            </div>
            <div class="form-group">
                <label for="price">Price per night</label>
                <input type="number" name="price" placeholder="Price" required>
            </div>
            <div class="form-group">
                <label for="location">Location</label>
                <input type="text" name="location" placeholder="Location" required>
            </div>
            <div class="form-group">
                <label for="rooms">Number of Rooms</label>
                <input type="number" name="rooms" placeholder="Rooms" required>
            </div>
            <div class="form-group">
                <label for="bathrooms">Number of Bathrooms</label>
                <input type="number" name="bathrooms" placeholder="Bathrooms" required>
            </div>
            <button type="button" class="btn-remove">Remove</button>
        `;
        propertyFormsContainer.appendChild(newForm);
        addRemoveListener(newForm);
    });

    // Function to handle form removal
    function addRemoveListener(form) {
        const removeButton = form.querySelector('.btn-remove');
        removeButton.addEventListener('click', () => {
            form.remove();
        });
    }

    // Add listener for the default form
    const defaultForm = document.querySelector('.property-form');
    addRemoveListener(defaultForm);

    // Submit all property forms
    submitPropertiesButton.addEventListener('click', async () => {
        const forms = document.querySelectorAll('.property-form');
        const propertyData = [];

        // Collect data from each form
        forms.forEach((form) => {
            const title = form.querySelector('input[name="title"]').value;
            const description = form.querySelector('textarea[name="description"]').value;
            const price = parseFloat(form.querySelector('input[name="price"]').value);
            const location = form.querySelector('input[name="location"]').value;
            const rooms = parseInt(form.querySelector('input[name="rooms"]').value, 10);
            const bathrooms = parseInt(form.querySelector('input[name="bathrooms"]').value, 10);

            propertyData.push({ title, description, price, location, rooms, bathrooms });
        });

        try {
            // Submit each property to Firestore
            for (const property of propertyData) {
                await addPropertyListing(
                    property.title,
                    property.description,
                    property.price,
                    property.location,
                    property.rooms,
                    property.bathrooms
                );
            }
            alert('All properties listed successfully!');
            propertyFormsContainer.innerHTML = ''; // Clear all forms
            addPropertyFormButton.click(); // Add one default form back
        } catch (error) {
            alert('Error submitting properties: ' + error.message);
        }
    });

    // Log out functionality
    document.getElementById('logout').addEventListener('click', () => {
        logOut();
    });
});
