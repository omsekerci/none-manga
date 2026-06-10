const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Canlıdaki frontend domainine ve locale tam izin veriyoruz
app.use(cors({
  origin: [
    'https://gentle-analysis-production-c969.up.railway.app',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));

app.use(express.json());

// Veritabanı Bağlantısı
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlandı!'))
  .catch(err => console.log('MongoDB hatası:', err));

// Rotalar (Routes)
app.use('/api/series', require('./routes/series'));
app.use('/api/chapters', require('./routes/chapters'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/auth', require('./routes/auth'));

// Test Rotası
app.get('/', (req, res) => {
  res.json({ message: 'None Manga API çalışıyor!' });
});

// Dinamik Port Ayarı (Railway için)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});