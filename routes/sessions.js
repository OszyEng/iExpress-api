const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Session = require('../models/session');
const bcrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/auth');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const isMatch = await bcrypt.compare(password, user.pass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid login' });
    }
    const session = await Session.create(user.handle);
    res.json({ session_id: session.session_id, handle: session.handle });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/', authMiddleware, async (req, res) => {
  const sessionId = req.header('X-Session-ID');
  try {
    const session = await Session.end(sessionId);
    res.json({ message: 'Session ended' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;