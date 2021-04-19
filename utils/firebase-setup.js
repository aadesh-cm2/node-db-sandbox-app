const firebase = require('firebase')

const firebaseConfig = {
    apiKey: "AIzaSyD8SZwKfKbM0Z-DqDnjldKIoCLrC_Iq9Yw",
    authDomain: "node-db-sandbox.firebaseapp.com",
    databaseURL: "https://node-db-sandbox-default-rtdb.firebaseio.com",
    projectId: "node-db-sandbox",
    storageBucket: "node-db-sandbox.appspot.com",
    messagingSenderId: "187698268139",
    appId: "1:187698268139:web:4fa496cf390fa2bb193bae",
    measurementId: "G-6ENL68C70J"
  };

  firebase.initializeApp(firebaseConfig)

  let database = firebase.database()