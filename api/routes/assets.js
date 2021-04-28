const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const { resolveMetaData, resolveImageSize } = require("../../utils/assets");

const {saveImage} = require("../../utils/firebase-functions");
const { saveAsset } = require("../controllers/assets");

const assets = require("../models/assets");

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});


router.post('/', upload.single("file"), async (req, res) => {

    if (!req.body || !req.body.assetNameEN || !req.body.assetNameFR || !req.body.make || !req.body.model )
        return res.status(500).json({message: "Missing Asset data", success: false});
    
    const newAsset = req.body;

    console.log(newAsset);
    console.log(req.file);

    if (!req.file) 
        return res.status(400).send("Missing image file");
    try{
        if(newAsset.primaryAsset == 'true'){
            assets.findOne({
                make : newAsset.make,
                model : newAsset.model,
                primary : true,
                "metaData.modelYear" : newAsset.modelYear
            })
            .then(async existingPrimaryAsset => {
                if(existingPrimaryAsset){
                    console.log("Primary asset exists for this vehicle")
                    res.status(400).json({
                        message : "Primary asset exists for this vehicle",
                        success : false
                    })
                }
                else{
                    saveAsset(newAsset, req.file)
                    .then(asset => {
                        res.status(200).json({
                            message : 'Asset Added!',
                            asset,
                            success : true
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message : 'Something went wrong',
                            success : false
                        })
                    })
                }
            })
            .catch(err => {
                console.error(err)
                res.status(500).json({
                    message: "Something went wrong",
                    success: false
                })
            })

        }
        else{
            saveAsset(newAsset, req.file)
            .then(asset => {
                res.status(200).json({
                    message : 'Asset Added!',
                    asset,
                    success : true
                })
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({
                    message : 'Something went wrong',
                    success : false
                })
            })
        }
        
    }
    catch(err){
        console.error(err)
        res.status(500).json({
            message: "Something went wrong",
            success: false
        })
    }

})

router.get('/all', (req, res) => {
    assets.find().exec().then(result => {
        res.status(200).json({
            data : result,
            success : true
        })
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({
            message : 'Something went wrong',
            success : false 
        })
    })
})

module.exports = router;
