const express = require('express')
const Joi = require('joi')
const auth = require('../middleware/auth')
const { getObjectIndex } = require('../util')

const router = express.Router()

router.get('/', auth, async (req, res) => {
	const index = getObjectIndex(req.user.vehicle, req.body.vehicleId)
	if (index < 0) return res.status(400).send('Not found!')
	delete req.body.vehicleId
	const logs = req.user.vehicle[index].refuelLog
	if (!logs.length) return res.status(404).send('Not found!')
	return res.status(200).send(logs)
})

// creates a new refuel log and updates odo
router.post('/', auth, async (req, res) => {
	try {
		const { error } = validateRefuelLog(req.body)
		if (error) return res.status(400).send(error.details[0].message)

		const index = getObjectIndex(req.user.vehicle, req.body.vehicleId)
		delete req.body.vehicleId

		console.log(req.body.odo, req.user.vehicle[index].odo)
		if (parseInt(req.body.odo) < parseInt(req.user.vehicle[index].odo))
			return res.status(400).send('odo cannot be less than previous')

		console.log(req.user)
		req.user.vehicle[index].refuelLogs.push(req.body)
		req.user.save().then(async () => {
			req.user.vehicle[index].odo = req.body.odo
			await req.user.save()
		})
		return res.status(201).send(req.body)
	} catch (error) {
		return res.status(500).send(error.message)
	}
})

/**
 * Implementation on hold : PUT and DELETE
 */

function validateRefuelLog(log) {
	const schema = Joi.object({
		_id: Joi.string().required(),
		vehicleId: Joi.string().required(),
		date: Joi.string().required(),
		odo: Joi.string().required(),
		quantity: Joi.string().required(),
		unitCost: Joi.string().required(),
		totalCost: Joi.string().required(),
		location: Joi.string(),
		images: Joi.array(),
	})
	return schema.validate(log)
}
module.exports = router
