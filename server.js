const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const viewerRoutes = require('./routes/viewerRoutes');
const creatorRoutes = require('./routes/creatorRoutes');
const videoRoutes = require('./routes/videoRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/followRoutes'); // Add this
const path = require('path');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/videos', express.static('videos')); // Serve video files
app.use('/api/viewers', viewerRoutes);
app.use('/api/creators', creatorRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscriptions', subscriptionRoutes); // Add this
app.use('/api/follows', followRoutes); // Add this
app.use('/videos', express.static(path.join(__dirname, 'frontend', 'public', 'videos')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch((err) => {
    console.error(err);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
