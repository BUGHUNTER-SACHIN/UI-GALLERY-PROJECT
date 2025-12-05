import { db } from "./firebase";
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, orderBy, serverTimestamp } from "firebase/firestore";
const getImagesCollection = (userId) => collection(db, "users", userId, "images");
export const saveImageToFirestore = async (userId, image) => {
  console.log(`[Firestore] saveImageToFirestore called for user ${userId}`, image);
  try {
    const collectionRef = getImagesCollection(userId);
    console.log("[Firestore] Collection reference created", collectionRef);
    const timeout = new Promise(
      (_, reject) => setTimeout(() => reject(new Error("Firestore operation timed out after 10s")), 1e4)
    );
    const docRef = await Promise.race([
      addDoc(collectionRef, {
        ...image,
        createdAt: serverTimestamp(),
        isFavorite: false
      }),
      timeout
    ]);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};
export const getUserImages = async (userId) => {
  try {
    const q = query(getImagesCollection(userId), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc2) => ({
      ...doc2.data(),
      id: doc2.id,
      // Add Firestore document ID
      // Ensure required fields are present if missing in older data
      public_id: doc2.data().public_id,
      secure_url: doc2.data().secure_url,
      created_at: doc2.data().created_at || (/* @__PURE__ */ new Date()).toISOString(),
      width: doc2.data().width || 0,
      height: doc2.data().height || 0
    }));
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};
export const deleteImageFromFirestore = async (userId, imageId) => {
  try {
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
export const toggleFavoriteInFirestore = async (userId, docId, currentStatus) => {
  try {
    const docRef = doc(db, "users", userId, "images", docId);
    await updateDoc(docRef, {
      isFavorite: !currentStatus
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};
