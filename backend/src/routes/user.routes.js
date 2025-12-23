const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/", protect, userController.getAllUsers);

module.exports = router;
