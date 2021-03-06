const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const signup = require('./source/routes/signUp')
const signin = require('./source/routes/signIn')
const refuelLogs = require('./source/routes/refuellogs')
const vehicle = require('./source/routes/vehicle')
const service = require('./source/routes/servicelogs')
const updatePassword = require('./source/routes/updatePassword')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 7000
const DB_URL =
	process.env.NODE_ENV === 'production'
		? process.env.DB_URL
		: process.env.TEST_DB_URL

if (
	process.env.NODE_ENV === 'production' ||
	process.env.NODE_ENV === 'staging'
) {
	app.use(compression())
	app.use(helmet())
}
app.use(express.json())

app.get('/', (req, res) =>
	res.status(200).send('You are now connected to Ridelogg!')
)
app.use('/api/signup', signup)
app.use('/api/signin', signin)
app.use('/api/refuellog', refuelLogs)
app.use('/api/vehicle', vehicle)
app.use('/api/servicelog', service)
app.use('/api/updatePassword', updatePassword)

mongoose
	.connect(DB_URL, {
		useUnifiedTopology: true,
		useFindAndModify: false,
		useNewUrlParser: true,
		useCreateIndex: true,
	})
	.then(() => {
		module.exports = app.listen(PORT, () =>
			console.log(`Connected to mongodb. Server started on port ${PORT}`)
		)
	})
