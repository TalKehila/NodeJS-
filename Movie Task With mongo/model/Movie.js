const mongoose = require('mongoose');

const movieSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    watched: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Movie", movieSchema);