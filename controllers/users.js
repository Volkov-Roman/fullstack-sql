const { tokenExtractor } = require('../util/middleware')
const router = require('express').Router()

const { User, Blog } = require('../models')

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})

// router.put('/:username', async (req, res, next) => {
//   try {
//     const user = await User.findOne({ where: { username: req.params.username } })
//     if (!user) {
//       return res.status(404).json({ error: 'user not found' })
//     }

//     user.username = req.body.username
//     await user.save()
//     res.json(user)
//   } catch (error) {
//     next(error)
//   }
// })

module.exports = router
