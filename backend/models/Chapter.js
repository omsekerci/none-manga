const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
  seriesId: { type: mongoose.Schema.Types.ObjectId, ref: 'Series', required: true },
  title: { type: String, required: true },
  number: { type: Number, required: true },
  pages: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Chapter', chapterSchema)