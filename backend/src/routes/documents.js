import express from "express";
import userAuth from "../middleware/userAuth.js";
import Document from "../models/document.js";
import multer from "multer";
import { logAudit } from "../utils/auditLogger.js";

const documentsRouter = express.Router();
const upload = multer({ dest: "uploads/" });

documentsRouter.get("/", userAuth, async (req, res) => {
    try {
        if (!req.user.organizationId) return res.send([]);
        let query = { organizationId: req.user.organizationId };
        
        if (req.user.role === "guest") {
            query.permissionLevel = "guest";
        } else if (req.user.role === "member") {
            query.permissionLevel = { $in: ["member", "guest"] };
        }
        
        const docs = await Document.find(query)
            .populate("uploadedBy", "name email");
        res.send(docs);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

documentsRouter.post("/upload", userAuth, upload.single("file"), async (req, res) => {
    try {
        if (!req.user.organizationId) throw new Error("Must be in an organization to upload");
        if (req.user.role === "guest") throw new Error("Guests cannot upload documents");
        if (!req.file) throw new Error("No file provided");

        const doc = new Document({
            name: req.file.originalname,
            url: "/uploads/" + req.file.filename,
            size: req.file.size,
            type: req.file.mimetype,
            permissionLevel: req.body.permissionLevel || 'member',
            organizationId: req.user.organizationId,
            uploadedBy: req.user._id
        });

        await doc.save();
        
        await logAudit(req, "File Upload", "success", { documentId: doc._id, name: doc.name });
        
        res.status(201).send(doc);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

documentsRouter.delete("/:documentId", userAuth, async (req, res) => {
    try {
        const doc = await Document.findById(req.params.documentId);
        if (!doc) throw new Error("Document not found");

        if (doc.organizationId.toString() !== req.user.organizationId.toString()) {
            throw new Error("Unauthorized");
        }

        if (req.user.role === "guest") {
            throw new Error("Guests cannot delete documents");
        }

        if (req.user.role === "member" && doc.uploadedBy.toString() !== req.user._id.toString()) {
            throw new Error("Members can only delete their own documents");
        }

        await Document.findByIdAndDelete(req.params.documentId);
        
        await logAudit(req, "Document Deletion", "success", { documentId: req.params.documentId });
        
        res.send({ message: "Document deleted" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

export default documentsRouter;
