import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    startAfter
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

/* =======================
   Firestore Functions
   ======================= */

// Add Property Listing
export async function addPropertyListing(title, description, price, location, rooms, bathrooms) {
    try {
        const timestamp = new Date();
        const property = { title, description, price, location, rooms, bathrooms, timestamp };
        await addDoc(collection(db, "properties"), property);
        alert("Property added successfully!");
    } catch (error) {
        console.error("Error adding property:", error.message);
        alert("Failed to add property. Please try again.");
        throw error;
    }
}

// Fetch All Properties with Optional Filters
export async function fetchProperties(filters = {}, pageSize = 10, lastDoc = null) {
    try {
        let q = query(collection(db, "properties"), orderBy("timestamp"), limit(pageSize));

        // Apply filters
        if (filters.location) {
            q = query(q, where("location", "==", filters.location));
        }
        if (filters.minPrice && filters.maxPrice) {
            q = query(q, where("price", ">=", filters.minPrice), where("price", "<=", filters.maxPrice));
        }
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        return { properties, lastVisible };
    } catch (error) {
        console.error("Error fetching properties:", error.message);
        alert("Failed to load properties. Please try again.");
        throw error;
    }
}

// Fetch Properties Owned by a Specific Host
export async function fetchHostProperties(hostId, pageSize = 10, lastDoc = null) {
    try {
        let q = query(
            collection(db, "properties"),
            where("hostId", "==", hostId),
            orderBy("timestamp"),
            limit(pageSize)
        );

        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        return { properties, lastVisible };
    } catch (error) {
        console.error("Error fetching host properties:", error.message);
        alert("Failed to load host properties. Please try again.");
        throw error;
    }
}

// Delete a Property
export async function deleteProperty(propertyId) {
    try {
        await deleteDoc(doc(db, "properties", propertyId));
        alert("Property deleted successfully!");
    } catch (error) {
        console.error("Error deleting property:", error.message);
        alert("Failed to delete property. Please try again.");
        throw error;
    }
}
