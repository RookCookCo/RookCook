// server.js
const express = require('express');
const mongoose = require('mongoose');
const Id = require('./models/Id');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB connection URI from MongoDB Atlas
const password = encodeURIComponent("<Feb28@2013@dc>");
//const dbURI = "mongodb+srv://Cluster12425:${password}@cluster0.isn6pzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = "mongodb+srv://Cluster12425:RookCook@cluster0.isn6pzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

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
