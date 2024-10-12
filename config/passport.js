const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User'); // Załaduj model użytkownika

passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      console.log('Authenticating user:', email); // Loguj użytkownika
      try {
        const user = await User.findOne({ email });
        console.log('Found user:', user); // Sprawdź, czy użytkownik został znaleziony
        if (!user) {
          return done(null, false, { message: 'Nieprawidłowa nazwa użytkownika.' });
        }
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch); // Sprawdź, czy hasło pasuje
        if (!isMatch) {
          return done(null, false, { message: 'Nieprawidłowe hasło.' });
        }
        return done(null, user);
      } catch (error) {
        console.error('Error during authentication:', error); // Loguj błędy
        return done(error);
      }
    }
));

// Ustawienia serializacji i deserializacji użytkownika
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;