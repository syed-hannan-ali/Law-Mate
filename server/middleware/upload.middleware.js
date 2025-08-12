// middleware/upload.js
const multer = require("multer");
const path = require("path");



// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Folder where files will be saved
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            file.fieldname +
                "-" +
                uniqueSuffix +
                path.extname(file.originalname),
        );
    },
});

// File filter (optional)
const fileFilter = (req, file, cb) => {
    // Accept only PDFs & images as example
    console.log("File received:", file);
    console.log("File mimetype:", file.mimetype);
    if (
        file.mimetype === "application/pdf" ||
        file.mimetype.startsWith("image/")
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only PDF and image files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
