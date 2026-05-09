import express from "express";
import { isValid } from "../utils/validation.js";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import userAuth from "../middleware/userAuth.js";
import Organization from "../models/organization.js";
import crypto from "crypto";
import { logAudit } from "../utils/auditLogger.js";

const authRouter = express.Router();

/**
 * POST /api/auth/register
 * Register a new user and either join an existing organization (using an invite code)
 * or create a new one.
 * Logs an audit event upon success.
 */
authRouter.post("/register", async (req, res) => {
    try {
        isValid(req);

        const { name, email, password, orgAction, inviteCode, orgName } = req.body;

        let orgId = null;
        let role = "member";

        if (orgAction === "join") {
            if (!inviteCode) throw new Error("Invite code is required to join an organization");
            const org = await Organization.findOne({ inviteCode });
            if (!org) throw new Error("Invalid invite code");
            orgId = org._id;
        } else if (orgAction === "create") {
            if (!orgName) throw new Error("Organization name is required");
            role = "admin";
        }

        const user = new User({
            name,
            email,
            password,
            role,
            organizationId: orgId
        });

        const savedUser = await user.save();

        if (orgAction === "create") {
            const org = new Organization({
                name: orgName,
                inviteCode: "NXS-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
                createdBy: savedUser._id
            });
            const savedOrg = await org.save();
            savedUser.organizationId = savedOrg._id;
            await savedUser.save();
        }

        const accessToken = await savedUser.getJWT();
        const refreshToken = await savedUser.getRefreshToken();

        // create a cookie with jwt tokens
        res.cookie("accessToken", accessToken, {
            expires: new Date(Date.now() + 24 * 3600000), // 1 day expiration
            httpOnly: true,
            secure: true,
            sameSite:"none",
        });
        res.cookie("refreshToken", refreshToken, {
            expires: new Date(Date.now() + 7 * 24 * 3600000), // 7 days expiration
            httpOnly: true,
            secure: true,
            sameSite:"none",
        });
        
        req.user = savedUser; // Set req.user for audit logger
        await logAudit(req, "Register", "success");
        
        res.status(200).send({ message: "Created User Successfully!!!", user: savedUser, accessToken });
    }
    catch (error) {
        res.status(400).send({ message: error.message });
    }
})

/**
 * POST /api/auth/login
 * Authenticate a user and set JWT cookies for session management.
 * Logs an audit event upon success.
 */
authRouter.post("/login", async (req, res) => {
    try {
        isValid(req);

        const { email, password } = req.body;

        const dbUser = await User.findOne({ email: email });

        if (!dbUser) throw new Error("User not found with this email!!");

        const isValidUser = await dbUser.validatePassword(password);

        if (isValidUser) {
            const accessToken = await dbUser.getJWT();
            const refreshToken = await dbUser.getRefreshToken();

            res.cookie("accessToken", accessToken, {
                expires: new Date(Date.now() + 24 * 3600000),
                httpOnly: true,
                secure: true,
                sameSite:"none",
            });
            res.cookie("refreshToken", refreshToken, {
                expires: new Date(Date.now() + 7 * 24 * 3600000),
                httpOnly: true,
                secure: true,
                sameSite:"none",
            });
            
            req.user = dbUser;
            await logAudit(req, "Login", "success");
            
            res.send({ user: dbUser, accessToken });
        }
        else {
            res.status(401).send({ message: "Invalid Credentials!!" });
        }

    }
    catch (err) {
        res.status(400).send({ message: err.message });
    }
})

/**
 * POST /api/auth/logout
 * Log a user out by clearing their JWT cookies.
 * Requires userAuth middleware.
 * Logs an audit event upon success.
 */
authRouter.post("/logout", userAuth, async (req, res) => {
    await logAudit(req, "Logout", "success");
    
    // Invalidate cookies
    res.cookie("accessToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite:"none",
    });
    res.cookie("refreshToken", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
        secure: true,
        sameSite:"none",
    })
    .send("Logout Successfull!!");
});

/**
 * POST /api/auth/refresh
 * Refresh the access token using a valid refresh token cookie.
 */
authRouter.post("/refresh", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const decodedToken = jsonwebtoken.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET);
        const { Userid } = decodedToken;

        const user = await User.findById(Userid);
        if (!user) throw new Error("User not found");

        const newAccessToken = await user.getJWT();
        
        res.cookie("accessToken", newAccessToken, {
            expires: new Date(Date.now() + 24 * 3600000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        res.send({ accessToken: newAccessToken });
    } catch (error) {
        res.status(401).send({ error: "Invalid refresh token" });
    }
});

/**
 * GET /api/auth/me
 * Fetch the currently authenticated user's details.
 * Requires userAuth middleware.
 */
authRouter.get("/me", userAuth, (req, res) => {
    res.send({ user: req.user });
});

export default authRouter;