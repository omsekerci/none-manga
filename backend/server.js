const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB bağlandı!'))
  .catch(err => console.log('MongoDB hatası:', err))

app.use('/api/series', require('./routes/series'))
app.use('/api/chapters', require('./routes/chapters'))
app.use('/api/comments', require('./routes/comments'))
app.use('/api/auth', require('./routes/auth'))

app.get('/', (req, res) => {
  res.json({ message: 'None Manga API çalışıyor!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor`))