const mongoose = require("mongoose");

const assetName = {
    assetNameEN : String,
    assetNameFR : String
}

const size = {
    width : Number,
    height : Number,
    code : String
}

const metaData = {
    makeCD : Number,
    modelCD : String,
    modelYear : String,
    modelTypeEN : String,
    modelTypeFR : String,
    modelSubTypeEN : String,
    modelSubTypeFR : String,
    color : String,
    expiryDate : String,
    size
}

const assetSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    imageURL : String,
    assetName,
    make : { type: String, enum: ['Chevrolet','Buick','GMC','Cadillac']},
    model : String,
    desc : String,
    status : Boolean,
    primary : Boolean,
    metaData
});

module.exports = mongoose.model("Asset", assetSchema);