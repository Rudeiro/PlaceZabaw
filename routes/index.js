var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const Image = require('../models/Image'); // Załaduj model Image


// Ustawienia multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); // Katalog do przechowywania zdjęć
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nazwa pliku
  }
});

var upload = multer({ storage: storage });

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Strona Główna', user: req.user });
});


// Trasa do wyświetlania zdjęć
router.get('/photos', async (req, res, next) => {
  try {
      const images = await Image.find(); // Znajdź wszystkie zdjęcia
      res.render('photos', { title: 'Zdjęcia', images });
  } catch (error) {
      console.error('Error fetching photos:', error);
      res.status(500).send('Błąd przy pobieraniu zdjęć');
  }
});



/* GET add page. */
router.get('/add', function(req, res, next) {
  // Upewnij się, że użytkownik jest zalogowany
  if (!req.isAuthenticated()) {
    return res.redirect('/api/auth/login'); // Przekierowanie do strony logowania, jeśli nie jest zalogowany
  }
  res.render('add', { title: 'Dodaj', user: req.user }); // Renderowanie strony z formularzem
});

// GET login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Logowanie' });
});

// GET register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Logowanie' });
});

router.post('/upload', upload.single('image'), async (req, res, next) => {
  const { description } = req.body;
  const image = req.file;

  if (!image) {
      return res.status(400).send('Brak zdjęcia do przesłania.');
  }

  // Zapisz ścieżkę do zdjęcia i opis w bazie danych
  const newImage = new Image({
      description,
      imageUrl: image.path, // Ścieżka do pliku, a nie bufor
      createdAt: new Date() // Możesz dodać datę utworzenia
  });

  try {
      await newImage.save();
      console.log('Uploaded image:', image);
      console.log('Image description:', description);
      res.redirect('/photos'); // Przekierowanie do strony ze zdjęciami
  } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).send('Wystąpił błąd podczas zapisywania obrazu.');
  }
});

router.get('/photos', async (req, res, next) => {
  try {
    const images = await Image.find();
    res.render('photos', { title: 'Zdjęcia', images });
  } catch (err) {
    console.error('Error fetching photos:', err);
    res.status(500).send('Błąd serwera');
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