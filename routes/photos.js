var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
const Image = require('../models/Image'); // Załaduj model Image

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
  
module.exports = router;