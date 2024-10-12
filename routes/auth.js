const express = require('express');
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');


// Strona logowania
router.get('/login', (req, res) => {
    res.render('login', { title: 'Logowanie', messages: req.flash('error') });
});

// Logowanie
router.post('/login', (req, res, next) => {
    console.log('Login attempt:', req.body);
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        console.error('Authentication error:', err);
        return next(err);
      }
      if (!user) {
        console.log('No user found:', info.message);
        return res.redirect('/api/auth/login'); // Możesz dodać flash message
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error('Error logging in:', err);
          return next(err);
        }
        console.log('User logged in:', user);
        return res.redirect('/add');
      });
    })(req, res, next);
  });

// Rejestracja
router.post('/register', async (req, res) => {
    const { email, password } = req.body; // Wyciągnij email i hasło z req.body

    try {
        // Sprawdź, czy użytkownik już istnieje
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Użytkownik już istnieje' });
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Dodaj log do sprawdzenia hashowanego hasła

        // Utwórz nowego użytkownika
        user = new User({
            email,
            password: hashedPassword, // Użyj hashowanego hasła
        });

        await user.save(); // Zapisz użytkownika do bazy danych
        res.redirect('/api/auth/login'); // Przekierowanie po rejestracji
    } catch (error) {
        console.error('Błąd podczas rejestracji:', error.message);
        res.render('register', { title: 'Rejestracja', error: error.message });
    }
});

// Strona rejestracji
router.get('/register', (req, res) => {
  res.render('register', { title: 'Rejestracja', messages: {} });
});


module.exports = router;