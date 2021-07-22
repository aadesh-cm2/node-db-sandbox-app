const mongoose = require("mongoose");
const { resolveMetaData, resolveImageSize, filterVehicle, decapsulateImageName } = require("../../utils/assets");

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
                makeCD : Number(newAsset.makeCD),
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

const updateAsset = async (asset, id, file) => {
    return new Promise(async (resolve, reject) => {
        try{
        if(file){
            let {originalImage} = asset
            originalImage = decapsulateImageName(originalImage)
    
            await deleteImage(originalImage);
            asset.imageURL = await saveImage(file)
        }
    
        let filteredVehicle = filterVehicle(asset)

        console.log("filteredVehicle",filteredVehicle)
    
        let metaData = {
            makeCD : filteredVehicle.makeCD,
            modelCD : filteredVehicle.modelCD,
            modelYear : asset.metaData.modelYear,
            modelTypeEN : filteredVehicle.modelTypeEN,
            modelTypeFR : filteredVehicle.modelTypeFR,
            modelSubTypeEN : filteredVehicle.modelSubTypeEN,
            modelSubTypeFR : filteredVehicle.modelSubTypeFR,
            color : asset.metaData.color,
            expiryDate : asset.metaData.expiryDate,
            size: file ? resolveImageSize(file.buffer) : asset.metaData.size
        }
    
        asset.metaData = metaData
        assets.findByIdAndUpdate(id, asset).then(result => {
                    if (result)
                        resolve(result)
                    else
                        reject(false)
                })
                .catch(err => {
                    console.log(err)
                    reject(err);
                })
            }
            catch(err){
                reject(err);
            }
    })
}

const getTotalAssets = async () => {
    try{
        const totalAssets = await assets.countDocuments();
        return totalAssets;
    }
    catch(err){
        return null;
    }
}

const getFilterAssets = async filter => {
    try{
        const filterCount = await assets.find(filter).countDocuments()
        return filterCount;

    }
    catch(err){
        return null;
    }

}

module.exports = {
    saveAsset,
    getTotalAssets,
    getFilterAssets,
    updateAsset
  };