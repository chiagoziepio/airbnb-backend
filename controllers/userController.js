const { userModel } = require("../models/Schemas");
const bcrypt = require("bcryptjs");

const handleRegister = async (req, res) => {
  const { name, username, email, password } = req.body;
  if (!name || !username || !email || !password)
    return res.status(400).json({ msg: "fill all blank" });
  const registeredBefore = await userModel.findOne({ username });
  if (registeredBefore)
    return res.status(400).json({ msg: "user already existed" });
  const hashedPwd = await bcrypt.hash(password, 10);
  try {
    const newUser = new userModel({
      name,
      username,
      email,
      password: hashedPwd,
    });
    await newUser.save();
    res.status(201).json({ msg: "Account successfully registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "error registering your account" });
  }
};

module.exports = handleRegister;
