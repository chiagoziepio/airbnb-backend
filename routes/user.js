const express = require("express");
const router = express.Router();
const {handleRegister,getLoggedInUser} = require("../controllers/userController");
const passportLogin = require("../middlewares/strategy");
const jwt = require("jsonwebtoken");

router.post("/register", handleRegister);
// login route
router.post("/login", passportLogin.authenticate("local"), async (req, res) => {
  console.log(`form auth:${req.user}`);

  const token = jwt.sign(
    { username: req.user.username },
    process.env.SECRET_KEY,
    { expiresIn: "30m" }
  );
  console.log(token);
  res.cookie("token", token, { httpOnly: true, maxAge: 1800000 });
  console.log(req.sessionID);
  req.session.visited = true;
  return res.status(200).json({ msg: "logged in successfully" });
});
// get logged in user
router.get("/getUser",getLoggedInUser)
module.exports = router;
