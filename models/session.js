const { v4: uuidv4 } = require('uuid');
const pool = require('../config/database');
const User = require('./user');

const Session = {
  async create(handle) {
    const sessionId = uuidv4();
    try {
      const result = await pool.query(
        'INSERT INTO sessions (session_id, handle, start_time) VALUES ($1, $2, NOW()) RETURNING session_id, handle, start_time',
        [sessionId, handle]
      );
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  async end(sessionId) {
    try {
      await pool.query('BEGIN');
      const result = await pool.query(
        'UPDATE sessions SET end_time = NOW() WHERE session_id = $1 AND end_time IS NULL RETURNING handle, end_time',
        [sessionId]
      );
      if (result.rows.length === 0) {
        throw new Error('No Active Session found');
      }
      const { handle, end_time } = result.rows[0];
      await User.updateLastSession(handle, end_time);
      await pool.query('COMMIT');
      return { sessionId, handle, end_time };
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  }
};

module.exports = Session;