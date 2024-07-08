const passport = require("passport");
const { Strategy } = require("passport-local");
const bcrypt = require("bcryptjs");
const {userModel} = require("../models/Schemas")

passport.serializeUser((user,done)=>{
    console.log("serializing user");
    done(null, user._id)
});

passport.deserializeUser(async(_id,done)=>{
    console.log("deserializing");
    try {
        const findUser = await userModel.findById(_id);
        if(!findUser) throw new Error("Not properly logged in") ;
        done(null, findUser)
    } catch (error) {
        console.log(error);
        done(error,null)
        
    }
})

const passportLogin = passport.use(
  new Strategy(async (username, password, done) => {
    console.log("logging with passport");
    try {
        const findUser = await userModel.findOne({username});
        if(!findUser) throw new Error("user not registered");
        const comparePwd = await bcrypt.compare(password,findUser.password);
        if(!comparePwd) throw new Error("bad credentials");
        done(null, findUser)
        
    } catch (error) {
        console.log(error);
        done(error,null)
    }
  })
);

module.exports = passportLogin
