const userModel = require("../models/UserModel");

async function CheckEmail(req, res) {
    try {
        const { email } = req.body;

        const CheckEmail = await userModel.findOne({ email }).select("-password");
        if (!CheckEmail) {
            return res.status(400).json({
                message: "User not exist",
                error: true
            });
        }
        return res.status(200).json({
            message: "Email verified",
            success: true,
            data: CheckEmail
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = CheckEmail;
