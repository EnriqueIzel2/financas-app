import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBFzWI4FqRts4vnZ8O3cucG2PCnjZRAHA0",
  authDomain: "meu-app-6f77a.firebaseapp.com",
  databaseURL: "https://meu-app-6f77a.firebaseio.com",
  projectId: "meu-app-6f77a",
  storageBucket: "meu-app-6f77a.appspot.com",
  messagingSenderId: "656055173810",
  appId: "1:656055173810:web:9f27770c78c7426da03fab",
  measurementId: "G-J6XP6YDWFE",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
