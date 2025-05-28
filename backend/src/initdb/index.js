const dotenv = require("dotenv");
const { data } = require("./data");
const Question = require("../models/questions");

dotenv.config();
const main = require("./connectDb");
main();

const initDb = async () => {
    try {
        const inserted = await Question.insertMany(data);
        if (inserted.length === 0) {
            console.log("No data was inserted");
        } else {
            console.log("Data was inserted successfully");
        }
        console.log(inserted);
    } catch (err) {
        console.error("Error inserting data:", err);
    }
};

initDb();
