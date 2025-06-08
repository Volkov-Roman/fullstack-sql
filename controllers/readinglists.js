const router = require('express').Router()
const { UserBlogs } = require('../models')
const { tokenExtractor } = require('../util/middleware')

router.post('/', async (req, res, next) => {
  try {
    const { userId, blogId } = req.body

    const existing = await UserBlogs.findOne({
      where: { userId, blogId }
    })

    if (existing) {
      return res.status(409).json({ error: 'Blog already in reading list' })
    }

    const reading = await UserBlogs.create({
      userId,
      blogId
    })

    res.status(201).json(reading)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const reading = await UserBlogs.findByPk(req.params.id)

    if (!reading) {
      return res.status(404).json({ error: 'reading list entry not found' })
    }

    if (reading.userId !== req.decodedToken.id) {
      return res.status(403).json({ error: 'only the author can mark reading as read' })
    }

    reading.read = req.body.read
    await reading.save()
    res.json(reading)

  } catch (error) {
    next(error)
  }
})

module.exports = router
