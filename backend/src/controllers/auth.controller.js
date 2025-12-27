const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


// REGISTER (hash password here)
exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        if (username) {
            const existingUsername = await User.findOne({ username });
            if (existingUsername) {
                return res.status(400).json({ error: "Username is already taken" });
            }
        }

        let role = "user";
        if (req.route.path === "/register-admin") {
            role = "admin";
        }


        // 🔐 HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role,
        });

        const token = generateToken(newUser._id, newUser.role);


        res.status(201).json({
            message: "User created successfully",
            token,
        });
    } catch (error) {
        next(error);
    }
};

// LOGIN (compare here)
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 🔐 COMPARE HERE
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};
