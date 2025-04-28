const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const multer = require('multer');
const path = require('path');

// Set up Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the absolute path to the public/videos folder in the frontend directory
    const uploadPath = 'C:\\Users\\hp\\Documents\\Amaranth2\\frontend\\public\\videos';
    
    // Ensure the destination folder exists or Multer will throw an error
    cb(null, uploadPath);  
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded video
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName); // Store the file with a unique name
  }
});

const upload = multer({ storage: storage });

// Search for videos
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const videos = await Video.find({
      title: { $regex: q, $options: "i" },
    });

    res.json(videos);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error during search" });
  }
});

// Get a single video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Like a video
router.put('/:id/like', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Dislike a video
router.put('/:id/dislike', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Unlike a video
router.put('/:id/unlike', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: -1 } },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Undislike a video
router.put('/:id/undislike', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: -1 } },
      { new: true }
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a comment to a video
router.post('/:id/comments', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: req.body } },
      { new: true }
    );
    res.status(201).json(video.comments[video.comments.length - 1]);
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment" });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

// Upload a new video
router.post('/upload', upload.single('videoFile'), async (req, res) => {
  try {
    const { title, username } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const videoPath = `/videos/${req.file.filename}`;  
    // relative path that React can use

    const newVideo = new Video({
      title,
      videoUrl: videoPath,  // Save path like "/videos/12345-myvideo.mp4"
      creator: username,
      likes: 0,
      dislikes: 0,
      comments: [],
      kids: 0,
      sponsored: 0,
      flagged: 0,
    });

    await newVideo.save();

    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: "Failed to upload video" });
  }
});



module.exports = router;
