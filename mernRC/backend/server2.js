// server.js
const express = require('express');
const mongoose = require('mongoose');
const Id = require('./models/Id');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection URI
const dbURI = 'mongodb://localhost:27017/idstore';

// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Route to check and store ID
app.post('/check-id', async (req, res) => {
    const { id } = req.body;
    try {
        const existingId = await Id.findOne({ id });
        if (existingId) {
            return res.status(200).send('wrong');
        }

        const newId = new Id({ id });
        await newId.save();

        return res.status(200).send('great');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Start the server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
