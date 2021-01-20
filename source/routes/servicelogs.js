const express = require('express')
const auth = require('../middleware/auth')

const Servicelog = require('../controller/servicelogs')

const router = express.Router()

router.get('/', auth, (req, res) => Servicelog.getAllServiceLogs(req, res))
router.post('/', auth, (req, res) => Servicelog.postServiceLog(req, res))
router.put('/', auth, (req, res) => Servicelog.updateServiceLog(req, res))
router.delete('/:vehicleId/:logId', auth, (req, res) =>
	Servicelog.deleteServiceLog(req, res)
)

module.exports = router
