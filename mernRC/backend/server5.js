const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Inventory = require('./models/Inventory');
const Recipe = require('./models/Recipe');
const Preference = require('./models/Preference');
const SimpleString = require('./models/SimpleString');
const ProfilePic = require('./models/UserProfilePic');


const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
//app.use(express.json());
app.use(cors());
// Middleware
app.use(express.json({ limit: '10mb' })); // Increase the limit to 10MB or more
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Increase for URL-encoded data
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

// Get user's inventory
app.get('/inventory', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;

        const inventory = await Inventory.findOne({ userId });
        if (!inventory) return res.status(404).json({ msg: 'No inventory found' });

        res.json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Add item to user's inventory
app.post('/inventory', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;

        const { item } = req.body;

        let inventory = await Inventory.findOne({ userId });
        if (!inventory) {
            inventory = new Inventory({ userId, items: [] });
        } else {
            if (item){
                inventory.items.push(item);
            }
        }
        await inventory.save();

        res.json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Remove item from user's inventory
app.delete('/inventory', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;

        const { item } = req.body;

        let inventory = await Inventory.findOne({ userId });
        if (!inventory) return res.status(404).json({ msg: 'No inventory found' });

        inventory.items = inventory.items.filter(i => i !== item);
        await inventory.save();

        res.json(inventory);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// load the all the comments of a recipe

app.get('/recipes/:recipeId/comments', async (req, res) => {
    try {
        const { recipeId } = req.params;

        // Check if the recipe exists
        let recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            // If not, create a new recipe document with no comments
            recipe = new Recipe({ _id: recipeId, title: `Recipe ${recipeId}`, comments: [] });
            await recipe.save();
        }

        res.json(recipe.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// add comments to a recipe

app.post('/recipes/:recipeId/comments', async (req, res) => {
    try {
        const { text, rating } = req.body;
        const { recipeId } = req.params;

        if (!text || rating == null) {
            return res.status(400).json({ msg: 'Text and rating are required' });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ msg: 'Recipe not found' });
        }

        const newComment = {
            text: text,
            rating: rating
        };

        recipe.comments.push(newComment);
        await recipe.save();

        res.json(recipe.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Load or initialize preference list
app.get('/preferences', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;

        let preference = await Preference.findOne({ userId });
        if (!preference) {
            // Initialize a new preference list if it doesn't exist
            preference = new Preference({ userId, preferences: [] });
            await preference.save();
        }

        res.json(preference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Add a preference to the list
app.post('/preferences', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;
        const { preference } = req.body;

        if (!preference) return res.status(400).json({ msg: 'Preference is required' });

        let userPreference = await Preference.findOne({ userId });
        if (!userPreference) {
            userPreference = new Preference({ userId, preferences: [preference] });
        } else {
            if (!userPreference.preferences.includes(preference)) {
                userPreference.preferences.push(preference);
            }
        }
        await userPreference.save();

        res.json(userPreference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


// Delete a preference from the list
app.delete('/preferences', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;
        const { preference } = req.body;

        let userPreference = await Preference.findOne({ userId });
        if (!userPreference) return res.status(404).json({ msg: 'No preferences found' });

        userPreference.preferences = userPreference.preferences.filter(p => p !== preference);
        await userPreference.save();

        res.json(userPreference);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/string', async (req, res) => {
    const { value } = req.body;

    try {
        let stringDoc = await SimpleString.findOne({});
        if (!stringDoc) {
            stringDoc = new SimpleString({ value });
        } else {
            stringDoc.value = value;
        }

        await stringDoc.save();
        res.json(stringDoc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


app.get('/string', async (req, res) => {
    try {
        const stringDoc = await SimpleString.findOne({});
        
        // If no stringDoc is found, return null
        if (!stringDoc) {
            return res.json({ value: null });
        }

        res.json(stringDoc);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Load the profile picture
app.get('/profile-pic', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;

        const profilePic = await ProfilePic.findOne({ userId });
        if (!profilePic) return res.status(404).json({ msg: 'No profile picture found' });

        res.json(profilePic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Save or update the profile picture
app.post('/profile-pic', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, 'yourSecretKey');
        const userId = decoded.userId;
        const { imageData } = req.body;

        let profilePic = await ProfilePic.findOne({ userId });
        if (!profilePic) {
            profilePic = new ProfilePic({ userId, imageData });
        } else {
            profilePic.imageData = imageData; // Update the existing image data
        }
        await profilePic.save();
        res.json({ msg: 'Profile picture saved successfully', profilePic });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});


if (require.main === module) {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

module.exports = app;
