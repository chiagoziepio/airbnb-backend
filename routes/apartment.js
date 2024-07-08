const express = require("express");
const router = express.Router()
const {handleCreateApartment, handleGetAllApartment} = require("../controllers/ApartmentsController")

router.get("/getapartments", handleGetAllApartment)

router.post("/createApartment", handleCreateApartment)

module.exports = router