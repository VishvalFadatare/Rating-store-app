const bcrypt = require('bcryptjs');
const db = require('../db');
const validate = require('../middleware/validation');

const getDashboardStats = async (req, res) => {
    try {
        const totalUsersResult = await db.query('SELECT COUNT(*) FROM users');
        const totalStoresResult = await db.query('SELECT COUNT(*) FROM stores');
        const totalRatingsResult = await db.query('SELECT COUNT(*) FROM ratings');
        res.status(200).json({
            totalUsers: totalUsersResult.rows[0].count,
            totalStores: totalStoresResult.rows[0].count,
            totalRatings: totalRatingsResult.rows[0].count,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stats.' });
    }
};

const addUser = async (req, res) => {
    const { name, email, password, address, role } = req.body;
    if (!validate.name(name) || !validate.email(email) || !validate.password(password) || !validate.address(address)) {
        return res.status(400).json({ message: "Validation failed." });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5)",
            [name, email, hashedPassword, address, role]
        );
        res.status(201).json({ message: 'User added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error adding user.' });
    }
};

const getUsers = async (req, res) => {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const sort = ['name', 'email', 'address', 'role'].includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `SELECT id, name, email, address, role FROM users WHERE 1=1`;
    const params = [];

    if (name) { query += ` AND name ILIKE $${params.length + 1}`; params.push(`%${name}%`); }
    if (email) { query += ` AND email ILIKE $${params.length + 1}`; params.push(`%${email}%`); }
    if (address) { query += ` AND address ILIKE $${params.length + 1}`; params.push(`%${address}%`); }
    if (role) { query += ` AND role = $${params.length + 1}`; params.push(role); }

    query += ` ORDER BY ${sort} ${order}`;

    try {
        const result = await db.query(query, params);
        res.status(200).json({ users: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};

const addStore = async (req, res) => {
    const { name, email, address, ownerId } = req.body;
    if (!validate.email(email) || !validate.address(address)) {
        return res.status(400).json({ message: "Validation failed." });
    }
    try {
        await db.query(
            "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)",
            [name, email, address, ownerId]
        );
        res.status(201).json({ message: 'Store added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error adding store.' });
    }
};

const getStores = async (req, res) => {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const sort = ['name', 'email', 'address', 'rating'].includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
        SELECT
            s.id, s.name, s.email, s.address,
            COALESCE(AVG(r.rating_value), 0) AS average_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const params = [];

    if (name) { query += ` AND s.name ILIKE $${params.length + 1}`; params.push(`%${name}%`); }
    if (email) { query += ` AND s.email ILIKE $${params.length + 1}`; params.push(`%${email}%`); }
    if (address) { query += ` AND s.address ILIKE $${params.length + 1}`; params.push(`%${address}%`); }

    query += ` GROUP BY s.id ORDER BY ${sort} ${order}`;

    try {
        const result = await db.query(query, params);
        res.status(200).json({ stores: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stores.' });
    }
};

const getUserDetails = async (req, res) => {
    const { userId } = req.params;
    try {
        const userResult = await db.query('SELECT id, name, email, address, role FROM users WHERE id = $1', [userId]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const user = userResult.rows[0];
        if (user.role === 'store_owner') {
            const ratingResult = await db.query(
                `SELECT COALESCE(AVG(r.rating_value), 0) AS average_rating
                FROM stores s
                LEFT JOIN ratings r ON s.id = r.store_id
                WHERE s.owner_id = $1`, [userId]);
            user.average_rating = ratingResult.rows[0].average_rating;
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching user details.' });
    }
};

module.exports = {
    getDashboardStats,
    addUser,
    getUsers,
    addStore,
    getStores,
    getUserDetails
};