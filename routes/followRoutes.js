// followRoutes.js
const express = require('express');
const router = express.Router();
const Follow = require('../models/Follow');
const Viewer = require('../models/Viewer');
const Creator = require('../models/Creator');
const Video = require('../models/Video');

// GET all follows for a viewer
router.get('/:viewerUsername', async (req, res) => {
  try {
    const { viewerUsername } = req.params;
    const viewer = await Viewer.findOne({ username: viewerUsername });
    if (!viewer) {
      return res.status(404).json({ message: 'Viewer not found' });
    }

    const follows = await Follow.find({ viewer: viewerUsername });

    const followsWithCreatorDetails = await Promise.all(
      follows.map(async (follow) => {
        const creator = await Creator.findOne({ username: follow.creator });
        const latestVideo = await Video.findOne({ creator: follow.creator }).sort({ createdAt: -1 });

        return {
          ...follow._doc,
          name: creator?.username || "Unknown Creator",
          username: creator?.username || "unknown",
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', // Placeholder avatar
          lastStream: latestVideo ? latestVideo.title : 'No streams yet',
          lastStreamDate: latestVideo ? latestVideo.createdAt : new Date().toISOString(),
          isFollowing: true, // Because they are in the follows list
        };
      })
    );

    res.json(followsWithCreatorDetails);
  } catch (err) {
    console.error('Error fetching follows:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST follow a creator
router.post('/', async (req, res) => {
  try {
    const { viewerUsername, creatorUsername } = req.body;

    const viewer = await Viewer.findOne({ username: viewerUsername });
    const creator = await Creator.findOne({ username: creatorUsername });
    if (!viewer || !creator) {
      return res.status(404).json({ message: 'Viewer or Creator not found' });
    }

    const existingFollow = await Follow.findOne({ viewer: viewerUsername, creator: creatorUsername });
    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this creator' });
    }

    const newFollow = new Follow({
      viewer: viewerUsername,
      creator: creatorUsername,
    });

    await newFollow.save();
    res.status(201).json(newFollow);
  } catch (err) {
    console.error('Error following creator:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE unfollow a creator
router.delete('/:id', async (req, res) => {
  try {
    const follow = await Follow.findByIdAndDelete(req.params.id);
    if (!follow) {
      return res.status(404).json({ message: 'Follow not found' });
    }
    res.json({ message: 'Unfollowed successfully' });
  } catch (err) {
    console.error('Error unfollowing creator:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT toggle notifications
router.put('/:id/notifications', async (req, res) => {
  try {
    const follow = await Follow.findById(req.params.id);
    if (!follow) {
      return res.status(404).json({ message: 'Follow not found' });
    }

    follow.notificationsEnabled = !follow.notificationsEnabled;
    await follow.save();
    res.json(follow);
  } catch (err) {
    console.error('Error toggling notifications:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
