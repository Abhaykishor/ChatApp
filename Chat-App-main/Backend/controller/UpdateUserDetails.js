const GetUserDetails = require("../helper/GetUserDetails")
const UserModel = require("../models/UserModel")

async function UpdateUserDetails(req,res){
    try{
       const token = req.cookies.token || ""
       const user = await GetUserDetails(token)
    //    console.log("User ID:", user?._id); 

       const { name,profile_pic} = req.body

       const updateUser = await UserModel.updateOne({_id : user._id},{
            name,
            profile_pic
        })

        // console.log("Update Result:", UpdateUser);

        const userInformation = await UserModel.findById(user._id)
        // console.log("Updated User Information:", UserInformation); 

        return res.json({
            message: "user Update successfully",
            data: userInformation,
            success: true
        })


    }catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true
        })
    }
}

module.exports = UpdateUserDetails