const express = require("express");
const router = express.Router()
const handleCreateApartment = require("../controllers/ApartmentsController")

router.post("/createApartment", handleCreateApartment)

module.exports = router