const express = require('express')
const router = express.Router()
const Chapter = require('../models/Chapter')

router.post('/', async (req, res) => {
  try {
    const chapter = new Chapter(req.body)
    const newChapter = await chapter.save()
    res.status(201).json(newChapter)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
    res.json(chapter)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/:id/page', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id)
    if (!chapter) return res.status(404).json({ message: 'Bölüm bulunamadı' })
    chapter.pages.push(req.body.url)
    await chapter.save()
    res.json(chapter)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router