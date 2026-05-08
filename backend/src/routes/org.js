import express from "express";
import userAuth from "../middleware/userAuth.js";
import Organization from "../models/organization.js";
import User from "../models/user.js";
import crypto from "crypto";

const orgRouter = express.Router();

orgRouter.get("/", userAuth, async (req, res) => {
    try {
        if (!req.user.organizationId) return res.status(404).send({ message: "No organization found" });
        const org = await Organization.findById(req.user.organizationId);
        res.send(org);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

orgRouter.post("/create", userAuth, async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) throw new Error("Organization name is required");

        const org = new Organization({
            name,
            inviteCode: "NXS-" + crypto.randomBytes(3).toString("hex").toUpperCase(),
            createdBy: req.user._id
        });
        const savedOrg = await org.save();

        req.user.organizationId = savedOrg._id;
        req.user.role = "admin";
        await req.user.save();

        res.status(201).send(savedOrg);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

orgRouter.post("/join", userAuth, async (req, res) => {
    try {
        const { inviteCode } = req.body;
        if (!inviteCode) throw new Error("Invite code is required");

        const org = await Organization.findOne({ inviteCode });
        if (!org) throw new Error("Invalid invite code");

        req.user.organizationId = org._id;
        await req.user.save();

        res.send(org);
    } catch (err) {
        res.status(400).send({ message: err.message });
    }
});

export default orgRouter;
