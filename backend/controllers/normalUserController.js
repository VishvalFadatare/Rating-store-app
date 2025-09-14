const db = require('../db');

const getStores = async (req, res) => {
    const { userId } = req.userData;
    const { search, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const sort = ['name', 'address', 'rating'].includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    let query = `
        SELECT
            s.id, s.name, s.address,
            COALESCE(AVG(r.rating_value), 0) AS overall_rating,
            (SELECT rating_value FROM ratings WHERE store_id = s.id AND user_id = $1) AS user_submitted_rating
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const params = [userId];

    if (search) {
        query += ` AND (s.name ILIKE $${params.length + 1} OR s.address ILIKE $${params.length + 1})`;
        params.push(`%${search}%`, `%${search}%`);
    }

    query += ` GROUP BY s.id ORDER BY ${sort} ${order}`;

    try {
        const result = await db.query(query, params);
        res.status(200).json({ stores: result.rows });
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching stores.' });
    }
};

const submitRating = async (req, res) => {
    const { storeId } = req.params;
    const { userId } = req.userData;
    const { ratingValue } = req.body;

    if (ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        await db.query(
            "INSERT INTO ratings (store_id, user_id, rating_value) VALUES ($1, $2, $3) ON CONFLICT (store_id, user_id) DO NOTHING",
            [storeId, userId, ratingValue]
        );
        res.status(201).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error submitting rating.' });
    }
};

const updateRating = async (req, res) => {
    const { storeId } = req.params;
    const { userId } = req.userData;
    const { ratingValue } = req.body;

    if (ratingValue < 1 || ratingValue > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const result = await db.query(
            "UPDATE ratings SET rating_value = $1, updated_at = NOW() WHERE store_id = $2 AND user_id = $3",
            [ratingValue, storeId, userId]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Rating not found or you are not authorized to update it.' });
        }
        res.status(200).json({ message: 'Rating updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating rating.' });
    }
};

module.exports = {
    getStores,
    submitRating,
    updateRating,
};