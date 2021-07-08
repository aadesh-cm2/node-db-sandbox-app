var admin = require("firebase-admin");
require("dotenv").config();
var serviceAccount = require("./firebase-config.json");
const {Storage} = require('@google-cloud/storage');

const bucketName = process.env.BUCKET_URL

const initialize = () => {
//initialize a new bucket if the bucket does not exist
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName,
  });
}
}

const saveImage = (file) => {

return new Promise((resolve, reject) => {
  
  initialize();
  
  //use that bucket to store files
  const bucket = admin.storage().bucket();
  
  const blob = bucket.file(file.originalname);
  
  //upload file using blob
  const blobWriter = blob.createWriteStream({
      metadata: {
          contentType: file.mimetype
      }
  });

  let fileURL;

  blobWriter.end(file.buffer);

  //return back uploaded file URL to be saved onto DB
  blobWriter.on("finish", () => {
      console.log("File Uploaded")
      fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`
      resolve(fileURL);
  });

  blobWriter.on("error", (err) => {
    console.log(err);
    reject(err)
  });

});
  
}

const deleteImage = async fileName => {
 
  return new Promise((resolve, reject) => {
    try{
      initialize()
  
      const bucket = admin.storage().bucket();
  
      bucket.file(fileName).delete();
      console.log(`gs://${bucketName}/${fileName} deleted`);
      resolve(true);
    }
    catch(err){
      console.error(err)
      reject(err)
    }

  });
}
module.exports = {
  saveImage,
  deleteImage
};