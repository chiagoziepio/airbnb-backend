const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
    name:{
        type: mongoose.Schema.Types.String,
        required:true
    },
    username:{
        type: mongoose.Schema.Types.String,
        required:true,
        unique: true
    },
    email:{
        type: mongoose.Schema.Types.String,
        required:true,
        unique: true
    },
    password:{
        type: mongoose.Schema.Types.String,
        required:true,
       
    },
    bookedApartment:[{
        type: mongoose.Schema.Types.ObjectId
    }

    ]
})

const userModel = mongoose.model("user", UserSchema)

module.exports = userModel