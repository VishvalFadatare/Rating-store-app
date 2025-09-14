const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const validate = require('../middleware/validation');

const signup = async (req, res) => {
    const { name, email, password, address } = req.body;
    if (!validate.name(name) || !validate.email(email) || !validate.password(password) || !validate.address(address)) {
        return res.status(400).json({ message: "Validation failed. Please check your inputs." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, 'normal_user')",
            [name, email, hashedPassword, address]
        );
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        if (error.code === '23505') { return res.status(409).json({ message: "Email already exists." }); }
        res.status(500).json({ message: "Server error during signup." });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        if (result.rows.length === 0) { return res.status(401).json({ message: "Invalid credentials." }); }
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) { return res.status(401).json({ message: "Invalid credentials." }); }
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token, role: user.role, userId: user.id });
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
};

const changePassword = async (req, res) => {
    const { newPassword } = req.body;
    const { id: userId } = req.user; 

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [password_hash, userId]);
        res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { signup, login, changePassword };