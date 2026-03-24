const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');

router.get('/', observationController.getObservations);
router.post('/', observationController.createObservation);

module.exports = router;
