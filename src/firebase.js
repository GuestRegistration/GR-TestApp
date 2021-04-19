import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/messaging'
import config from './config';

  // Initialize Firebase
  firebase.initializeApp(config.firebase.sdk)
  
  const db = firebase.firestore()
  const auth =  firebase.auth()
  const storage =  firebase.storage()
  const messaging = firebase.messaging()
  messaging.usePublicVapidKey(config.firebase.VapidKey);
  db.settings({})

  export default {firebase, db, auth, storage, messaging};
