const mongoose = require('mongoose');

const FollowSchema = new mongoose.Schema({
  viewer: {
    type: String, // Viewer username
    required: true,
  },
  creator: {
    type: String, // Creator username
    required: true,
  },
  notificationsEnabled: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Follow = mongoose.model('Follow', FollowSchema);

module.exports = Follow;