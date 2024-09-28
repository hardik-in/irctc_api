const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10); 
    return db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
  },

  findByUsername: (username) => {
    return db.query('SELECT * FROM users WHERE username = ?', [username]);
  }
};

module.exports = User;
