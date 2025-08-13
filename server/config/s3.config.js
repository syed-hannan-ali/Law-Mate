// server/config/s3.config.js

const { S3Client } = require("@aws-sdk/client-s3");

console.log("Initializing S3 client with bucket:", process.env.AWS_BUCKET_NAME);

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

module.exports = s3;
