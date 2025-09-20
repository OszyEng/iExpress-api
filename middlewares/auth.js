const pool = require('../config/database');

const authMiddleware = async (req, res, next) => {
  const sessionId = req.header('X-Session-ID');
  
  if (!sessionId) {
    return res.status(401).json({ error: 'Session ID required' });
  }

  try {
    const result = await pool.query(
      'SELECT handle FROM sessions WHERE session_id = $1 AND end_time IS NULL',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }

    req.user = { handle: result.rows[0].handle };
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = authMiddleware;