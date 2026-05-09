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

// Load environment variables from .env file
dotenv.config()

// Initialize express application
const app = express();
// Configure Cross-Origin Resource Sharing (CORS)
// Allows requests from specified frontend domains and allows cookies to be sent
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'https://nexus-project-tau.vercel.app' // Add this exact URL from your screenshot
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// Define API routes
app.use("/api/auth", authRouter);       // Authentication routes (login, register, logout, refresh)
app.use("/api/users", profileRouter);   // User profile management routes
app.use("/api/org", orgRouter);         // Organization management routes
app.use("/api/documents", documentsRouter); // Document upload and management routes
app.use("/api/chat", chatRouter);       // Chat interface routes
app.use("/api", adminRouter);           // Admin dashboard routes

// Serve uploaded files statically
app.use("/uploads", express.static("uploads"));

// Create HTTP server instance
const server = createServer(app);

/**
 * Initializes the database connection and starts the express server.
 */
const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connection Established")
        const PORT = process.env.PORT || 5000;
        
        // Listen on all network interfaces
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`)
        })
    }
    catch (err) {
        console.error("Database Establishment error!!!", err);
    }
}

// Start the server application
startServer();
