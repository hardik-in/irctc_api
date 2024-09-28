const Train = require('../models/Train'); 

exports.addTrain = async (req, res) => {
  const apiKey = req.headers['apikey'];
  const { source, destination, totalSeats } = req.body;

  
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Unauthorized access' });
  }

  try {

    await Train.create(source, destination, totalSeats);
    res.status(201).json({ message: 'Train added successfully' });
  } catch (error) {
    console.error('Error adding train:', error); 
    res.status(500).json({ message: 'Error adding train', error: error.message });
  }
};
