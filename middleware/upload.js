const multer = require('multer');
const path = require('path');

// Configure multer to handle image uploads
const storage = multer.diskStorage({
  destination: 'uploads/', // Directory to save uploaded files
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
