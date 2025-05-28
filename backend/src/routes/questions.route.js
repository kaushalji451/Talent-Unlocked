const express = require("express");
const Question = require("../models/questions");
const {UserModel} = require("../models/userModel");
const main = require("../initdb/connectDb");

main()

const questionsRoute = express.Router();

questionsRoute.get("/", async (req, res) => {
  let { userId } = req.query;
  console.log("got it ", userId);
  if (!userId) {
    return res.status(400).json({ message: "No userId provided" });
  }
  try {
    let user = await UserModel.findById(userId);
    let questions = await Question.find({
      questiontype: { $in: ["Aptitude", "Personality Test", user.position] },
    });
    res.status(200).json({ message: "success", questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
})


module.exports = questionsRoute;