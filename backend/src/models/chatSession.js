import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ["user", "ai"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const chatSessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String, default: "New Chat Session" },
    messages: [messageSchema]
}, { timestamps: true });

export default mongoose.model("ChatSession", chatSessionSchema);
