const express = require("express");
const candidatesRoute = express.Router();
const connectDb = require("../initdb/connectDb");
const { UserModel } = require("../models/userModel");
const dotenv = require("dotenv");
connectDb();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads", // optional folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
const upload = multer({ storage: storage });
dotenv.config();

candidatesRoute.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      position,
      appliedOn,
      gte,
      lte,
    } = req.query;

    const filters = {};

    if (position) {
      filters.position = position;
    }

    if (appliedOn) {
      const start = new Date(appliedOn);
      start.setHours(0, 0, 0, 0);
      const end = new Date(appliedOn);
      end.setHours(23, 59, 59, 999);

      filters.appliedOn = { $gte: start, $lte: end };
    }

    if (gte || lte) {
      filters.aiRating = {};
      if (gte) filters.aiRating.$gte = Number(gte);
      if (lte) filters.aiRating.$lte = Number(lte);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [data, total] = await Promise.all([
      UserModel.find(filters)
        .sort({ appliedOn: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      UserModel.countDocuments(filters),
    ]);

    res.status(200).json({
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data,
    });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

candidatesRoute.get("/search", async (req, res) => {
  try {
    let { name } = req.query;
    console.log("Search query:", name);
    let data = await UserModel.find({
      email: { $regex: name, $options: "i" },
    });
    console.log("Search results:", data);
    res.json({ message: "done", data });
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
});

candidatesRoute.get("/:id", async (req, res) => {
  let { id } = req.params;
  console.log("Fetching candidate with ID:", id);
  try {
    let data = await UserModel.findById(id);
    console.log("Fetched candidate by ID:", data);
    if (data != null) {
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: "No user found" });
  }
});

candidatesRoute.post("/", upload.single("image"), async (req, res) => {
  let imageUrl = req.file.path;
  let { name, email, aiRating, appliedOn, tag } = req.body;
  try {
    let data = await UserModel.create({
      name,
      email,
      image: imageUrl,
      aiRating,
      appliedOn,
      tag,
    });
    res.status(201).json(data);
  } catch (error) {
    console.error("Error creating candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

candidatesRoute.put("/:id", async (req, res) => {
  let { id } = req.params;
  let { name, email, aiRating, tag } = req.body;
  try {
    let data = await UserModel.findByIdAndUpdate(id, {
      name,
      email,
      aiRating,
      tag,
    });
    if (data != null) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    console.error("Error updating candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

candidatesRoute.delete("/:id", async (req, res) => {
  let { id } = req.params;
  try {
    let data = await UserModel.findByIdAndDelete(id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "No user found" });
    }
  } catch (error) {
    console.error("Error deleting candidate:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

candidatesRoute.patch("/bulk-update", async (req, res) => {
  const { ids, status } = req.body;
  try {
    const result = await UserModel.updateMany(
      { _id: { $in: ids } },
      { $set: { status: status } }
    );
    res.status(200).json({ message: "Bulk update successful", result });
  } catch (error) {
    console.error("Error in bulk update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = candidatesRoute;
module.exports = candidatesRoute;

