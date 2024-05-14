const multer = require('multer');

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg'||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/pdf' ||
        file.mimetype === 'image/docx'
        ) {
        cb(null, true);
    } else { cb(null, false); return cb(new Error('Unsupported file format!')); }
};



const upload = multer({ storage:storage, fileFilter: fileFilter });

module.exports = upload; 