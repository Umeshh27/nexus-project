import jsonwebtoken from "jsonwebtoken"
import User from "../models/user.js";

const userAuth = async (req, res, next) => {
    try {
        const jwt = req.cookies.accessToken;
        if (!jwt) {
            throw new Error("Invalid Token");
        }
        const decodedToken = jsonwebtoken.verify(jwt, process.env.JWT_SECRET);
        const { Userid } = decodedToken;

        const user = await User.findById(Userid);
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).send("Auth Error : " + error);
    }
}

export default userAuth;