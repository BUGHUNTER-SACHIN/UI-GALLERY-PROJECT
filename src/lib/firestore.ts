import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, orderBy, serverTimestamp } from "firebase/firestore";
import { CloudinaryImage } from "./cloudinary";

// Collection reference
const getImagesCollection = (userId: string) => collection(db, "users", userId, "images");

export const saveImageToFirestore = async (userId: string, image: CloudinaryImage) => {
    console.log(`[Firestore] saveImageToFirestore called for user ${userId}`, image);
    try {
        const collectionRef = getImagesCollection(userId);
        console.log("[Firestore] Collection reference created", collectionRef);

        // Create a timeout promise
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Firestore operation timed out after 10s")), 10000)
        );

        // Race the addDoc against the timeout
        const docRef = await Promise.race([
            addDoc(collectionRef, {
                ...image,
                createdAt: serverTimestamp(),
                isFavorite: false
            }),
            timeout
        ]) as any; // Type assertion needed for race result

        console.log("Document written with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw e;
    }
};

export const getUserImages = async (userId: string): Promise<CloudinaryImage[]> => {
    try {
        const q = query(getImagesCollection(userId), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id, // Add Firestore document ID
            // Ensure required fields are present if missing in older data
            public_id: doc.data().public_id,
            secure_url: doc.data().secure_url,
            created_at: doc.data().created_at || new Date().toISOString(),
            width: doc.data().width || 0,
            height: doc.data().height || 0
        })) as CloudinaryImage[];
    } catch (e) {
        console.error("Error getting documents: ", e);
        // Fallback to empty array if query fails (e.g. index missing)
        return [];
    }
};

export const deleteImageFromFirestore = async (userId: string, imageId: string) => {
    try {
        // Note: imageId here must be the Firestore Document ID, not the Cloudinary public_id
        // If we only have public_id, we'd need to query for it first. 
        // For now, let's assume we pass the doc ID or we query by public_id.

        // Query to find the doc by public_id if we don't have the doc ID
        const q = query(getImagesCollection(userId), where("public_id", "==", imageId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            await deleteDoc(doc(db, "users", userId, "images", document.id));
        });
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw e;
    }
};

export const toggleFavoriteInFirestore = async (userId: string, imageId: string, currentStatus: boolean) => {
    try {
        // Same logic as delete: find doc by public_id
        const q = query(getImagesCollection(userId), where("public_id", "==", imageId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (document) => {
            await updateDoc(doc(db, "users", userId, "images", document.id), {
                isFavorite: !currentStatus
            });
        });
    } catch (e) {
        console.error("Error updating document: ", e);
        throw e;
    }
};
