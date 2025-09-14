const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = { userId: decodedToken.userId, role: decodedToken.role };
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed!" });
    }
};

const checkRole = (role) => {
    return (req, res, next) => {
        if (req.userData.role !== role) {
            return res.status(403).json({ message: "Access denied." });
        }
        next();
    };
};

module.exports = { auth, checkRole };