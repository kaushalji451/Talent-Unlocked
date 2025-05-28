const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const dotenv = require("dotenv");
dotenv.config();
const candidatesRoute = require("./routes/candidates.route");
const authRouter = require("./routes/auth.route");
const exportRoute = require("./routes/export.route");
const uploadCvRoute = require("./routes/uploadCv.route");
const questionsRoute = require("./routes/questions.route");
const scoreRoute = require("./routes/score.route");
const sendemailRoute = require("./routes/sendEmail.route");

// app.use(cors({
//   origin: process.env.CLIENT_URL,
// }));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use("/candidates", candidatesRoute);
app.use("/auth", authRouter);
app.use("/candidate",uploadCvRoute);
app.use("/export",exportRoute);
app.use("/questions",questionsRoute);
app.use("/score",scoreRoute);
app.use("/sendEmail",sendemailRoute);



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
