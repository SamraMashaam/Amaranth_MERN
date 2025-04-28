import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function UploadVideo() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      checkUserRole(storedUsername);
    } else {
      navigate("/creatorlogin"); // Redirect to login if not logged in
    }
  }, [navigate]);

  const checkUserRole = async (username) => {
    try {
      const creatorRes = await axios.get(`http://localhost:5000/api/creators/getAll`);
      const isCreatorUser = creatorRes.data.some(creator => creator.username === username);
      setIsCreator(isCreatorUser);
      if (!isCreatorUser) {
        navigate("/");
      }
    } catch (err) {
      console.error("Error checking user role:", err);
      navigate("/");
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);  // Save the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!videoFile) {
      setError("Please select a video file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("title", title);
    uploadData.append("username", username);
    uploadData.append("videoFile", videoFile);

    try {
      const response = await axios.post("http://localhost:5000/api/videos/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        alert("Video uploaded successfully!");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload video. Please try again.");
      console.error("Upload error:", err);
    }
  };

  if (!isCreator) return null; // Don't render until verified

  return (
    <div className="upload-container">
      <h2>Upload a New Video</h2>
      <form className="creatorForm" onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>
        <div>
          <label>Choose Video File:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
        </div>
        {error && <span style={{ color: "red" }}>{error}</span>}
        <button type="submit">Upload Video</button>
      </form>
    </div>
  );
}

export default UploadVideo;
