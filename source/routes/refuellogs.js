const express = require('express')
const auth = require('../middleware/auth')
const RefuelLogs = require('../controller/refuellogs')

const router = express.Router()

router.get('/', auth, (req, res) => RefuelLogs.getAllRefuelLogs(req, res))
router.post('/', auth, async (req, res) => RefuelLogs.postRefuelLog(req, res))
router.delete('/:vehicleId/:logId', auth, async (req, res) => {
	RefuelLogs.deleteRefuelLog(req, res)
})

module.exports = router
