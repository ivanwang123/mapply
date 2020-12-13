import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var firebaseConfig = {
    apiKey: "AIzaSyBFGSn03RtUXTn8RIv7zsFVUPPC_4F1-0U",
    authDomain: "maps-eb319.firebaseapp.com",
    databaseURL: "https://maps-eb319.firebaseio.com",
    projectId: "maps-eb319",
    storageBucket: "maps-eb319.appspot.com",
    messagingSenderId: "84528951078",
    appId: "1:84528951078:web:e944a381032c834663dbe7",
    measurementId: "G-ZHLWF9SEK3"
};

firebase.initializeApp(firebaseConfig);

firebase.firestore();
firebase.auth();

export default firebase;