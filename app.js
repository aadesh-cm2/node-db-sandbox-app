const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');
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

const app = express();

// setting limit for body parser. You can change it to whatever required
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/', (req, res) => {
    const obj = {
        name: "Aadesh",
        lastname: "Shah"
    }
    // database.ref("customPath").set(obj, function(error) {
    //     if (error) {
    //       // The write failed...
    //       console.log("Failed with error: " + error)
    //     } else {
    //       // The write was successful...
    //       console.log("success")
    //     }
    // })
        database.ref('customPath').once('value')
    .then(function(snapshot) {
        console.log( snapshot.val() )
    })
    .catch(err => {
        console.error(err);
    })
    res.send("It workes!")
})

module.exports = app;
