const Document = require("@models/document.model");

// ✅ Create
exports.createDocument = async (req, res) => {
    try {
        console.log("Creating document with data:", req.body);
        const doc = new Document({
            ...req.body,
            uploadedBy: req.userId,
        });
        const saved = await doc.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Read all (non-deleted)
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
        const doc = await Document.findById(req.params.id)
            .populate("case uploadedBy", "title name email");
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
        const updated = await Document.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!updated) {
            return res.status(404).json({ error: "Document not found" });
        }
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
            { new: true }
        );
        if (!deleted) {
            return res.status(404).json({ error: "Document not found" });
        }
        res.json({ message: "Document deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};