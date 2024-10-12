const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sprawdź, czy użytkownik już istnieje
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Użytkownik już istnieje' });
        }

        // Hashowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10); // Hashowanie hasła

        // Utwórz nowego użytkownika
        user = new User({
            email,
            password: hashedPassword, // Użyj hashowanego hasła
        });

        await user.save();

        res.status(201).json({ message: 'Rejestracja zakończona sukcesem' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Błąd serwera');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Sprawdź, czy użytkownik istnieje
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło.' });
        }

        // Sprawdź hasło
        const isMatch = await bcrypt.compare(password, user.password); // Porównanie hasła
        if (!isMatch) {
            return res.status(400).json({ message: 'Nieprawidłowy e-mail lub hasło.' });
        }

        // Logowanie powiodło się
        res.status(200).json({ message: 'Zalogowano pomyślnie!' });
    } catch (error) {
        res.status(500).json({ message: 'Wystąpił błąd podczas logowania.' });
    }
};