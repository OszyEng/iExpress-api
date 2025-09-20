const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const authMiddleware = require('../middlewares/auth');

router.post('/', authMiddleware, async (req, res) => {
  const { content, replied_message } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Empty posts not allowed' });
  }
  try {
    const post = await Post.create({
      content,
      sessionId: req.header('X-Session-ID'),
      repliedMessage: replied_message || null
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.getLatest();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/user/:handle', async (req, res) => {
  try {
    const posts = await Post.getByUser(req.params.handle);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/following', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.getByFollowing(req.user.handle);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search Empty' });
  }
  try {
    const posts = await Post.search(q);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;