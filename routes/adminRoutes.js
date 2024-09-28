const express = require('express');
const { addTrain } = require('../controllers/adminController');

const router = express.Router();

router.post('/train', addTrain);

module.exports = router;
