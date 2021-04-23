const express = require("express");
require("dotenv").config();
const path = require("path");
const cors = require("cors");
const basicAuth = require('express-basic-auth')
const bodyParser = require('body-parser');
const mongoose = require("mongoose");

// routes
const userRoute = require("./api/routes/assets");

// users to be authenticated to use the API
const users = require('./users.json')

const rootRoute = "/api/v1";

const app = express();

//MongoDB Atlas connecting string
const mongoUrl = `mongodb://${
    process.env.MONGO_USER
}:${
    process.env.MONGO_PASS
}@cluster0-shard-00-00.nmqiy.mongodb.net:27017,cluster0-shard-00-01.nmqiy.mongodb.net:27017,cluster0-shard-00-02.nmqiy.mongodb.net:27017/${
    process.env.MONGO_DB
}?ssl=true&replicaSet=atlas-8ot9f2-shard-0&authSource=admin&retryWrites=true&w=majority`;


//Connecting to MongoDB
try {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    });
    console.log("Database connected...");
} catch (error) {
    console.error(error);
}

// setting limit for body parser. You can change it to whatever required
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json());

app.use(cors());

app.use(basicAuth({users}))

// app.use('/', async (req, res) => {
//     // const data = await db.collection('assets').get();
//     // console.log(data);
//     res.send("It workes!")
// })

app.use(`${rootRoute}/assets`, userRoute);

module.exports = app;
