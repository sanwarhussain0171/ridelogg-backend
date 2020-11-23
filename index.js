const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const signup = require('./source/routes/signUp')
const signin = require('./source/routes/signIn')
const refuelLogs = require('./source/routes/refuellogs')
const vehicle = require('./source/routes/vehicle')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
const DB_URL = process.env.DB_URL

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

mongoose
  .connect(DB_URL, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Connected to mongodb. Server started on port ${PORT}`)
    )
  })
