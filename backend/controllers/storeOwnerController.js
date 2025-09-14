const db = require('../db');

const getDashboardData = async (req, res) => {
    const { userId } = req.userData;

    try {
        const storeResult = await db.query('SELECT id FROM stores WHERE owner_id = $1', [userId]);
        if (storeResult.rows.length === 0) {
            return res.status(404).json({ message: 'No store found for this owner.' });
        }
        const storeId = storeResult.rows[0].id;

        const ratingsResult = await db.query(
            `SELECT
                r.rating_value,
                u.name AS user_name,
                u.email AS user_email
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = $1
            ORDER BY r.created_at DESC`,
            [storeId]
        );

        const averageRatingResult = await db.query(
            `SELECT COALESCE(AVG(rating_value), 0) AS average_rating
            FROM ratings WHERE store_id = $1`,
            [storeId]
        );

        res.status(200).json({
            storeId,
            averageRating: averageRatingResult.rows[0].average_rating,
            ratings: ratingsResult.rows,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error fetching dashboard data.' });
    }
};

module.exports = {
    getDashboardData,
};