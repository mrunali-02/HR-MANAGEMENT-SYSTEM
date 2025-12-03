// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRYdGCe-CGTkxvFWo2y2v-RpYK_IrI1wA",
  authDomain: "internship-login-auth.firebaseapp.com",
  projectId: "internship-login-auth",
  storageBucket: "internship-login-auth.firebasestorage.app",
  messagingSenderId: "818160688642",
  appId: "1:818160688642:web:fb6bf31bfa1fc7a477911b"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication (THIS must come BEFORE exporting)
const auth = getAuth(app);
// Initialize Firebase
export { auth };      // named export
export default app;   // default export