const express = require("express");
const router = express.Router();
const {handleRegister,getLoggedInUser} = require("../controllers/userController");
const passportLogin = require("../middlewares/strategy");
const jwt = require("jsonwebtoken");
const { userModel } = require("../models/Schemas");
const bcrypt = require("bcryptjs");

router.post("/register", handleRegister);
// login route
router.post("/login", async (req, res) => {

  const {username,password} = req.body
  if (!username || !password) return res.status(400).json({msg:"fill all blank"})
  try {
      const findUser = await userModel.findOne({username});
      if(!findUser) return res.status(404).json({msg:"username doesn't exist"})
      const comparedPwd = await bcrypt.compare(password,findUser.password)
      if(!comparedPwd) return res.status(404).json({msg: "password incorrect"})
      const token = jwt.sign(
      { username: findUser.username },
      process.env.SECRET_KEY,
      { expiresIn: "30m" }
      );
      res.cookie("token", token, { httpOnly: true, maxAge: 1800000,secure:true ,sameSite: 'None' });
      return res.status(200).json({ msg: "logged in successfully" });
  } catch (error) {
       return res.status(500).json({msg: "server error ooh"})
  }
 
});
// get logged in user
router.get("/getUser",getLoggedInUser)
router.get("/logout", async(req,res)=>{
  const token = req.cookies.token
  if(!token) return
  res.clearCookie("token",{secure:true ,sameSite: 'None'})
  //res.redirect("/")
  res.status(200).json({msg: "logged out"})
})
module.exports = router; 
