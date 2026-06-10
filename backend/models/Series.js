const mongoose = require('mongoose')

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String },
  genre: [{ type: String }],
  status: { type: String, enum: ['Devam Ediyor', 'Tamamlandı', 'Beklemede'], default: 'Devam Ediyor' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Series', seriesSchema)