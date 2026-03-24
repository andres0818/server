const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observationController');

router.get('/', observationController.getObservations);
router.post('/', observationController.createObservation);
router.delete('/:id', observationController.deleteObservation);

module.exports = router;
