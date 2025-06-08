const router = require('express').Router()
const { UserBlogs } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const reading = await UserBlogs.create({
      userId: req.body.userId,
      blogId: req.body.blogId
    })
    res.json(reading)
  } catch (error) {
    next(error)
  }
})

module.exports = router
