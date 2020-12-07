const Joi = require('joi')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const userSchema = require('../schema/index')
const jwtAuthKey = process.env.JWTPRIVATEKEY

userSchema.methods.generateAuthToken = function () {
	return jwt.sign({ id: this._id }, jwtAuthKey)
}

const User = mongoose.model('user', userSchema)

const validateNewUser = (user) => {
	const schema = Joi.object({
		_id: Joi.string().required(),
		callsign: Joi.string().required().min(3).max(15),
		email: Joi.string().required().email(),
		password: Joi.string().required(),
	})
	return schema.validate(user)
}

module.exports = { User, validateNewUser }
