const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// setting limit for body parser. You can change it to whatever required
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use('/', (req, res) => {
    res.send("It workes!")
})

module.exports = app;
