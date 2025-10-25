import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyB_TV8FmA8wtmdtR4BXziMasy1YIgoQDgY",
  authDomain: "plume-d2819.firebaseapp.com",
  projectId: "plume-d2819",
  storageBucket: "plume-d2819.firebasestorage.app",
  messagingSenderId: "903594729517",
  appId: "1:903594729517:web:068f39e026f950ca81d8a4",
  measurementId: "G-3GQVZJTLXP"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;