const { apartmentModel, userModel } = require("../models/Schemas");
const jwt = require("jsonwebtoken");

const handleCreateApartment = async (req, res) => {
  console.log(req.cookies);
  const token = req.cookies.token;
  if (!token)
    res.status(401).json({ msg: "must be logged in to list an apartment" });
  const { title, des, rentalPrice, img, status, location } = req.body;

  if (!title || !des || !rentalPrice || !img || !status || !location)
    return res.status(400).json({ msg: "provide the necessary information" });

  const duplicateApartment = await apartmentModel.findOne({ img });
  if (duplicateApartment)
    return res.status(400).json({ msg: "this apartment already registered" });
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
    });
    newApartment.save();
    res.status(201).json({ msg: "apartment listed", newApartment });
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
module.exports = {
  handleCreateApartment,
  handleGetAllApartment,
  handleGetOneApartment,
  handleBookApartment,
};
