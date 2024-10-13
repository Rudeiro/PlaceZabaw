const mongoose = require('mongoose');

const PlaygroundSchema = new mongoose.Schema({
    city: {
        type: String,
        required: true
    },
    
    images: {
        type: [String], // Tablica stringów bez dodatkowego zagnieżdżenia
        required: true
    }
});

const Playground = mongoose.model('Playground', PlaygroundSchema);
module.exports = Playground;