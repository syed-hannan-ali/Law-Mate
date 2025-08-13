const cron = require("node-cron");
const axios = require("axios");
const Document = require("@models/document.model");

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

            const signatureRequest = res.data.signature_request;

            // 2. Check if complete
            if (signatureRequest.is_complete) {
                console.log(`✅ Document ${doc._id} is fully signed.`);

                // Update document in MongoDB
                doc.esignStatus = "signed";

                await doc.save();
            }
        }
    } catch (err) {
        console.error("Error updating signed documents:", err.message);
    }
}

// Runs every 30 seconds
cron.schedule(" */5 * * * *", () => {
    console.log("Running document status check:", new Date().toISOString());
    updateSignedDocumentsStatus();
});
