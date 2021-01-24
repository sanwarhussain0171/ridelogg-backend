const { User } = require('../model/user')
const bcrypt = require('bcrypt')

module.exports = {
	async updatePassword(req, res) {
		const userId = req.params.userId
		const newPassword = req.body.newPassword
		try {
			const user = await User.findById(userId)
			if (!user) res.send(400).send('Invalid_Request')
			const salt = await bcrypt.genSalt()
			const hashedPassword = await bcrypt.hash(newPassword, salt)
			user.password = hashedPassword
			await user.save()
			return res.send()
		} catch (error) {
			return res.status(500).send(error.message)
		}
	},
}
