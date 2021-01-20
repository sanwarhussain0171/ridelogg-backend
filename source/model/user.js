const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const jwtAuthKey = process.env.JWTPRIVATEKEY

const ImageSpec = new mongoose.Schema({
	url: String,
	height: Number,
	width: Number,
})

const refuelLogSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId, unique: true },
	vehicleId: mongoose.Types.ObjectId,
	date: { type: String, default: Date.now() },
	odo: { type: String, required: true },
	quantity: { type: String, required: true },
	unitCost: { type: String, required: true },
	totalCost: { type: String, required: true },
	location: { type: String, required: true },
	images: [ImageSpec],
})

const serviceLogSchema = new mongoose.Schema({
	_id: { type: mongoose.Types.ObjectId, unique: true },
	vehicleId: mongoose.Types.ObjectId,
	date: { type: String, default: Date.now() },
	odo: { type: String, required: true },
	serviceCount: String,
	notes: String,
	totalCost: { type: String, required: true },
	location: { type: String, required: true },
	images: [ImageSpec],
})

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
userSchema.methods.generateAuthToken = function () {
	return jwt.sign({ id: this._id }, jwtAuthKey)
}

const validateNewUser = (user) => {
	const schema = Joi.object({
		_id: Joi.string().required(),
		callsign: Joi.string().required().min(3).max(15),
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	})
	return schema.validate(user)
}

const User = mongoose.model('user', userSchema)

module.exports = { User, validateNewUser }
