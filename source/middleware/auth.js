const jwt = require('jsonwebtoken')
const { User } = require('../model/user')
require('dotenv').config()
/*
 * The auth middleware looks for the user id
 * in the db, if present, it adds the query result in
 * the req.user variable.secondary query is avoided
 * to get the user at the next router.
 */
async function auth(req, res, next) {
	console.log('in auth')
	const token = req.header('x-auth-token')
	if (!token) return res.status(401).send('No Token supplied')

	try {
		let user = jwt.verify(token, process.env.JWTPRIVATEKEY) //try-catch if supplied token doesnt match
		user = await User.findOne({ _id: user.id })
		if (!user) throw 'User not registered'
		req.user = user
		next()
	} catch (ex) {
		console.log(ex)
		return res.status(400).send(ex)
	}
}

module.exports = auth
