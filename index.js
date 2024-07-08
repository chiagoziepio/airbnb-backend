const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config()


//initialize
const app = express()
app.use(express.json())
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