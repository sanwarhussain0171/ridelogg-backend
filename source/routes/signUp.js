const express = require('express')
const signUp = require('../controller/signUp')
const router = express.Router()

// sending wrong request to end point
router.get('/', (req, res) => signUp.getEp(req, res))
router.post('/', async (req, res) => signUp.postUser(req, res))

module.exports = router
