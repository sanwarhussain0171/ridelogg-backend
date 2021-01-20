const express = require('express')
const signIn = require('../controller/signIn')
const router = express.Router()

router.post('/', async (req, res) => signIn.authUser(req, res))

module.exports = router
