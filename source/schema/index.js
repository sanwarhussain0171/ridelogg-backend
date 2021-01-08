const mongoose = require('mongoose')

const ImageSpec = new mongoose.Schema({
	url: String,
	height: Number,
	width: Number,
})

const refuelLogSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId },
	vehicleId: { type: mongoose.Types.ObjectId },
	date: { type: String, default: Date.now() },
	odo: { type: String, required: true },
	quantity: { type: String, required: true },
	unitCost: { type: String, required: true },
	totalCost: { type: String, required: true },
	location: { type: String, required: true },
	image: [ImageSpec],
})

const serviceLogSchema = new mongoose.Schema({})

const VehicleSchema = new mongoose.Schema({
	vcallsign: { type: String, required: true },
	vin: { type: String, required: true },
	year: { type: String, required: true },
	maker: { type: String, required: true },
	model: { type: String, required: true },
	odo: { type: String, required: true },
	plate: { type: String, required: true },
	images: [ImageSpec],
	refuelLogs: [refuelLogSchema],
	serviceLogs: [serviceLogSchema],
})

const userSchema = new mongoose.Schema(
	{
		callsign: {
			type: String,
			required: true,
			minlength: 3,
			maxlength: 15,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		phone: String,
		avatar: String,
		vehicle: [VehicleSchema],
	},
	{ timestamps: true }
)

module.exports = userSchema
