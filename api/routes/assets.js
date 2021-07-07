const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
var dotify = require('node-dotify');
var AdmZip = require('adm-zip');

const {saveAsset, getTotalAssets, getFilterAssets} = require("../controllers/assets");

const assets = require("../models/assets");

const router = express.Router();

const upload = multer({storage: multer.memoryStorage()});

var bulkStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, 'Upload.zip');
    }
});

var bulkUpload = multer({ storage: bulkStorage }).any();

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

router.post('/bulk', upload.array('files', 10), async (req, res) => {

    if (!req.body || !req.body.assetNameEN || !req.body.assetNameFR || !req.body.make || !req.body.model) 
        return res.status(500).json({message: "Missing Asset data", success: false});

    const newAsset = req.body,
            files = req.files;

    if (!req.files) 
        return res.status(400).send("Missing image file");
    
    try{
        let assetSaved = []
        files.map(async file => {
            assetSaved.push(await saveAsset(newAsset, file))
        })
        Promise.resolve(assetSaved)
        .then(result => {

            console.log("Reolved promises:::",result)
            return res.status(200).json({
                message : "Bulk upload complete!",
                success : true
            })
        })
        .catch(err => {
            console.log(err)
            return res.status(500).json({message: 'Something went wrong', success: false})
        })

    }
    catch(error){
        console.error(error);
        return res.status(500).json({message: "Something went wrong", success: false})

    }
})

router.post('/all', async (req, res) => {

    let {query, config, sort } = req.body;

    if(!query || !config)
        return res.status(400).json({
            message : "Missing paramaters",
            success : false
        })

    console.log("Query:", query);
    console.log("config:", config);

    query = await dotify(query)

    if(query.model)
        query.model = new RegExp('^'+query.model, "i")
    console.log("Dotify Query::",query)

    if(!sort)
        sort = {
            _id : 'asc'
        }

    console.log("sort:", sort);

    const skip = config.page * config.limit;

    const totalAssets = await getTotalAssets();
    const filterCount = await getFilterAssets(query);

    console.log("Filter count:::",filterCount)

    assets.find(query).limit(config.limit ? config.limit : 50).skip(skip).sort(dotify(sort)).exec().then(result => {
        
        const currentCount = result.length
        const pageCount = currentCount ===0 ? 0 : Math.ceil(filterCount/config.limit)

        if(!result || !result.length)
            return res.status(200).json({
                data: result,
                success : false,
                message : "No assets found",
                pageData: {
                    total : totalAssets,
                    currentLimit : config.limit,
                    currentPage : config.page,
                    pageCount
                }
            })


        return res.status(200).json({data: result, success: true, pageData: {
            total : totalAssets,
            currentLimit : config.limit,
            currentPage : config.page,
            pageCount
        }})
    }).catch(err => {
        console.error(err);

    })
})

router.get('/search',(req, res) => {

    let { key } = req.query;

    key = new RegExp('^'+key, "i")

    
    
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
