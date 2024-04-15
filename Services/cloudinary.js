import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'di4ytdfwq', 
  api_key: '578268519668849', 
  api_secret: '' 
});
cloudinary.uploader.upload('../uploads', function(error, result) {
  console.log(result, error);
});

module.exports = cloudinary;