const Joi = require('joi')
const { getObjectIndex } = require('../util')

function validateServiceLog(log) {
	const schema = Joi.object({
		_id: Joi.string().required(),
		vehicleId: Joi.string().required(),
		date: Joi.string().required(),
		odo: Joi.string().required(),
		totalCost: Joi.string().required(),
		notes: Joi.string().required(),
		serviceCount: Joi.string().required(),
		location: Joi.string(),
		images: Joi.array(),
	})
	return schema.validate(log)
}

module.exports = {
	async getAllServiceLogs(req, res) {
		res.send('NOT_REQUIRED_FOR_N0W')
	},
	async updateServiceLog(req, res) {
		res.send('NOT_REQUIRED_FOR_N0W')
	},
	async postServiceLog(req, res) {
		try {
			const serviceLog = req.body
			const currentOdo = req.body.odo
			const { error } = validateServiceLog(serviceLog)
			if (error) res.status(400).send(error)
			const vehicleIndex = getObjectIndex(req.user.vehicle, req.body.vehicleId)
			if (vehicleIndex < 0) throw new Error('VEHICLE_NOT_FOUND')
			req.user.vehicle[vehicleIndex].serviceLogs.push(serviceLog)
			req.user.save().then(async () => {
				const previousOdo = req.user.vehicle[vehicleIndex].odo
				if (parseInt(currentOdo) > parseInt(previousOdo))
					req.user.vehicle[vehicleIndex].odo = currentOdo
				await req.user.save()
			})
			return res.status(201).send(req.body)
		} catch (error) {
			res.status(500).send(error.message)
		}
	},
	async deleteServiceLog(req, res) {
		try {
			const vehicleId = req.params.vehicleId
			const logId = req.params.logId
			const index = getObjectIndex(req.user.vehicle, vehicleId)
			if (index < 0) throw new Error('VEHICLE_NOT_FOUND')
			const logIndex = req.user.vehicle[index].serviceLogs.findIndex(
				(item) => item._id.toString() === logId
			)
			if (logIndex < 0) throw new Error('SERVICELOG_NOT_FOUND')
			const deletedLog = req.user.vehicle[index].serviceLogs.splice(logIndex, 1)
			await req.user.save()
			res.send(deletedLog[0])
		} catch (error) {
			res.status(500).send(error.message)
		}
	},
}
