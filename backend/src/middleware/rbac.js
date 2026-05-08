export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).send({ error: "Unauthorized" });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: "Forbidden: You do not have the required clearance tier." });
        }
        
        next();
    };
};
