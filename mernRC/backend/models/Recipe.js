// models/Recipe.js
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
});

const RecipeSchema = new mongoose.Schema({
    _id: {
        type: String, // Change to String to accept custom string IDs
        required: true
    },
    title: {
        type: String,
        required: true
    },
    comments: [CommentSchema] // Array of comments for each recipe
});

module.exports = mongoose.model('Recipe', RecipeSchema);
