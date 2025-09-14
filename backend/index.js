const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const normalUserRoutes = require('./routes/normalUserRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/normal-user', normalUserRoutes);
app.use('/api/store-owner', storeOwnerRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});