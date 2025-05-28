const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
    let token = req.headers["authorization"];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    if (token && token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}

module.exports = authMiddleware;