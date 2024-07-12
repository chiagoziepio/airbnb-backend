const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const ExSession = require("express-session");
const cookieParser = require("cookie-parser")
const cors =require("cors")
require("dotenv").config()


//initialize
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: [
            "http://localhost:5173"
        ],
        credentials: true
    }
))

app.use(ExSession({
    secret: "paddy naaa",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 60000 * 60
    }
}));

app.use(passport.initialize())
app.use(passport.session())
const PORT = process.env.PORT || 3500

// connection to database
mongoose.connect("mongodb://0.0.0.0/airbnb-project")
const connc = mongoose.connection
connc.once('open',()=>{
    console.log('connected to database');
    app.listen(PORT, ()=>{
        console.log(`app running on port:${PORT}`);
    })
});
connc.on('error',(err)=>{
    console.log(`database error:${err}`);
    process.exit()
})

//routes

app.use("/api/airbnb/user", require("./routes/user"))
app.use("/api/airbnb/apartment", require("./routes/apartment"));
app.use("/api/airbnb/dashboard", require("./routes/dashboard"))