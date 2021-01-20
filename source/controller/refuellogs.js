const Joi = require('joi')
const { getObjectIndex } = require('../util')

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
module.exports = {
	async getAllRefuelLogs(req, res) {
		const index = getObjectIndex(req.user.vehicle, req.body.vehicleId)
		if (index < 0) return res.status(400).send('Not found!')
		delete req.body.vehicleId
		const logs = req.user.vehicle[index].refuelLog
		if (!logs.length) return res.status(404).send('Not found!')
		return res.status(200).send(logs)
	},
	async postRefuelLog(req, res) {
		try {
			const { error } = validateRefuelLog(req.body)
			if (error) return res.status(400).send(error.details[0].message)
			const vehicleIndex = getObjectIndex(req.user.vehicle, req.body.vehicleId)
			if (vehicleIndex < 0) throw new Error('VEHICLE_NOT_FOUND')
			const currentOdo = req.body.odo
			const previousOdo = req.user.vehicle[vehicleIndex].odo
			if (parseInt(currentOdo) < parseInt(previousOdo))
				return res.status(400).send('odo cannot be less than previous')
			req.user.vehicle[vehicleIndex].refuelLogs.push(req.body)
			req.user.save().then(async () => {
				req.user.vehicle[vehicleIndex].odo = currentOdo
				await req.user.save()
			})
			return res.status(201).send(req.body)
		} catch (error) {
			return res.status(500).send(error.message)
		}
	},
	async deleteRefuelLog(req, res) {
		try {
			const vehicleId = req.params.vehicleId
			const logId = req.params.logId
			const index = getObjectIndex(req.user.vehicle, vehicleId)
			if (index < 0) throw new Error('VEHICLE_NOT_FOUND')
			const logIndex = req.user.vehicle[index].refuelLogs.findIndex(
				(item) => item._id.toString() === logId
			)
			if (logIndex < 0) throw new Error('REFUELLOG_NOT_FOUND')
			const deletedLog = req.user.vehicle[index].refuelLogs.splice(logIndex, 1)
			await req.user.save()
			res.send(deletedLog[0])
		} catch (error) {
			res.status(500).send(error.message)
		}
	},
}
