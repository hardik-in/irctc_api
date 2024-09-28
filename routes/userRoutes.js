const express = require('express');
const { register, login, getAvailability, getBookings, bookSeat } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.get('/availability', getAvailability);
router.post('/book', bookSeat);
router.get('/bookings', getBookings); 

module.exports = router;
