import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'

const firebaseConfig = require('./firebase-config');
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig.sdk)
  
  const db = firebase.firestore()
  const auth =  firebase.auth()
  const storage =  firebase.storage()
  const messaging = firebase.messaging()
  messaging.usePublicVapidKey(firebaseConfig.VapidKey);
  db.settings({})

  export default {firebase, db, auth, storage, messaging};
