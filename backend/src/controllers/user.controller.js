const User = require("../models/User");

// GET ALL USERS (FOR CHAT)
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.user._id } },
            "email"
        );

        res.status(200).json({ users });
    } catch (error) {
        next(error);
    }
};
