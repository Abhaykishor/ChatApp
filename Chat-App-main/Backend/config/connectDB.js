const mongoose = require("mongoose");

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (error) => { // Added 'error' parameter
            console.log("DB connection failed", error);
        });
    } catch (error) {
        console.log("Something is wrong", error);
    }
}

module.exports = connectDB;