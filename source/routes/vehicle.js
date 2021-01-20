const express = require('express')
const auth = require('../middleware/auth')
const Vehicle = require('../controller/vehicle')
const router = express.Router()

router.get('/', auth, (req, res) => Vehicle.getVehicles(req, res))
router.post('/', auth, async (req, res) => Vehicle.postVehicle(req, res))

module.exports = router
