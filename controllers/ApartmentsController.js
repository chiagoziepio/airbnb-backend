const {apartmentModel} = require("../models/Schemas")

const handleCreateApartment = async(req,res)=>{
 const {title, des, rentalprice, img,status,owner,location} = req.body;

 if(!title || !des || !rentalprice || !img || !status|| !owner || !location) return res.status(400).json({msg:"provide the necessary information"})

const duplicateApartment = await apartmentModel.findOne({img})
if(duplicateApartment) return res.status(400).json({msg:"this apartment already registered"})
    try {
        const newApartment = new apartmentModel({
            title,
            des
        })
    } catch (error) {
        
    }
}

module.exports = handleCreateApartment