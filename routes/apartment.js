const express = require("express");
const router = express.Router()
const {handleCreateApartment, handleGetAllApartment,  handleGetOneApartment} = require("../controllers/ApartmentsController")

router.get("/getapartments", handleGetAllApartment)
router.get("/:_id", handleGetOneApartment)

router.post("/createApartment", handleCreateApartment)

module.exports = router