import express from "express";
import userAuth from "../middleware/userAuth.js";
import ChatSession from "../models/chatSession.js";
import { logAudit } from "../utils/auditLogger.js";

const chatRouter = express.Router();

chatRouter.get("/sessions", userAuth, async (req, res) => {
    try {
        const sessions = await ChatSession.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.send(sessions);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

chatRouter.get("/sessions/:sessionId", userAuth, async (req, res) => {
    try {
        const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
        if (!session) throw new Error("Chat session not found");
        res.send(session);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

chatRouter.post("/sessions", userAuth, async (req, res) => {
    try {
        const session = new ChatSession({
            userId: req.user._id,
            messages: []
        });
        await session.save();
        res.status(201).send(session);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

chatRouter.post("/sessions/:sessionId/messages", userAuth, async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) throw new Error("Message is required");

        const session = await ChatSession.findOne({ _id: req.params.sessionId, userId: req.user._id });
        if (!session) throw new Error("Chat session not found");

        session.messages.push({ role: "user", content: message });
        
        await logAudit(req, "Query Sent", "success", { sessionId: session._id, message });

        // Set up SSE headers
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        // Mock AI response for Phase 1
        const aiResponse = "This is a simulated AI response. The backend is correctly wired up! The token streaming is working perfectly via Server-Sent Events (SSE).";
        
        let i = 0;
        const interval = setInterval(() => {
            if (i < aiResponse.length) {
                res.write(`data: ${JSON.stringify({ token: aiResponse[i] })}\n\n`);
                i++;
            } else {
                clearInterval(interval);
                session.messages.push({ role: "ai", content: aiResponse });
                session.save().then(() => {
                    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
                    res.end();
                });
            }
        }, 30); // Stream each character every 30ms
    } catch (err) {
        if (!res.headersSent) {
            res.status(400).send({ message: err.message });
        }
    }
});

chatRouter.delete("/sessions/:sessionId", userAuth, async (req, res) => {
    try {
        await ChatSession.findOneAndDelete({ _id: req.params.sessionId, userId: req.user._id });
        res.send({ message: "Chat session deleted" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

export default chatRouter;
