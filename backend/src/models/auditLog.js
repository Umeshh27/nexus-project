import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization"
    },
    action: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String
    },
    result: {
        type: String,
        enum: ["success", "failure"],
        default: "success"
    },
    details: {
        type: mongoose.Schema.Types.Mixed
    }
}, { timestamps: true });

export default mongoose.model("AuditLog", auditLogSchema);
