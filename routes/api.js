const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ocrController = require('../controllers/ocrController');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadPath = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST route for uploading an image to extract ISBN
router.post('/upload', upload.single('image'), ocrController.extractISBN);

module.exports = router;
