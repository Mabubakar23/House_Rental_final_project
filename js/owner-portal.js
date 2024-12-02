import { addPropertyListing, uploadHousePictures } from '/js/app.js';

document.addEventListener('DOMContentLoaded', () => {
    const propertyForm = document.getElementById('property-form');
    const housePicturesInput = document.getElementById('house-pictures');
    const submittedPropertySection = document.getElementById('submitted-property');
    const propertyTitle = document.getElementById('property-title');
    const propertyDescription = document.getElementById('property-description');
    const propertyPrice = document.getElementById('property-price');
    const propertyLocation = document.getElementById('property-location');
    const propertyRooms = document.getElementById('property-rooms');
    const propertyBathrooms = document.getElementById('property-bathrooms');
    const propertyPictures = document.getElementById('property-pictures');

    if (propertyForm) {
        propertyForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = parseFloat(document.getElementById('price').value);
            const location = document.getElementById('location').value;
            const rooms = parseInt(document.getElementById('rooms').value, 10);
            const bathrooms = parseInt(document.getElementById('bathrooms').value, 10);

            const files = housePicturesInput.files;
            let pictureLinks = [];
            if (files.length > 0) {
                try {
                    pictureLinks = await uploadHousePictures(files);
                } catch (error) {
                    alert('Error uploading pictures: ' + error.message);
                    return;
                }
            }

            try {
                await addPropertyListing(title, description, price, location, rooms, bathrooms, pictureLinks);

                // Display submitted property details
                propertyTitle.textContent = title;
                propertyDescription.textContent = description;
                propertyPrice.textContent = price;
                propertyLocation.textContent = location;
                propertyRooms.textContent = rooms;
                propertyBathrooms.textContent = bathrooms;

                // Display uploaded pictures
                propertyPictures.innerHTML = '';
                pictureLinks.forEach((link) => {
                    const img = document.createElement('img');
                    img.src = link;
                    img.alt = 'Uploaded Picture';
                    img.style.width = '150px';
                    img.style.margin = '5px';
                    propertyPictures.appendChild(img);
                });

                submittedPropertySection.style.display = 'block';
                propertyForm.reset();
                alert('Property listed successfully');
            } catch (error) {
                alert('Error adding property: ' + error.message);
            }
        });
    }
});