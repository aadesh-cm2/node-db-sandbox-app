const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { resolveMetaData } = require("../../utils/assets");

const {saveImage} = require("../../utils/firebase-functions");

const assets = require("../models/assets");

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});


router.post('/', upload.single("file"), async (req, res) => {

    // if (!req.body || !req.body.data.assetName || !req.body.data.imageName || !req.body.data.make || !req.body.data.model )
    //     return res.status(500).json({message: "Missing body data", success: false});
    console.log(req.body);
    console.log(req.file);
    if (!req.file) 
        return res.status(400).send("Missing image file");
    try{

        //console.log(req.file);

        //const imageURL = await saveImage(req.file)

        //resolveMetaData('Buick',req.file)
        

        // const asset = new assets({
        //     _id: new mongoose.Types.ObjectId(),
        //     imageURL,
        //     assetName: req.body.data.assetName,
        //     make: req.body.make,
        //     model: req.body.model,
        //     desc: req.body.desc ? req.body.desc : '',
        //     status: true,
        //     metaData: {
        //         makeCD
        //     }
        // })

        res.status(200).json({
            //imageURL,
            message: "Asset added!",
            success: true
        })

    }
    catch(err){
        console.error(err)
        res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }

})

module.exports = router;
