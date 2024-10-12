var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const Image = require('../models/Image'); // Załaduj model Image

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

// GET add page. //
router.get('/add', function(req, res, next) {
    // Checking if user is logged in
    if (!req.isAuthenticated()) {
      return res.redirect('/api/auth/login'); // Redirecting to login page if user is not logged in
    }
    res.render('add', { title: 'Dodaj', user: req.user }); // Renderowanie strony z formularzem
  });

// GET photos page
router.get('/photos', async (req, res) => {
    const { description, dateFrom, dateTo } = req.query; // Get search queries from the URL

    let query = {};

    if (description) {
        query.description = { $regex: description, $options: 'i' }; // Case-insensitive search
    }

    // Date filtering
    if (dateFrom) {
        query.createdAt = { ...query.createdAt, $gte: new Date(dateFrom) }; // Greater than or equal
    }
    if (dateTo) {
        query.createdAt = { ...query.createdAt, $lte: new Date(dateTo) }; // Less than or equal
    }

    try {
        const images = await Image.find(query); // Fetch images based on the query
        res.render('photos', { title: 'Zdjęcia', images, description, dateFrom, dateTo });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send('Błąd przy pobieraniu zdjęć');
    }
});

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
  
module.exports = router;