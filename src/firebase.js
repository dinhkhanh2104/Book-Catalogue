
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
    collection,
    getDocs,
    getFirestore
} from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAuIzzz0JEJnulnO1Npyzp682lrdeIoPwM",
    authDomain: "book-catalogue-f87f5.firebaseapp.com",
    projectId: "book-catalogue-f87f5",
    storageBucket: "book-catalogue-f87f5.appspot.com",
    messagingSenderId: "1042889312186",
    appId: "1:1042889312186:web:35ca6bba698c42a5ca7f83",
    measurementId: "G-M31QB1JN31"
};

// init firebase app
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// init services
export const db = getFirestore()


