import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBaXPUzG1KAxnoA0ePAmKixqOvuC4LhajY",
    authDomain: "midi-wizard-dev.firebaseapp.com",
    databaseURL: "https://midi-wizard-dev.firebaseio.com",
    projectId: "midi-wizard-dev",
    storageBucket: "midi-wizard-dev.appspot.com",
    messagingSenderId: "893593876654",
    appId: "1:893593876654:web:69cd4f95a6c7300039953f",
    measurementId: "G-YZJZDVKZFP"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;