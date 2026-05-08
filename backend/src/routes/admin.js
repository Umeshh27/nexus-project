import express from "express";
import userAuth from "../middleware/userAuth.js";
import User from "../models/user.js";
import Document from "../models/document.js";
import Organization from "../models/organization.js";
import AuditLog from "../models/auditLog.js";
import { logAudit } from "../utils/auditLogger.js";

const adminRouter = express.Router();

// Middleware to ensure user is admin
const adminAuth = async (req, res, next) => {
    if (req.user.role !== "admin") return res.status(403).send({ message: "Admin access required" });
    next();
};

adminRouter.get("/admin/stats", userAuth, adminAuth, async (req, res) => {
    try {
        const orgId = req.user.organizationId;
        const usersCount = await User.countDocuments({ organizationId: orgId });
        const docsCount = await Document.countDocuments({ organizationId: orgId });
        
        res.send({
            totalUsers: usersCount,
            totalDocuments: docsCount,
            activeChats: 0
        });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.get("/admin/users", userAuth, adminAuth, async (req, res) => {
    try {
        const users = await User.find({ organizationId: req.user.organizationId });
        res.send(users);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.patch("/admin/users/:userId/role", userAuth, adminAuth, async (req, res) => {
    try {
        const { role } = req.body;
        const targetUser = await User.findOne({ _id: req.params.userId, organizationId: req.user.organizationId });
        if (!targetUser) throw new Error("User not found");
        
        targetUser.role = role;
        await targetUser.save();
        
        await logAudit(req, "Role Change", "success", { targetUserId: targetUser._id, newRole: role });
        
        res.send(targetUser);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.patch("/admin/users/:userId/deactivate", userAuth, adminAuth, async (req, res) => {
    try {
        const targetUser = await User.findOne({ _id: req.params.userId, organizationId: req.user.organizationId });
        if (!targetUser) throw new Error("User not found");
        
        // Mock deactivate by clearing org
        targetUser.organizationId = null;
        await targetUser.save();
        
        await logAudit(req, "User Deactivation", "success", { targetUserId: targetUser._id });
        
        res.send({ message: "User deactivated" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.get("/admin/documents", userAuth, adminAuth, async (req, res) => {
    try {
        const docs = await Document.find({ organizationId: req.user.organizationId }).populate("uploadedBy", "name email");
        res.send(docs);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.delete("/admin/documents/:documentId", userAuth, adminAuth, async (req, res) => {
    try {
        await Document.findOneAndDelete({ _id: req.params.documentId, organizationId: req.user.organizationId });
        
        await logAudit(req, "Admin Document Deletion", "success", { documentId: req.params.documentId });
        
        res.send({ message: "Document deleted" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.get("/admin/invites", userAuth, adminAuth, async (req, res) => {
    try {
        const org = await Organization.findById(req.user.organizationId);
        res.send([{ code: org.inviteCode, role: "user", status: "active", createdAt: org.createdAt }]);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.post("/admin/invites", userAuth, adminAuth, async (req, res) => {
    try {
        // Just return the same invite code for now
        const org = await Organization.findById(req.user.organizationId);
        res.send({ code: org.inviteCode, role: "user", status: "active" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

adminRouter.post("/admin/invites/send", userAuth, adminAuth, async (req, res) => {
    res.send({ message: "Invite sent successfully" });
});

adminRouter.get("/audit/logs", userAuth, adminAuth, async (req, res) => {
    try {
        const { startDate, endDate, userId } = req.query;
        let query = { organizationId: req.user.organizationId };
        
        if (userId) query.userId = userId;
        if (startDate && endDate) {
            query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const logs = await AuditLog.find(query)
            .populate("userId", "name email")
            .sort({ createdAt: -1 })
            .limit(100);
            
        const total = await AuditLog.countDocuments(query);
        res.send({ logs, total });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

export default adminRouter;
