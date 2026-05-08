import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    size: {
        type: Number
    },
    type: {
        type: String
    },
    organizationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    permissionLevel: {
        type: String,
        enum: ['admin', 'member', 'guest'],
        default: 'member'
    }
}, { timestamps: true });

export default mongoose.model("Document", documentSchema);
