const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async create({ handle, email, password }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = await pool.query(
        'INSERT INTO users (handle, email, pass) VALUES ($1, $2, $3) RETURNING handle, email, created_time',
        [handle, email, hashedPassword]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('Handle or Email not permitted');
      }
      throw err;
    }
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND status = TRUE', [email]);
    return result.rows[0];
  },

  async findByHandle(handle) {
    const result = await pool.query('SELECT handle, email, created_time FROM users WHERE handle = $1 AND status = TRUE', [handle]);
    return result.rows[0];
  },

  async delete(handle) {
    try {
      await pool.query('BEGIN');
      await pool.query('DELETE FROM posts WHERE session_id IN (SELECT session_id FROM sessions WHERE handle = $1)', [handle]);
      await pool.query('DELETE FROM sessions WHERE handle = $1', [handle]);
      await pool.query('DELETE FROM follows WHERE handle = $1 OR followed_handle = $1', [handle]);
      const result = await pool.query('UPDATE users SET status = FALSE WHERE handle = $1 RETURNING handle', [handle]);
      await pool.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await pool.query('ROLLBACK');
      throw err;
    }
  },

  async updateLastSession(handle, timestamp) {
    await pool.query('UPDATE users SET last_session = $1 WHERE handle = $2', [timestamp, handle]);
  }
};

module.exports = User;