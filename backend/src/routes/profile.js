import express from "express";
import userAuth from "../middleware/userAuth.js";
import { validateEditProfileData } from "../utils/validation.js";
import { logAudit } from "../utils/auditLogger.js";

const profileRouter = express.Router();

/**
 * GET /api/users/profile/view
 * Fetch the authenticated user's profile information.
 * Requires userAuth middleware.
 */
profileRouter.get("/profile/view" ,userAuth , (req, res) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    }
    catch(err){
        res.status(401).send("Error : " + err.message);
    }
})

/**
 * PUT /api/users/profile
 * Update the authenticated user's profile details (e.g., name, photoURL).
 * Validates request data before applying updates.
 * Logs an audit event upon success.
 */
profileRouter.put("/profile", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req))throw new Error("Validation Failed bro!");
        const loggedInUser = req.user;
        
        // Assign new values to the logged-in user instance
        // Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        Object.assign(loggedInUser, req.body);
        await loggedInUser.save();

        res.send(req.user);
        
        // Log the profile update action for auditing
        await logAudit(req, "Profile Update", "success");

    }
    catch(err){
    console.error("Profile update error:", err); // Look at your terminal/console where the server is running
    res.status(400).json({ message: err.message, errors: err.errors });
    }
})

/**
 * PUT /api/users/password
 * Change the authenticated user's password.
 * Requires verifying the current password before setting a new one.
 * Logs an audit event upon success.
 */
profileRouter.put("/password", userAuth, async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const currUser = req.user;
        
        if(!currentPassword || !newPassword){
            throw new Error("Both currentPassword and newPassword are required");
        }
        
        // Verify current password is correct
        const isValidPassword = await currUser.validatePassword(currentPassword);
        if(!isValidPassword)throw new Error("Entered password is wrong");

        // Prevent setting the same password
        const isSame = await currUser.validatePassword(newPassword);
        if (isSame) throw new Error("New password must be different from current password");

        // Update to new password
        currUser.password = newPassword;
        await currUser.save();

        res.status(200).send("Password Updated Successfully!!!");
        
        await logAudit(req, "Password Update", "success");
    }
    catch(err){
        res.status(400).send("Error : " + err);
    }
})

/**
 * DELETE /api/users/account
 * Delete the authenticated user's account and clear their session cookies.
 * Logs an audit event upon success.
 */
profileRouter.delete("/account", userAuth, async (req, res) => {
    try {
        // Delete user record from database
        await req.user.deleteOne();
        await logAudit(req, "Account Deletion", "success");
        
        // Invalidate auth cookies
        res.cookie("accessToken", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.cookie("refreshToken", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).send({ message: "Account deleted successfully" });
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

export default profileRouter;