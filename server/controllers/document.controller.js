const Document = require("@models/document.model");
const logAudit = require("@middleware/auditLog.middleware.js");
const Case = require("@models/case.model");
const User = require("@models/user.model.js");

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
        const documents = await Document.find({ isDeleted: false })
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

        res.json(updated);
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
