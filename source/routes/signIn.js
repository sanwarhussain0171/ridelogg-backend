const express = require('express')
const { User } = require('../model/signup')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const router = express.Router()

// takes valid user email and password and returns user a token
router.post('/', async (req, res) => {
  const { error } = validateUser(req.body)
  if (error) return res.status(400).send('Wrong Credentials!')

  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(404).send('User not found')

  if (bcrypt.compare(req.body.password, user.password)) {
    const token = user.generateAuthToken()
    return res.send({ token, callsign: user.callsign, avatar: user.avatar })
  }

  return res.status(400).send('Invalid Authentication!')
})

function validateUser(user) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  return schema.validate(user)
}

module.exports = router
