const mongoose = require("mongoose");

const assetName = {
    EN : String,
    FR : String
}

const metaData = {
    makeCD : String,
    modeCD : String,
    modelYear : String,
    modelType : String,
    modelSubType : String,
    color : String,
    expiryDate : String
}

const assetSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    imageURL : String,
    assetName,
    make : { type: String, enum: ['Chevrolet','Buick','GMC','Cadillac']},
    model : String,
    desc : String,
    status : Boolean,
    metaData
});

module.exports = mongoose.model("Asset", assetSchema);