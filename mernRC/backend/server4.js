const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection URI from MongoDB Atlas
const uri = "mongodb+srv://Cluster12425:RookCook@cluster0.isn6pzj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Connect to MongoDB
mongoose.connect(uri)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Register user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const newUser = new User({ username, email, password });
        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);
        await newUser.save();

        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

        const payload = { userId: user._id };
        const token = jwt.sign(payload, 'yourSecretKey', { expiresIn: '1h' });

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
