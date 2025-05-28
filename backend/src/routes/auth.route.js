const jwt = require("jsonwebtoken")
const express = require("express");
const authRouter = express.Router();
const { loginSchema, signupSchema } = require("../validationSchema/signupSchema");
authRouter.use(express.json());
const uploadfile = require("../middleware/multer.middleware");
const dotenv = require("dotenv");
const { UserModel } = require("../models/userModel");
const bcrypt = require("bcrypt");
const uploadFileToGoogleDrive = require("../config/fileUpload");
dotenv.config();
const { v4: uuidv4 } = require('uuid');
const fs = require("fs")
const sendEmailforRegistration = require("../utils/sendRegistrationEmail")
const sendConfirmationEmailToHr = require("../utils/sendRegistrationEmail")

authRouter.post("/signup", uploadfile.single("file"), async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "No data provided" });
    }

    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }



    // Log form data and file
    console.log("Form data:", req.body);
    console.log("Uploaded file:", req.file);

    const { name, email, phoneno, gender, address, dob, degree, department, sop,password ,username } = req.body;

    
    // Validate if file was uploaded
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;

    try {
        // hash password
        const existedUser = await UserModel.findOne({ username });
        if (existedUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Upload the file to Google Drive
        const Url = await uploadFileToGoogleDrive(filePath);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            }
        });
        

        // Save user to DB
        const user = new UserModel({
            username: username,
            registrationId: uuidv4(),
            name,
            address,
            email,
            phoneno,
            gender,
            password: hashedPassword,
            dateOfBirth: dob,
            degree,
            position: department,
            cvUrl: Url,
            SOP: sop,
            status: "Applied",
            appliedOn: new Date(),
            aiRating: 0,
            tag: "New",
        });
        console.log("User object before saving:", user);

        const userSaved = await user.save();
        await sendEmailforRegistration(userSaved);
        await sendConfirmationEmailToHr(userSaved)
        res.status(201).json({ message: "User registered successfully", userSaved });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: "Error in registration route", error: error.message });
    }
});

authRouter.post("/login", async (req, res) => {
    const parsedData = loginSchema.safeParse(req.body);
    console.log("Parsed data:", parsedData);
    if (!parsedData.success) {
        return res.status(400).json({ message: parsedData.error.errors[0].message });
    }
    const { username, password } = parsedData.data;

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: "Invalid username" });
        }

        const isPasswordValid = bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "Login successful", token: token });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
module.exports = authRouter