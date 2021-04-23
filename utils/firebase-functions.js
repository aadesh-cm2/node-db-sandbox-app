var admin = require("firebase-admin");
require("dotenv").config();
var serviceAccount = require("./firebase-config.json");


const saveImage = (file) => {

return new Promise((resolve, reject) => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.BUCKET_URL,
    });
  }
  
  const bucket = admin.storage().bucket();
  
  const blob = bucket.file(file.originalname);
  
  const blobWriter = blob.createWriteStream({
      metadata: {
          contentType: file.mimetype
      }
  });

  let fileURL;

  blobWriter.end(file.buffer);

  blobWriter.on("finish", () => {
      console.log("File Uploaded")
      fileURL = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`
      resolve(fileURL);
  });

  blobWriter.on("error", (err) => {
    console.log(err);
    reject(err)
  });

  console.log(fileURL);

});
  
}
module.exports = {
  saveImage,
};