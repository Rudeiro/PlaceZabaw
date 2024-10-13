var express = require('express');
var router = express.Router();

const Playground = require('../models/Playground');

// GET playgrounds page
router.get('/playgrounds', async (req, res) => {
    try {
        const playgrounds = await Playground.find(); // Pobierz wszystkie placówki zabaw
        console.log('Playgrounds found:', playgrounds);
        res.render('playgrounds', { title: 'Playgrounds', playgrounds }); // Przekaż placówki do widoku
    } catch (error) {
        console.error('Error fetching playgrounds:', error);
        res.status(500).send('Błąd przy pobieraniu placów zabaw');
    }
});

// GET playgrounds page
router.get('/playground_objects', async (req, res) => {
    try {
        const playgrounds = await Playground.find(); // Pobierz wszystkie zdjęcia bez żadnych filtrów
        console.log('Playgrounds found:', playgrounds);
        res.render('playgrounds', { title: 'Playgrounds', playgrounds }); // Przekaż zdjęcia do widoku
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).send('Błąd przy pobieraniu zdjęć');
    }
});

router.get('/test', (req, res) => {
    console.log('Test route hit');
    res.send('Test route is working');
});
module.exports = router;