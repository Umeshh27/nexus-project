import express from "express";
import userAuth from "../middleware/userAuth.js";
import { validateEditProfileData } from "../utils/validation.js";
import { logAudit } from "../utils/auditLogger.js";

const profileRouter = express.Router();

profileRouter.get("/profile/view" ,userAuth , (req, res) => {
    try{
        const user = req.user;
        res.status(200).send(user);
    }
    catch(err){
        res.status(401).send("Error : " + err.message);
    }
})

profileRouter.put("/profile", userAuth, async (req, res) => {
    try{
        if(!validateEditProfileData(req))throw new Error("Validation Failed bro!");
        const loggedInUser = req.user;
        
        // Object.keys(req.body).forEach((key) => loggedInUser[key] = req.body[key]);
        Object.assign(loggedInUser, req.body);
        await loggedInUser.save();

        res.send(req.user);
        
        await logAudit(req, "Profile Update", "success");

    }
    catch(err){
    console.error(err); // Look at your terminal/console where the server is running
    res.status(400).json({ message: err.message, errors: err.errors });
    }
})

profileRouter.put("/password", userAuth, async (req, res) => {
    try{
        const { currentPassword, newPassword } = req.body;
        const currUser = req.user;
        
        if(!currentPassword || !newPassword){
            throw new Error("Both currentPassword and newPassword are required");
        }
        
        const isValidPassword = await currUser.validatePassword(currentPassword);
        if(!isValidPassword)throw new Error("Entered password is wrong");

        const isSame = await currUser.validatePassword(newPassword);
        if (isSame) throw new Error("New password must be different from current password");

        currUser.password = newPassword;
        await currUser.save();

        res.status(200).send("Password Updated Successfully!!!");
        
        await logAudit(req, "Password Update", "success");
    }
    catch(err){
        res.status(400).send("Error : " + err);
    }
})

profileRouter.delete("/account", userAuth, async (req, res) => {
    try {
        await req.user.deleteOne();
        await logAudit(req, "Account Deletion", "success");
        
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