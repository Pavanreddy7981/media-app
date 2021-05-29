import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyA4RGcFSOjRfBwtE0iivX003TMDDwtODwM",
  authDomain: "media-app-9983e.firebaseapp.com",
  projectId: "media-app-9983e",
  storageBucket: "media-app-9983e.appspot.com",
  messagingSenderId: "1078847031764",
  appId: "1:1078847031764:web:bfa36a27357b3061ed6e41"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db   =  firebaseApp.firestore();

const storage = firebase.storage();

const auth  = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();

export {db, storage, auth, provider}