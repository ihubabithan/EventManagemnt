const express = require('express');
const router = express.Router();
const { createSample, getSamples } = require('../controllers/sampleController');

// Routes
router.post('/sample', createSample);
router.get('/sample', getSamples);

module.exports = router;
