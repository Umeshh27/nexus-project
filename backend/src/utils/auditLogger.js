import AuditLog from "../models/auditLog.js";

export const logAudit = async (req, action, result = "success", details = {}) => {
    try {
        if (!req.user) return;
        
        const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        
        const log = new AuditLog({
            userId: req.user._id,
            organizationId: req.user.organizationId,
            action,
            ipAddress,
            result,
            details
        });
        
        await log.save();
    } catch (error) {
        console.error("Audit Logging Error:", error);
    }
};
