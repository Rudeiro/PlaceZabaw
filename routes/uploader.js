var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const Image = require('../models/Image'); // Załaduj model Image
const Playground = require('../models/Playground');

// Setting multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads'); // Katalog do przechowywania zdjęć
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Nazwa pliku
    }
  });
  
var upload = multer({ storage: storage });

// Post uploading photo
router.post('/upload', upload.single('image'), async (req, res, next) => {
    const { description } = req.body;
    const image = req.file;

    if (!image) {
        return res.status(400).send('Brak zdjęcia do przesłania.');
    }

    // Add new image to database
    const newImage = new Image({
        description,
        imageUrl: image.path, // Ścieżka do pliku, a nie bufor
        createdAt: new Date() // Możesz dodać datę utworzenia
    });

    try {
        await newImage.save();
        console.log('Uploaded image:', image);
        console.log('Image description:', description);
        res.redirect('/photos'); // going to photos page after uploading photo
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).send('Wystąpił błąd podczas zapisywania obrazu.');
    }
});  
  
router.get('/image/:id', async (req, res, next) => {
    try {
        const image = await Image.findById(req.params.id);
        if (!image) {
        return res.status(404).send('Nie znaleziono zdjęcia.');
        }

        res.set('Content-Type', 'image/jpeg');  // Ustaw odpowiedni typ MIME
        res.send(image.image);  // Zwróć dane binarne obrazu
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Wystąpił błąd.');
    }
});

// POST route for uploading multiple images
router.post('/upload_playground', upload.array('images', 10), async (req, res, next) => {
    const { city } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
        return res.status(400).send('Brak zdjęć do przesłania.');
    }

    // Pobierz ścieżki do plików i upewnij się, że jest to płaska tablica
    const imagePaths = images.map(file => `/uploads/${file.filename}`).flat();

    // Sprawdź, czy imagePaths jest tablicą jednowymiarową
    console.log('Obrazy do zapisania:', imagePaths);

    // Zapisz zdjęcia (ścieżki do plików) i opis w bazie danych
    const newPlayground = new Playground({
        city,
        images: imagePaths // Zapisujemy płaską tablicę ścieżek
    });

    try {
        await newPlayground.save();
        res.redirect('/playgrounds'); // Przekierowanie po dodaniu
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).send('Wystąpił błąd podczas zapisywania obrazów.');
    }
});

module.exports = router;