import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import profileRouter from "./routes/profile.js";
import orgRouter from "./routes/org.js";
import documentsRouter from "./routes/documents.js";
import chatRouter from "./routes/chat.js";
import adminRouter from "./routes/admin.js";
import {createServer} from "http";
// import "./utils/cronjob.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()

const app = express();
app.use(cors({
    origin: ["http://localhost:5173", "https://devtinderrr.vercel.app"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/users", profileRouter);
app.use("/api/org", orgRouter);
app.use("/api/documents", documentsRouter);
app.use("/api/chat", chatRouter);
app.use("/api", adminRouter);

app.use("/uploads", express.static("uploads"));

const server = createServer(app);

const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connection Established")
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`)
        })
    }
    catch (err) {
        console.log("Database Establishment error!!!", err);
    }
}

startServer();
