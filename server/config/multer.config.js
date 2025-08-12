const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("@config/s3.config");

console.log("Configuring multer for S3 uploads at time:", new Date().toISOString());


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const uniqueName = Date.now().toString() + "-" + file.originalname;
            cb(null, `documents/${uniqueName}`); // folder in S3
        },
    }),
});

module.exports = upload;
