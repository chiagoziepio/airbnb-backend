const express = require("express");
const router = express.Router();
const {handleRegister,getLoggedInUser} = require("../controllers/userController");
const passportLogin = require("../middlewares/strategy");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {userModel} = require("../models/Schemas")

router.post("/register", handleRegister);
// login route
router.post("/login", async (req, res) => {
  /* console.log(`form auth:${req.user}`); */
  const {username, password} = req.body
  if(!username || !password) return res.status(400).json({msg: "Fill all blanks"})
    try {
      const findUser = await userModel.findOne({username});
      if(!findUser) return res.status(404).json({msg: "user not registered"})
      const comparePwd = await bcrypt.compare(password, findUser.password)
      if(!comparePwd) return res.status(404).json({msg: "incorrect password"});
      const token = jwt.sign(
        { username: findUser.username },
        process.env.SECRET_KEY,
        { expiresIn: "30m" }
      );
      console.log(token);
      res.cookie("token", token, { httpOnly: true, maxAge: 1800000 });
      return res.status(200).json({ msg: "logged in successfully" });
    } catch (error) {
      res.status(500).json({msg: `this one pass me ooh`})
    }


  
 /*  console.log(req.sessionID);
  req.session.visited = true; */
  
});
// get logged in user
router.get("/getUser",getLoggedInUser)
module.exports = router;
