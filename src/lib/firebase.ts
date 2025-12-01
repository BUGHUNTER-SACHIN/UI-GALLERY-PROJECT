import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBKjaBXd1DvHTIyqUfHtIF_E2gCvlz___s",
    authDomain: "reactjsauth-936ff.firebaseapp.com",
    projectId: "reactjsauth-936ff",
    storageBucket: "reactjsauth-936ff.firebasestorage.app",
    messagingSenderId: "201730580340",
    appId: "1:201730580340:web:4aae6519c6ab8fb9be1621",
    measurementId: "G-WXNW7LCCJ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
