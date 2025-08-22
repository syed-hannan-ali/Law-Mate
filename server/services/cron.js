const cron = require("node-cron");
const axios = require("axios");
const Document = require("@models/document.model");
const AWS = require("aws-sdk");
const Bill = require("@models/bill.model");
const sendEmail = require("@config/mailer"); // helper for nodemailer

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

async function updateSignedDocumentsStatus() {
    try {
        // Get all documents still pending
        const pendingDocs = await Document.find({ esignStatus: "pending" });

        console.log(`Found ${pendingDocs.length} pending documents to check.`);

        const DROPBOXSIGN_API_KEY = process.env.DROPBOX_API_KEY;

        for (const doc of pendingDocs) {
            // 1. Fetch status from Dropbox Sign
            const res = await axios.get(
                `https://api.hellosign.com/v3/signature_request/${doc.esignRequestId}`,
                {
                    auth: { username: DROPBOXSIGN_API_KEY, password: "" },
                },
            );

            // console.log(res.data);

            const signatureRequest = res.data.signature_request;

            // 2. Check if complete
            if (signatureRequest.is_complete) {
                console.log(`✅ Document ${doc._id} is fully signed.`);

                const fileRes = await axios.get(
                    `https://api.hellosign.com/v3/signature_request/files/${doc.esignRequestId}?file_type=pdf`,
                    {
                        auth: { username: DROPBOXSIGN_API_KEY, password: "" },
                        responseType: "arraybuffer",
                    },
                );
                const s3Params = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: `signed_documents/${doc._id}.pdf`,
                    Body: fileRes.data,
                    ContentType: "application/pdf",
                };

                await s3.upload(s3Params).promise();

                // Update document in MongoDB
                doc.esignStatus = "signed";
                doc.signedFileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/signed_documents/${doc._id}.pdf`;

                await doc.save();
            }
        }
    } catch (err) {
        console.error("Error updating signed documents:", err.message);
    }
}

// Runs every 5 minutes
cron.schedule(" */5 * * * *", () => {
    console.log("Running document status check:", new Date().toISOString());
    updateSignedDocumentsStatus();
});

// Runs every day at midnight
cron.schedule("0 0 * * *", async () => {
    console.log("Checking pending payments...");
    const today = new Date();

    const pendingBills = await Bill.find({
        status: "sent",
        dueDate: {
            $gte: today,
            $lte: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000), // within 3 days
        },
    }).populate("client", "email username");

    for (const bill of pendingBills) {
        await sendEmail(
            bill.client.email,
            "Pending Invoice Payment Reminder",
            `
            Hi ${bill.client.username},

            This is a reminder that your invoice (ID: ${bill._id}) for case "${bill.case}" 
            was due on ${bill.dueDate.toDateString()}.

            Total Amount Due: $${bill.total}

            Please make the payment at your earliest convenience.

            Thank you,
            Your LawMate Team
            `,
        );

        console.log(
            `Reminder sent to ${bill.client.email} for Bill ${bill._id}`,
        );
    }
});
