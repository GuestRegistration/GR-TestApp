import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB9lA-Kv3O0CSM_lhDqkkWbhIEF2yrWlEg",
    authDomain: "guestregistration-4140a.firebaseapp.com",
    databaseURL: "https://guestregistration-4140a.firebaseio.com",
    projectId: "guestregistration-4140a",
    storageBucket: "guestregistration-4140a.appspot.com",
    messagingSenderId: "840040500916",
    appId: "1:840040500916:web:7a1dcb5214f4e597b091e1",
    measurementId: "G-15CD9K4NN1"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)
  
  const db = firebase.firestore()
  const auth =  firebase.auth()
  const storage =  firebase.storage()
  db.settings({})

  export default {firebase, db, auth, storage};
