var express = require('express');
var router = express.Router();

// GET home page
router.get('/', (req, res) => {
  res.render('index', { title: 'Strona Główna', user: req.user });
});

module.exports = router;