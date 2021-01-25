const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../model/user')

function validateUser(user) {
	const schema = Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	})
	return schema.validate(user)
}

module.exports = {
	async authUser(req, res) {
		const { error } = validateUser(req.body)
		if (error) return res.status(400).send('Wrong Credentials!')

		const user = await User.findOne({ email: req.body.email })
		if (!user) return res.status(404).send('User not found')
		const validPassword = await bcrypt.compare(req.body.password, user.password)
		if (validPassword) {
			const token = user.generateAuthToken()
			return res.send({
				_id: user._id,
				token,
				callsign: user.callsign,
				avatar: user.avatar,
			})
		}

		return res.status(400).send('Invalid Authentication!')
	},
}
