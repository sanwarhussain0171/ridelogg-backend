const Joi = require('joi')

function validateVehicle(vehicle) {
	const schema = Joi.object({
		_id: Joi.string().required(),
		vcallsign: Joi.string().required(),
		vin: Joi.string().required(),
		year: Joi.string().required(),
		maker: Joi.string().required(),
		model: Joi.string().required(),
		odo: Joi.string().required(),
		plate: Joi.string().required(),
		refuelLogs: Joi.array(),
		serviceLogs: Joi.array(),
		uploaded: Joi.boolean(),
		modified: Joi.boolean(),
		images: Joi.array().items({
			_id: Joi.string().required(),
			url: Joi.string(),
			height: Joi.number(),
			width: Joi.number(),
		}),
	})

	return schema.validate(vehicle)
}
module.exports = {
	async getVehicles(req, res) {
		res.status(200).send(req.user.vehicle)
	},
	async postVehicle(req, res) {
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
	},
}
