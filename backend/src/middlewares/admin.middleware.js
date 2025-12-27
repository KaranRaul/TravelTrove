const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, 'secret' || process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");

            if (req.user && req.user.role === "admin") {
                next();
            } else {
                res.status(403).json({ error: "Forbidden: Admins only" });
            }
        } catch (error) {
            res.status(401).json({ error: "Unauthorized" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Unauthorized: No token provided" });
    }
};

module.exports = adminAuth;