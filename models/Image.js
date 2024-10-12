const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    imageUrl: { // Użyj imageUrl do przechowywania ścieżki do zdjęcia
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Ustaw domyślną datę
    }
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = Image;