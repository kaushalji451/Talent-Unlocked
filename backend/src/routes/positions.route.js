const { PositionModel } = require("../models/userModel");
const { positionSchema } = require("../validationSchema/signupSchema");

const positionRoute = require("express").Router();

positionRoute.post("/", async (req, res) => {

    const parsedData = positionSchema.safeParse(req.body);

    if (!parsedData.success) {
        return res.status(400).json({ errors: parsedData.error.message });
    }

    const { title, description, requirements } = parsedData.data;

    try {
        const positionCreated = await PositionModel.create({
            title,
            description,
            requirements
        });
        const savedPosition = await positionCreated.save();
        if (!savedPosition) {
            return res.status(500).json({ message: "Error saving position" });
        }
        return res.status(201).json({ message: "Position created successfully", position: savedPosition });

    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
        return;
    }
})

positionRoute.get("/", async (req, res) => {
    try {
        const positions = await PositionModel.find();
        if (!positions || positions.length === 0) {
            return res.status(404).json({ message: "No positions found" });
        }
        return res.status(200).json({ message: "Positions retrieved successfully", positions });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

positionRoute.put("/:id", async (req, res) => {
    const {id} =  req.params
    const {title , description , requirements} = req.body
    
    await PositionModel.findOne({id})
    
})