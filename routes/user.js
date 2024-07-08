const express = require("express")
const router = express.Router();
const handleRegister = require("../controllers/userController");

router.post("/register", handleRegister)

module.exports = router