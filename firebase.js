// Import the functions you need from the SDKs you need
import * as firebase from "firebase";
import "firebase/database";
// import "firebase/firestore";
// import database from "@react-native-firebase/database";

// Subsequent queries will use persistence, if it was enabled successfully

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBkDFaA7Ly7niJj1Efy8qzXQp-g0NAYpYc",
  authDomain: "drivia-4412d.firebaseapp.com",
  projectId: "drivia-4412d",
  databaseURL: "https://drivia-4412d-default-rtdb.firebaseio.com/",
  // databaseURL: "https://drivia-4412d.firebaseio.com",
  storageBucket: "drivia-4412d.appspot.com",
  messagingSenderId: "399439909295",
  appId: "1:399439909295:web:b0af78623bcd8eba9c1f5a",
};
// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

// const database = firebase.firestore();
const database = firebase.database();
const auth = firebase.auth();
const storage = firebase.storage();

// database.enablePersistence();
// database.setPersistenceEnabled(true);

export { auth, database, storage };
