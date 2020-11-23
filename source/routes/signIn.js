const express = require('express')
const { ModelRegister } = require('../model/signup')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const router = express.Router()

router.post('/', async (req, res) => {
  console.log('in signIn')

  const { error } = validateUser(req.body)
  if (error) return res.status(400).send('Improper Credentials!')

  const user = await ModelRegister.findOne({ email: req.body.email })
  if (!user) return res.status(404).send('User not found')

  if (bcrypt.compare(req.body.password, user.password)) {
    const token = user.generateAuthToken()
    return res.status(200).send({ token })
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
