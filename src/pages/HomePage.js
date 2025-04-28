import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaPlay, FaHeart, FaFilter } from 'react-icons/fa';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const filteredVideos = videos.filter(video => {
    if (filter === 'popular') return video.likes > 50;
    return true;
  });

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="homepage">
      <h2>Home</h2>
            {username ? (
                <p>Welcome back, {username}!</p>
            ) : (
                <p>Welcome to Amaranth! Please login or register.</p>
            )}
      <div className="header">
        <h2>Discover Amazing Videos</h2>
        <div className="filter-controls">
          <button 
            onClick={() => setFilter('all')} 
            className={filter === 'all' ? 'active' : ''}
          >
            <FaFilter /> All
          </button>
          <button 
            onClick={() => setFilter('popular')} 
            className={filter === 'popular' ? 'active' : ''}
          >
            <FaHeart /> Popular
          </button>
        </div>
      </div>

      <div className="video-grid">
        {filteredVideos.map(video => (
          <Link to={`/video/${video._id}`} key={video._id} className="homevideo-card">
            <div className="thumbnail-container">
              <div className="play-overlay">
                <FaPlay />
              </div>
              <div className="homevideo-stats">
                <span><FaHeart /> {video.likes}</span>
              </div>
            </div>
            <div className="homevideo-info">
              <h3>{video.title}</h3>
              <p>{video.creator}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;