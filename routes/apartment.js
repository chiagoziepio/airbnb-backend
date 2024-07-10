const express = require("express");
const router = express.Router()
const {handleCreateApartment, handleGetAllApartment,  handleGetOneApartment,handleBookApartment} = require("../controllers/ApartmentsController")

router.get("/getapartments", handleGetAllApartment)
router.get("/:_id", handleGetOneApartment);

router.post("/createApartment", handleCreateApartment);
router.post("/bookApartment", handleBookApartment)

module.exports = router