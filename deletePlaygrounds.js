// deletePlaygrounds.js
const mongoose = require('mongoose');
const Playground = require('./models/Playground'); // Upewnij się, że ścieżka do modelu jest poprawna

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Połączono z bazą danych MongoDB.');

  // Usuwanie wszystkich dokumentów z kolekcji Playground
  return Playground.deleteMany({});
})
.then(() => {
  console.log('Wszystkie playgrounds zostały usunięte.');
})
.catch((error) => {
  console.error('Wystąpił błąd:', error);
})
.finally(() => {
  // Zamykanie połączenia z bazą danych
  mongoose.connection.close();
});
