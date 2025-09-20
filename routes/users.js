const express = require('express');
const router = express.Router();
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

router.post('/', async (req, res) => {
  const { handle, email, password } = req.body;
  if (!handle || !email || !password) {
    return res.status(400).json({ error: 'Handle, email, and password are required' });
  }
  try {
    const user = await User.create({ handle, email, password });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:handle', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByHandle(req.params.handle);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

router.delete('/:handle', authMiddleware, async (req, res) => {
  if (req.user.handle !== req.params.handle) {
    return res.status(403).json({ error: 'Deleting another user not allowed' });
  }
  try {
    const user = await User.delete(req.params.handle);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;