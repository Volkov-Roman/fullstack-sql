const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const { Session } = require('../models')

const tokenExtractor = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      const token = authorization.substring(7)
      const decoded = jwt.verify(token, SECRET)

      const session = await Session.findOne({ where: { token } })
      if (!session) {
        return res.status(401).json({ error: 'session expired or token revoked' })
      }

      req.decodedToken = decoded
      req.token = token
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
