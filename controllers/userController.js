const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Train = require('../models/Train');
const db = require('../config/db');     

exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide a username and password' });
  }

  try {
    const [existingUser] = await User.findByUsername(username);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    await User.create(username, password);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide a username and password' });
  }

  try {
    const [user] = await User.findByUsername(username);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in' });
  }
};

exports.getAvailability = async (req, res) => {
  const { source, destination } = req.query;

  try {
    const [trains] = await Train.findByRoute(source, destination);
    res.status(200).json(trains);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
};

exports.getBookings = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded); 

    const userId = decoded.id; 
    console.log('User ID from token:', userId);  
    const [bookings] = await db.query('SELECT * FROM bookings WHERE user_id = ?', [userId]);

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'No bookings found' });
    }

    res.status(200).json(bookings);  
  } catch (error) {
    console.error('Error fetching bookings:', error);  
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};


exports.bookSeat = async (req, res) => {
  const { trainId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;  
    const [train] = await Train.findById(trainId);
    
    if (!train || train.length === 0) {
      return res.status(404).json({ message: 'Train not found' });
    }

    if (train[0].available_seats > 0) {
      const newAvailableSeats = train[0].available_seats - 1;
      await Train.updateSeats(trainId, newAvailableSeats);
      
      await db.query('INSERT INTO bookings (user_id, train_id) VALUES (?, ?)', [userId, trainId]);

      res.status(200).json({ message: 'Seat booked successfully' });
    } else {
      res.status(400).json({ message: 'No seats available' });
    }
  } catch (error) {
    console.error('Error booking seat:', error);
    res.status(500).json({ message: 'Error booking seat' });
  }
};



