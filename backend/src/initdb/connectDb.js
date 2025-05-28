const mongoose = require('mongoose');

const dotenv = require("dotenv");
dotenv.config();

const main = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("connected to DB");
};
module.exports = main;