const express = require('express');
const router = express.Router();
const Follow = require('../models/follow');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { followed_handle } = req.body;
  if (!followed_handle) {
    return res.status(400).json({ error: 'followed user needed' });
  }
  try {
    const follow = await Follow.follow(req.user.handle, followed_handle);
    res.status(201).json(follow);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:followed_handle', authMiddleware, async (req, res) => {
  try {
    const follow = await Follow.unfollow(req.user.handle, req.params.followed_handle);
    res.json({ message: 'No longer following' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;