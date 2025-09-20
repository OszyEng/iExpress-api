const pool = require('../config/database');

const Follow = {
  async follow(handle, followedHandle) {
    if (handle === followedHandle) {
      throw new Error('Self-follow not allowed');
    }
    try {
      const result = await pool.query(
        'INSERT INTO follows (handle, followed_handle) VALUES ($1, $2) RETURNING handle, followed_handle, followed_time',
        [handle, followedHandle]
      );
      return result.rows[0];
    } catch (err) {
      if (err.code === '23505') {
        throw new Error('User already followed by current user');
      }
      if (err.code === '23503') {
        throw new Error('Unable to follow user');
      }
      throw err;
    }
  },

  async unfollow(handle, followedHandle) {
    const result = await pool.query(
      'DELETE FROM follows WHERE handle = $1 AND followed_handle = $2 RETURNING handle, followed_handle',
      [handle, followedHandle]
    );
    if (result.rows.length === 0) {
      throw new Error('User not followed');
    }
    return result.rows[0];
  },

  async getFollowing(handle) {
    const result = await pool.query(
      'SELECT followed_handle, followed_time FROM follows WHERE handle = $1',
      [handle]
    );
    return result.rows;
  },

  async getFollowers(handle) {
    const result = await pool.query(
      'SELECT handle, followed_time FROM follows WHERE followed_handle = $1',
      [handle]
    );
    return result.rows;
  }
};

module.exports = Follow;