// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCT8PJNmA1MDs8Mul8g6xEMHQ4U7yOM330",
  authDomain: "fir-projects-bdcda.firebaseapp.com",
  projectId: "fir-projects-bdcda",
  storageBucket: "fir-projects-bdcda.firebasestorage.app",
  messagingSenderId: "739635413740",
  appId: "1:739635413740:web:1a4374070854a9182bdbc9",
  measurementId: "G-HV3P4JE0KH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// Reglas de Firestore (para desarrollo)
const rules = `
    rules_version = '2';
    service cloud.firestore {
        match /databases/{database}/documents {
            // Permitir lectura y escritura a todos durante el desarrollo
            match /products/{productId} {
                allow read, write: if true;
            }
        }
    }
`;

export { db, auth, app, rules };