const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const adminAuth = require("../middlewares/admin.middleware");
const protect = require("../middlewares/auth.middleware");

router.post("/register", authController.register);
router.post("/register-admin", authController.register);
router.post("/login", authController.login);

module.exports = router;
