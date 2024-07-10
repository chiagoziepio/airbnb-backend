const express = require("express");
const router = express.Router()
const {handleGetBookedApartment} = require("../controllers/ApartmentsController")


router.get("/getBookedApartment", handleGetBookedApartment)

module.exports = router