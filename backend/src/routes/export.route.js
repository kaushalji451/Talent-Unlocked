const express = require("express");
const exportRoute = express.Router();
const connectDb = require("../initdb/connectDb");
const {UserModel} = require("../models/userModel");
const PDFDocument = require("pdfkit");
const axios = require("axios");

connectDb();
async function createPDF(users, res) {
  const doc = new PDFDocument({ margin: 30 });

  // Set response headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=users.pdf");

  doc.pipe(res);

  doc.fontSize(20).text("User Report", { align: "center" }).moveDown();

  for (const user of users) {
    doc
      .fontSize(14)
      .text(`Name: ${user.username}`, { marginTop: 10 })
      .text(`Email: ${user.email}`)
      .text(`Status: ${user.status || "N/A"}`)
      .text(`AI Rating: ${user.aiRating || "N/A"}`)
      .text(`Applied On: ${new Date(user.appliedOn).toDateString()}`)
      .text(`Tag: ${user.tag || "N/A"}`)
      .text(`CV URL: ${user.cvUrl || "Not Provided"}`);

    doc
      .moveDown(2)
      .moveTo(doc.x, doc.y)
      .lineTo(550, doc.y)
      .stroke()
      .moveDown(1);
  }

  doc.end();
}

// Route to generate PDF and send to client
exportRoute.get("/", async (req, res) => {
  try {
    const users = await UserModel.find();
    console.log("Users fetched for PDF generation:", users);
    await createPDF(users, res);
  } catch (err) {
    console.error("Error generating PDF:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = exportRoute;
