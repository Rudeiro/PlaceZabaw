// deleteImages.js
const mongoose = require('mongoose');
const Image = require('./models/Image'); // Upewnij się, że ścieżka do modelu jest poprawna

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Połączono z bazą danych MongoDB.');

  // Usuwanie wszystkich dokumentów z kolekcji Images
  return Image.deleteMany({});
})
.then(() => {
  console.log('Wszystkie zdjęcia zostały usunięte.');
})
.catch((error) => {
  console.error('Wystąpił błąd:', error);
})
.finally(() => {
  // Zamykanie połączenia z bazą danych
  mongoose.connection.close();
});