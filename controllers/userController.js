const { userModel } = require("../models/Schemas");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const getLoggedInUser = async(req,res)=>{
  const token = req.cookies.token;
  if(!token) return res.status(401).json({msg:"not logged in"});
  try {
    const decoded = jwt.verify(token,process.env.SECRET_KEY)
    const username = decoded.username;
    const findUser = await userModel.findOne({ username });
    if(!findUser) return res.status(400).json({msg: "invalid token"});
    const neededUserDetail = [{username: findUser.username, email: findUser.email, id: findUser._id}];
        res.status(200).json({user: neededUserDetail})
  } catch (error) {
    console.log(`individual : ${error}`);
    res.status(500).json({msg:error})
  }
}

module.exports = {handleRegister,getLoggedInUser};
