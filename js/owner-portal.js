//owner-portal.js
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { app, checkAuthStatus, addPropertyListing, logOut } from '../js/app.js'; // Ensure app is exported from app.js

const storage = getStorage(app);

async function uploadPropertyImages(files) {
    const imageURLs = [];

    // If no files are provided, simply return an empty array.
    if (!files || files.length === 0) {
        console.warn("No files to upload.");
        return imageURLs;
    }

    for (const file of files) {
        try {
            // Replace spaces in the filename to avoid encoding issues
            const safeFileName = file.name.replace(/\s+/g, '_');
            const imageRef = ref(storage, `property-images/${Date.now()}-${safeFileName}`);

            console.log(`Uploading file: ${file.name} to ${imageRef.fullPath}...`);
            await uploadBytes(imageRef, file);
            console.log(`File uploaded successfully: ${file.name}`);

            // Retrieve the download URL from Firebase Storage
            const downloadURL = await getDownloadURL(imageRef);
            console.log(`Download URL for ${file.name}: ${downloadURL}`);

            imageURLs.push(downloadURL);
        } catch (error) {
            // Handle any errors that occur during upload or URL retrieval
            console.error(`Error uploading ${file.name}: ${error.message}`);
            // You can decide whether to continue uploading remaining files or break
            // For now, just continue to the next file
        }
    }

    return imageURLs;
}

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

    // Add listener for default form
    const defaultForm = document.querySelector('.property-form');
    addRemoveListener(defaultForm);

    // Submit all property forms
    submitPropertiesButton.addEventListener('click', async () => {
        const forms = document.querySelectorAll('.property-form');
        const propertyData = [];

        forms.forEach((form) => {
            const title = form.querySelector('input[name="title"]').value;
            const description = form.querySelector('textarea[name="description"]').value;
            const price = parseFloat(form.querySelector('input[name="price"]').value);
            const location = form.querySelector('input[name="location"]').value;
            const rooms = parseInt(form.querySelector('input[name="rooms"]').value, 10);
            const bathrooms = parseInt(form.querySelector('input[name="bathrooms"]').value, 10);
            // Get image files
            const imageInput = form.querySelector('input[name="images"]');
            const imageFiles = imageInput ? imageInput.files : [];


            propertyData.push({ title, description, price, location, rooms, bathrooms, imageFiles });
        });

        try {
            // Submit properties in batch
            for (const property of propertyData) {
                const imageURLs = await uploadPropertyImages(property.imageFiles);

                await addPropertyListing(
                    property.title, 
                    property.description, 
                    property.price, 
                    property.location, 
                    property.rooms, 
                    property.bathrooms,
                    imageURLs
                );
            }
            alert('All properties listed successfully!');
            propertyFormsContainer.innerHTML = ''; // Clear forms
            // addPropertyFormButton.click(); // Add one default form back
            window.location.href = 'host-properties.html';
        } catch (error) {
            alert('Error submitting properties: ' + error.message);
        }
    });

    // Log out functionality
    document.getElementById('logout').addEventListener('click', () => {
        logOut();
    });
});
