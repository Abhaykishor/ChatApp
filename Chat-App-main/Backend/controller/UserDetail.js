const GetUserDetails = require("../helper/GetUserDetails");

async function UserDetail(req,res){
    try{
        const token = req.cookies.token|| ""

        const user = await GetUserDetails(token)

        return res.status(200).json({
            message:"user details",
            data: user
        })
    }
    catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = UserDetail