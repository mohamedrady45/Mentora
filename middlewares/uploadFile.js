const multer = require('multer');


// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        //cb(null, file.filename + "-" + file.originalname);
        cb(null, Date.now() + '-' + file.originalname);
    },
});


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png'||
        file.mimetype === 'image/jpg'||
        file.mimetype === 'image/pdf'
        ) {
        cb(null, true);
    } else { cb(null, false); return cb(new Error('Only image files are allowed!')); }
};

const upload = multer({ storage:storage, fileFilter: fileFilter });

module.exports = upload;