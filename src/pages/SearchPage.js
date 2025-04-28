import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchVideos = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/videos/search?q=${query}`);
      setVideos(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      searchVideos();
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="search-page">
      <h1>Search Videos</h1>
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for videos..."
        />
        <button onClick={searchVideos}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="video-results">
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video._id} className="video-card">
              <Link to={`/video/${video._id}`} className="video-link">
                <h3>{video.title}</h3>
                <p>By: {video.creator}</p>
                <small>Likes: {video.likes}</small>
              </Link>
            </div>
          ))
        ) : (
          <p>No videos found. Try another search.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;