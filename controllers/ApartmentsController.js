const mongoose = require("mongoose");
const { apartmentModel, userModel } = require("../models/Schemas");
const jwt = require("jsonwebtoken");

const handleCreateApartment = async (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token)
    res.status(401).json({ msg: "must be logged in to list an apartment" });
  const { title, des, rentalPrice, status, location,bed,room,bathroom } = req.body;
  
  if (!title || !des || !rentalPrice || !status || !location || !bed || !room || !bathroom)
    return res.status(400).json({ msg: "provide the necessary information" });
 const convertedBathroom = Number(bathroom)
 const convertedRoom = Number(room)
  const convertedBed = Number(bed)
  const ImgArray = [
    "https://i.pinimg.com/564x/5f/61/c4/5f61c42c564b8d32ec2831269d133962.jpg",
    "https://i.pinimg.com/236x/2c/55/21/2c5521af4bfbd2d545c388de165b9bb8.jpg",
    "https://i.pinimg.com/236x/6b/60/a1/6b60a17968faa55c574073f56c9065dd.jpg",
    "https://i.pinimg.com/236x/e1/b8/d6/e1b8d6d0b6553dfb107ea30b241e8ffc.jpg",
    "https://i.pinimg.com/236x/d5/dd/e9/d5dde97c93285ba636019e4806c9eb64.jpg",
    "https://i.pinimg.com/236x/08/3d/f9/083df955784693efb30f244d0f4c1661.jpg",
    "https://i.pinimg.com/236x/bd/dc/ad/bddcad619e61cc43c2080493dfa6bc7c.jpg",
    "https://i.pinimg.com/236x/58/77/b0/5877b0fedb69a2bf53006ecca2c512bb.jpg",
    "https://i.pinimg.com/474x/a2/a0/ed/a2a0ed326ddf95f0f7a358076fe668c0.jpg",
    "https://i.pinimg.com/236x/cd/52/84/cd52842bde72bffe7ffa1f4a0b2ce1cd.jpg",
    "https://i.pinimg.com/236x/d9/56/ca/d956ca6573763180714fc6edc14f0fdb.jpg",
    "https://i.pinimg.com/236x/19/aa/6d/19aa6da8f3293efff60501c9b50bb406.jpg",
  ];
  const randomImg = Math.floor(Math.random() * ImgArray.length);
  let img = ImgArray[randomImg];

  /*const duplicateApartment = await apartmentModel.findOne({ img });
   if (duplicateApartment.rentalPrice === rentalPrice) 
    return res.status(200).json({ msg: duplicateApartment });*/
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  console.log(decoded);
  const username = decoded.username;

  try {
    const lister = await userModel.findOne({ username });
    if (!lister) res.status(401).json({ msg: "invalid token" });
    const newApartment = new apartmentModel({
      title,
      des,
      rentalPrice,
      img,
      status,
      location,
      owner: lister._id,
      bed:convertedBed,
      room: convertedRoom,
      bathroom: convertedBathroom
    });
    newApartment.save();
    res.status(201).json({ msg: "apartment listed" });
  } catch (error) {
    console.log(`error listing apartment :${error}`);
    res.status(500).json({ msg: error });
  }
};
const handleGetAllApartment = async (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) return res.status(401).json({ msg: "not Logged in" });
    const AllApartment = await apartmentModel.find();
    res.status(200).json({ msg: AllApartment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "cant get apartments" });
  }
};
const handleGetOneApartment = async (req, res) => {
  const { _id } = req.params;
  try {
    const findApartment = await apartmentModel.findById(_id);
    if (!findApartment) return res.status(404).json({ msg: "not a valid id" });
    res.status(200).json({ msg: findApartment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error getting the apartment" });
  }
};
const handleBookApartment = async (req, res) => {
  const { _id } = req.body;
  console.log(_id);
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "not logged in" });
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  console.log(decoded);
  const username = decoded.username;
  try {
    const findUser = await userModel.findOne({ username });
    if (!findUser) return res.status(404).json({ msg: "invalid token" });
    const findApartment = await apartmentModel.findById(_id);
    if (!findApartment)
      return res.status(404).json({ msg: "apartment not found" });
    if (findUser.bookedApartment.includes(findApartment.id))
      return res
        .status(400)
        .json({ msg: "This apartment has been booked by you" });
    findUser.bookedApartment.push(findApartment.id);
    console.log("pushed");
    await findUser.save();
    res.status(200).json({ msg: "apartment succefully booked" });
  } catch (error) {
    console.log(`error booking apartment:${error}`);
    res.status(500).json({ msg: "couldn't booked apartment" });
  }
};
const handleGetBookedApartment = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "not logged in" });
  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  console.log(decoded);
  const username = decoded.username;
  try {
    const findUser = await userModel.findOne({ username });
    if (!findUser) return res.status(404).json({ msg: "invalid token" });
    const bookedApartment = findUser.bookedApartment;

    const apartment = await apartmentModel.find({
      _id: { $in: bookedApartment },
    });
    return res.status(200).json({ msg: apartment });
  } catch (error) {
    console.log(`getting booked apartment error : ${error}`);
    res.status(500).json({ msg: error });
  }
};
module.exports = {
  handleCreateApartment,
  handleGetAllApartment,
  handleGetOneApartment,
  handleBookApartment,
  handleGetBookedApartment,
};
