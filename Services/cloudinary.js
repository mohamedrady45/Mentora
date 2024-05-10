const cloudinary = require('cloudinary')

const upload = require('../middlewares/uploadFile');
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUNDAIRY_CLOUD_NAME,
  api_key: process.env.CLOUNDAIRY_API_KEY,
  api_secret: process.env.CLOUNDAIRY_API_SECRET
});


//cloundairy upload image
const cloudinaryUploadImage = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  }
  catch (error) {
    return error;
  }
}

//cloundairy remove image
const cloudinaryRemoveImage = async (imagePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(imagePublicId);
    return result;
  }
  catch (error) {
    return error;
  }
}

//get image url
const getImageUrl = async (imagePath) => {
  try {
    //Upload to cloudinary
    const result = await cloudinaryUploadImage(imagePath)
    console.log(result);

    //Remove image from the server
    fs.unlinkSync(imagePath)
    return result.secure_url;
  }
  catch (error) {
    return error;
  }
}

module.exports = {
  cloudinaryUploadImage,
  cloudinaryRemoveImage,
  getImageUrl,
};