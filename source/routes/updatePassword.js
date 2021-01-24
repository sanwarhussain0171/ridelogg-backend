const express = require('express')
const Password = require('../controller/updatePassword')
const auth = require('../middleware/auth')

const router = express.Router()

router.post('/:userId', auth, async (req, res) =>
	Password.updatePassword(req, res)
)

module.exports = router
