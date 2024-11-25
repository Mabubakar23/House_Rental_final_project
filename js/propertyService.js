//propertyService.js
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

const db = getFirestore();

export async function addPropertyListing(property) {
    try {
        await addDoc(collection(db, "properties"), {
            ...property,
            timestamp: Date.now(),
        });
        alert("Property added successfully!");
    } catch (error) {
        alert("Error adding property: " + error.message);
    }
}

export async function fetchProperties(filters = {}, pageSize = 10, lastDoc = null) {
    try {
        let q = query(collection(db, "properties"), orderBy("timestamp"), limit(pageSize));
        if (filters.location) {
            q = query(q, where("location", "==", filters.location));
        }
        if (lastDoc) {
            q = query(q, startAfter(lastDoc));
        }

        const querySnapshot = await getDocs(q);
        const properties = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        return { properties, lastVisible };
    } catch (error) {
        alert("Error fetching properties: " + error.message);
    }
}
