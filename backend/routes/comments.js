const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')

// Yorumları getir
router.get('/:chapterId', async (req, res) => {
  try {
    const comments = await Comment.find({ chapterId: req.params.chapterId }).sort({ createdAt: -1 })
    res.json(comments)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Yorum ekle
router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body)
    const newComment = await comment.save()
    res.status(201).json(newComment)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

module.exports = router