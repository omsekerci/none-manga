const express = require('express')
const router = express.Router()
const Series = require('../models/Series')
const Chapter = require('../models/Chapter')

// Tüm serileri getir
router.get('/', async (req, res) => {
  try {
    const series = await Series.find().sort({ createdAt: -1 })
    res.json(series)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Tek seri getir
router.get('/:id', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id)
    const chapters = await Chapter.find({ seriesId: req.params.id }).sort({ number: 1 })
    res.json({ series, chapters })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Yeni seri ekle
router.post('/', async (req, res) => {
  try {
    const series = new Series(req.body)
    const newSeries = await series.save()
    res.status(201).json(newSeries)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// Seri sil
router.delete('/:id', async (req, res) => {
  try {
    await Series.findByIdAndDelete(req.params.id)
    res.json({ message: 'Seri silindi' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router