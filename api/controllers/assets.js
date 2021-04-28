const mongoose = require("mongoose");
const { resolveMetaData, resolveImageSize } = require("../../utils/assets");

const {saveImage} = require("../../utils/firebase-functions");

const assets = require("../models/assets");


const saveAsset = (newAsset, file) => {
    return new Promise(async (resolve, reject) => {
        const imageURL = await saveImage(file)
        let size = resolveImageSize(file.buffer)

        const asset = new assets({
            _id: new mongoose.Types.ObjectId(),
            imageURL,
            assetName: {
                assetNameEN : newAsset.assetNameEN,
                assetNameFR : newAsset.assetNameFR 
            },
            make: newAsset.make,
            model: newAsset.model,
            desc: newAsset.desc ? req.body.desc : null,
            status: true,
            primary: newAsset.primaryAsset == 'true',
            metaData: {
                makeCD : newAsset.makeCD,
                modelCD : newAsset.modelCD,
                modelYear : newAsset.modelYear,
                modelTypeEN : newAsset.modelTypeEN,
                modelTypeFR : newAsset.modelTypeFR,
                modelSubTypeEN : newAsset.modelSubTypeEN,
                modelSubTypeFR : newAsset.modelSubTypeFR,
                color : newAsset.color,
                expiryDate : newAsset.expiryDate ? newAsset.expiryDate : null,
                size
            }
        })

        asset.save().then(result => {
           resolve(result)
        })
        .catch(err => {
            console.error(err);
            reject(err);
        })
    })
}

module.exports = {
    saveAsset,
  };