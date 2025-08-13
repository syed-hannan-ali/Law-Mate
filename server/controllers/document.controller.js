const Document = require("@models/document.model");
const logAudit = require("@middleware/auditLog.middleware.js");
const Case = require("@models/case.model");
const User = require("@models/user.model.js");
const axios = require("axios");
const FormData = require("form-data");

exports.createDocument = async (req, res) => {
    try {
        console.log("Creating document with data:", req.body);

        const { caseId, title, ...rest } = req.body;

        const relatedCase = await Case.findById(caseId);
        if (!relatedCase) {
            return res.status(404).json({ error: "Related case not found" });
        }

        // File details from multer-s3
        const fileUrl = req.file.location; // S3 public URL
        const fileKey = req.file.key; // S3 object key
        const mimeType = req.file.mimetype; // File MIME type
        const size = req.file.size; // Size in bytes

        const doc = new Document({
            title,
            case: caseId,
            uploadedBy: req.userId,
            mimeType,
            sizeInBytes: size,
            originalName: req.file.originalname,
            fileUrl,
            fileKey,
            ...rest,
        });

        const saved = await doc.save();

        const user = await User.findById(req.userId);

        // Audit log
        await logAudit({
            user: user,
            action: "UPLOAD_DOCUMENT",
            target: "Document",
            description: `User ${user.username} uploaded document "${title}" to case ${caseId}`,
            metadata: {
                documentId: saved._id,
                caseId: caseId,
                title: title,
            },
        });

        res.status(201).json(saved);
    } catch (err) {
        console.error("Error creating document:", err);
        res.status(400).json({ error: err.message });
    }
};

exports.getAllDocuments = async (req, res) => {
    try {
        const userId = req.userId;
        const cases = await Case.find({ assignedStaff: userId });
        const caseIds = cases.map((caseDoc) => caseDoc._id);

        const documents = await Document.find({
            isDeleted: false,
            case: { $in: caseIds },
        })
            .populate("case uploadedBy", "title name email")
            .sort({ createdAt: -1 });
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Read by ID
exports.getDocumentById = async (req, res) => {
    try {
        const doc = await Document.findById(req.params.id).populate(
            "case uploadedBy",
            "title name email",
        );
        if (!doc || doc.isDeleted) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;

        const updated = await Document.findOneAndUpdate(
            { _id: documentId, isDeleted: false },
            {
                ...req.body,
                updatedBy: req.userId, // Assuming you're tracking who last updated
            },
            { new: true },
        );

        if (!updated) {
            return res.status(404).json({ error: "Document not found" });
        }

        const user = await User.findById(req.userId);

        await logAudit({
            user: user,
            action: "UPDATE_DOCUMENT",
            target: "Document",
            description: `Document ${updated._id} was updated by ${user.username}`,
            metadata: {
                documentId: updated._id,
                updatedFields: req.body,
            },
        });

        res.status(200).json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const deleted = await Document.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true },
            { new: true },
        );

        if (!deleted) {
            return res.status(404).json({ error: "Document not found" });
        }

        const user = await User.findById(req.userId);

        // Log audit
        await logAudit({
            user: user,
            action: "DELETE_DOCUMENT",
            target: "Document",
            description: `Document ${deleted._id} was soft-deleted by ${user.username}`,
            metadata: {
                documentId: deleted._id,
                deletedAt: new Date(),
            },
        });

        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.requestSignature = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { signers, subject, message } = req.body;

        console.log("Requesting signature for document:", documentId);
        console.log("Signers:", signers);
        console.log("Subject:", subject);
        console.log("Message:", message);

        const doc = await Document.findById(documentId);
        if (!doc) {
            return res.status(404).json({ error: "Document not found" });
        }

        console.log("Document found:", doc);

        // Prepare Dropbox Sign API request

        const form = new FormData();

        form.append("title", doc.title);
        form.append("subject", subject || `Please sign: ${doc.title}`);
        form.append(
            "message",
            message || "Please review and sign this document.",
        );

        signers.forEach((s, i) => {
            form.append(`signers[${i}][email_address]`, s.email);
            form.append(`signers[${i}][name]`, s.name);
            form.append(`signers[${i}][order]`, i);
        });

        form.append("file_url[]", doc.fileUrl);

        // Add metadata
        form.append("metadata[documentId]", doc._id.toString());
        form.append("metadata[caseId]", doc.case.toString());

        form.append("signing_options[draw]", "0");
        form.append("signing_options[type]", "1");
        form.append("signing_options[upload]", "0");
        form.append("signing_options[phone]", "0");
        form.append("signing_options[default_type]", "type");

        form.append("test_mode", "1"); // must be integer

        console.log("Form data prepared for Dropbox Sign API:", form);

        const DROPBOXSIGN_API_KEY = process.env.DROPBOX_API_KEY;

        // Send signature request
        // 3. Send request to Dropbox Sign API
        const response = await axios.post(
            "https://api.hellosign.com/v3/signature_request/send",
            form,
            {
                auth: { username: DROPBOXSIGN_API_KEY, password: "" },
            },
        );

        const result = response.data;

        console.log("Dropbox Sign response:", result);

        // 4. Update document in DB
        doc.esignProvider = "dropboxsign";
        doc.esignRequestId = result.signature_request.signature_request_id;
        doc.esignStatus = "pending";
        await doc.save();

        console.log("Document updated with e-signature info:", doc);

        res.status(200).json({
            message: "E-signature request sent successfully",
            requestId: result.signature_request.signature_request_id,
            data: result,
        });
    } catch (error) {
        console.error("Dropbox Sign Error:", error.body || error);
        res.status(500).json({ success: false, error: error.body || error });
    }
};


