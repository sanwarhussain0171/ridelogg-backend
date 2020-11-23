const express = require('express')
const Joi = require('joi')
const auth = require('../middleware/auth')

const router = express.Router()

router.get('/', auth, (req, res) => res.status(200).send(req.user.vehicle))

router.post('/', auth, async (req, res) => {
  const { error } = validateVehicle(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  try {
    req.user.vehicle.push(req.body)
    let newLog = await req.user.save()
    return res.status(201).send(newLog)
  } catch (error) {
    return res.status(500).send(error.message)
  }
})

function validateVehicle(vehicle) {
  const schema = Joi.object({
    vcallsign: Joi.string().required(),
    vin: Joi.string().required(),
    year: Joi.string().required(),
    maker: Joi.string().required(),
    model: Joi.string().required(),
    odo: Joi.string().required(),
    plate: Joi.string().required(),
  })

  return schema.validate(vehicle)
}

module.exports = router
