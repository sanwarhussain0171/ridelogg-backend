const express = require('express')
const Joi = require('joi')
const auth = require('../middleware/auth')

const router = express.Router()

// returns all the vehicles a user has
router.get('/', auth, (req, res) => res.status(200).send(req.user.vehicle))

// adds a new valid vehicle for the user
router.post('/', auth, async (req, res) => {
  console.log(req.body)
  const { error } = validateVehicle(req.body)
  if (error) return res.status(200).send(error.details[0].message)

  try {
    req.user.vehicle.push(req.body)
    await req.user.save()
    // return the last added vehicle
    return res.status(201).send(req.user.vehicle[req.user.vehicle.length - 1])
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
    image: Joi.array().items({
      url: Joi.string(),
      height: Joi.number(),
      width: Joi.number(),
    }),
  })

  return schema.validate(vehicle)
}

module.exports = router
