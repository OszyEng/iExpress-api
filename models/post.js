const pool = require('../config/database');

const Post = {
  async create({ content, sessionId, repliedMessage }) {
    try {
      const result = await pool.query(
        'INSERT INTO posts (content, session_id, replied_message) VALUES ($1, $2, $3) RETURNING post_id, content, created_date, session_id, replied_message',
        [content, sessionId, repliedMessage]
      );
      const post = result.rows[0];
      const session = await pool.query('SELECT handle FROM sessions WHERE session_id = $1', [sessionId]);
      return { ...post, user_handle: session.rows[0].handle };
    } catch (err) {
      if (err.code === '23503') {
        throw new Error('Invalid session or replied message');
      }
      throw err;
    }
  },

  async getLatest(limit = 10) {
    const result = await pool.query(
      `SELECT p.post_id, p.content, p.created_date, p.session_id, p.replied_message, s.handle as user_handle
       FROM posts p
       JOIN sessions s ON p.session_id = s.session_id
       ORDER BY p.created_date DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  },

  async getByUser(handle, limit = 10) {
    const result = await pool.query(
      `SELECT p.post_id, p.content, p.created_date, p.session_id, p.replied_message, s.handle as user_handle
       FROM posts p
       JOIN sessions s ON p.session_id = s.session_id
       WHERE s.handle = $1
       ORDER BY p.created_date DESC
       LIMIT $2`,
      [handle, limit]
    );
    return result.rows;
  },

  async getByFollowing(handle, limit = 10) {
    const result = await pool.query(
      `SELECT p.post_id, p.content, p.created_date, p.session_id, p.replied_message, s.handle as user_handle
       FROM posts p
       JOIN sessions s ON p.session_id = s.session_id
       JOIN follows f ON s.handle = f.followed_handle
       WHERE f.handle = $1
       ORDER BY p.created_date DESC
       LIMIT $2`,
      [handle, limit]
    );
    return result.rows;
  },

  async search(query, limit = 10) {
    const result = await pool.query(
      `SELECT p.post_id, p.content, p.created_date, p.session_id, p.replied_message, s.handle as user_handle
       FROM posts p
       JOIN sessions s ON p.session_id = s.session_id
       WHERE p.content ILIKE $1
       ORDER BY p.created_date DESC
       LIMIT $2`,
      [`%${query}%`, limit]
    );
    return result.rows;
  }
};

module.exports = Post;