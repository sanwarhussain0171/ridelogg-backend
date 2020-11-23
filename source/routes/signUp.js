const express = require('express')
const { User, validateNewUser } = require('../model/signup')
const bcrypt = require('bcrypt')

const router = express.Router()

router.get('/', (req, res) => {
  return res.status(400).send('send post request')
})

router.post('/', async (req, res) => {
  console.log('in signup', req.body)
  const { error } = validateNewUser(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let user = await User.find({ email: req.body.email })
  if (user.length) return res.status(400).send('user already registered')

  try {
    user = new User(req.body)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()
  } catch (error) {
    return res.status(500).send(error.message)
  }
  const token = user.generateAuthToken()
  return res.status(201).send({ token })
})

module.exports = router
