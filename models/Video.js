const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: String,
      text: String,
    },
  ],
  kids:
  {
    type: Number,
    default:0,
  },
  sponsored:
  {
    type: Number,
    default:0,
  },
  flagged:
  {
    type: Number,
    default:0,
  },
  creator:
  {
    type: String,
    required: true,
  }
});

const Video = mongoose.model('Video', VideoSchema);

module.exports = Video;