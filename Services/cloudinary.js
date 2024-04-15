import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'di4ytdfwq', 
  api_key: '578268519668849', 
  api_secret: '' 
<<<<<<< HEAD
});
cloudinary.uploader.upload('../uploads', function(error, result) {
  console.log(result, error);
=======
>>>>>>> 724de193f3826556dee8203371bfde8a5fa79b98
});

module.exports = cloudinary;
