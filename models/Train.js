const db = require('../config/db');

const Train = {
  create: async (source, destination, totalSeats) => {
    return db.query(
      'INSERT INTO trains (source, destination, total_seats, available_seats) VALUES (?, ?, ?, ?)', 
      [source, destination, totalSeats, totalSeats]
    );
  },

  findByRoute: (source, destination) => {
    return db.query('SELECT * FROM trains WHERE source = ? AND destination = ?', [source, destination]);
  },

  findById: (trainId) => {
  return db.query('SELECT * FROM trains WHERE id = ?', [trainId]);
},

  updateSeats: (trainId, seats) => {
  return db.query('UPDATE trains SET available_seats = ? WHERE id = ?', [seats, trainId]);
}
};

module.exports = Train;
