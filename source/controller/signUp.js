const { User, validateNewUser } = require('../model/user')
const bcrypt = require('bcrypt')

module.exports = {
	async getEp(req, res) {
		return res.status(400).send('Endpoint accepts post request only')
	},
	async postUser(req, res) {
		const { error } = validateNewUser(req.body)
		if (error) return res.status(400).send(error.details[0].message)

		let user = await User.find({ email: req.body.email })
		if (user.length) return res.status(400).send('user already registered')

		try {
			const salt = await bcrypt.genSalt(10)
			req.body.password = await bcrypt.hash(req.body.password, salt)
			user = await User.create(req.body)
			await user.save()
		} catch (error) {
			return res.status(500).send(error.message)
		}
		const token = user.generateAuthToken()
		return res.status(201).send({ token })
	},
}
