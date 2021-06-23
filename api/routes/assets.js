const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
var dotify = require('node-dotify');

const {saveAsset} = require("../controllers/assets");

const assets = require("../models/assets");

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});


router.post('/', upload.single("file"), async (req, res) => {

    if (!req.body || !req.body.assetNameEN || !req.body.assetNameFR || !req.body.make || !req.body.model) 
        return res.status(500).json({message: "Missing Asset data", success: false});
    


    const newAsset = req.body;

    console.log(newAsset);
    console.log(req.file);

    if (!req.file) 
        return res.status(400).send("Missing image file");
    

    try {
        if (newAsset.primaryAsset == 'true') {
            assets.findOne({make: newAsset.make, model: newAsset.model, primary: true, "metaData.modelYear": newAsset.modelYear}).then(async existingPrimaryAsset => {
                if (existingPrimaryAsset) {
                    console.log("Primary asset exists for this vehicle")
                    return res.status(400).json({message: "Primary asset exists for this vehicle", success: false})
                } else {
                    saveAsset(newAsset, req.file).then(asset => {
                        res.status(200).json({message: 'Asset Added!', asset, success: true})
                    }).catch(err => {
                        return res.status(500).json({message: 'Something went wrong', success: false})
                    })
                }
            }).catch(err => {
                console.error(err)
                return res.status(500).json({message: "Something went wrong", success: false})
            })

        } else {
            saveAsset(newAsset, req.file).then(asset => {
                return res.status(200).json({message: 'Asset Added!', asset, success: true})
            }).catch(err => {
                console.log(err)
                return res.status(500).json({message: 'Something went wrong', success: false})
            })
        }

    } catch (err) {
        console.error(err)
        return res.status(500).json({message: "Something went wrong", success: false})
    }

})

router.post('/multiple', upload.array('files', 10), (req, res) => {
    console.log(req.files)

    if (!req.body || !req.body.assets.length) 
        return res.status(500).json({message: "Missing Asset data", success: false});
     else if (!req.files.length) 
        return res.status(400).json({message: 'Missing Images', success: false})


    


    const assets = req.body.assets;

    const uploadedAssets = []

    req.files.map((file, index) => {
        if (files[index].originalname == assets[index].fileName) {
            saveAsset(assets[index], files[index]).then(asset => {
                uploadedAssets.push(asset)
            }).catch(err => {
                console.error(err)
                return res.status(500).json({message: "Something went wrong", success: false})
            })
        }
    })

    if (uploadedAssets.length) 
        return res.status(200).json({message: "Assets Uploaded!", assets: uploadedAssets, success: true})
     else 
        return res.status(500).json({message: "Something went wrong", success: false})


    


})

router.post('/all', async (req, res) => {

    const {query, config } = req.body;

    if(!query || !config)
        return res.status(400).json({
            message : "Missing paramaters",
            success : false
        })

    console.log("Query:", query);
    console.log("config:", config);

    const totalAssets = await assets.countDocuments();

    const skip = config.page * config.limit;

    console.log(totalAssets);

    console.log(dotify(query));

    assets.find(dotify(query)).limit(config.limit ? config.limit : 50).skip(skip).exec().then(result => {
        console.log("Vehicles:::", result.length)
        return res.status(200).json({data: result, success: true, pageData: {
            total : totalAssets,
            currentLimit : config.limit,
            currentPage : config.page
        }})
    }).catch(err => {
        console.error(err);

    })
})

router.put('/vehicle/:id', (req, res) => {

    const id = req.params.id;
    const {asset} = req.body;
    assets.findByIdAndUpdate(id, asset).then(result => {
        if (result) 
            return res.status(200).json({data: result, message: "Asset updated!", success: true})
         else 
            notFoundError(res);
        
    })
    .catch(err => {
        console.log(err)
        internalError(res);
    })
});

router.delete('/vehicle/:id', (req, res) => {

    const id = req.params.id;

    assets.findByIdAndDelete(id).then(result => {

        if (result) 
            return res.status(200).json({message: "Asset Deleted!", success: true})
         else 
            notFoundError(res);
        
    }).catch(err => {
        console.error(err);
        internalError(res)
    })
});

router.get('/vehicle/:id', (req, res) => {

    const id = req.params.id

    assets.findById(id).exec().then(result => {
        if (result !== null || result) 
            return res.status(200).json({data: result, success: true})
         else 
            notFoundError(res);
        
    }).catch(err => {
        console.error(err);
        internalError(res)
    })
});

const notFoundError = res => {
    return res.status(404).json({message: "Asset not found!", success: false})
}

const internalError = res => {
    return res.status(500).json({message: 'Something went wrong', success: false})
}

module.exports = router;
