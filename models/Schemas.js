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


const ApartmentSchema = mongoose.Schema({
    title:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    location:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    des:{
        type: mongoose.Schema.Types.String,
        required: true
    },
    rentalPrice:{
        type: mongoose.Schema.Types.Number,
        required: true
    },
    img:{
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    status:{
        type: mongoose.Schema.Types.String,
        required: true,
       
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
       
    },
    listedDate:{
        type: Date,
        default: Date.now,
        required: true,
       
    },

})

const apartmentModel = mongoose.model("apartment", ApartmentSchema)

module.exports = {userModel, apartmentModel}