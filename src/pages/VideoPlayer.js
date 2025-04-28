import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FaPlay, FaPause, FaBackward, FaForward, FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";

const VideoPlayer = () =>
{
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showFlag, setShowFlag] = useState(false);
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState("");

    useEffect(() => {
      const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
        const fetchVideo = async () => 
        {
          try 
          {
            const res = await axios.get(`http://localhost:5000/api/videos/${id}`);
            setVideo(res.data);
            setComments(res.data.comments || []);
          } catch (err) {
            console.error("Error fetching video:", err);
          } finally {
            setLoading(false);
          }
        };
        fetchVideo();
      }, [id]);

    const playButton = () =>
    {
        if(videoRef.current.paused)
        {
            videoRef.current.play();
            setIsPlaying(true);
        }
        else
        {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const skip = (seconds) =>
    {
        videoRef.current.currentTime += seconds;
    };

    const likes = async () => {
        try {
          if (liked) {
            await axios.put(`http://localhost:5000/api/videos/${id}/unlike`);
            setLiked(false);
          } else {
            await axios.put(`http://localhost:5000/api/videos/${id}/like`);
            setLiked(true);
            if (disliked) {
              await axios.put(`http://localhost:5000/api/videos/${id}/undislike`);
              setDisliked(false);
            }
          }
        } catch (err) {
          console.error("Error updating like:", err);
        }
      };
      
      const dislikes = async () => {
        try {
          if (disliked) {
            await axios.put(`http://localhost:5000/api/videos/${id}/undislike`);
            setDisliked(false);
          } else {
            await axios.put(`http://localhost:5000/api/videos/${id}/dislike`);
            setDisliked(true);
            if (liked) {
              await axios.put(`http://localhost:5000/api/videos/${id}/unlike`);
              setLiked(false);
            }
          }
        } catch (err) {
          console.error("Error updating dislike:", err);
        }
      };

    const commentSubmit = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
          try {
            const res = await axios.post(`http://localhost:5000/api/videos/${id}/comments`, {
              text: newComment,
              user: username // Replace with actual user later
            });
            setComments([...comments, { 
              _id: res.data._id, 
              user: res.data.user, 
              text: res.data.text 
            }]);
            setNewComment("");
          } catch (err) {
            console.error("Error posting comment:", err);
          }
        }
      };

    const handleFlag = () =>
    {
        setShowFlag(true);
    };

    const confirmFlag = () =>
    {
        alert("Thanks for letting us know!");
        setShowFlag(false);
    }

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>Video not found!</div>;

    return (
        <div className="video-player">
            <div className="video-section">
                <div className="videoContainer">
                    <video ref={videoRef} controls={false} autoPlay onError={(e) => console.error("Video error:", e.target.error)}>
                    <source src={video.videoUrl} type="video/mp4" />
                        If you are seeing this message, your browser does not support the video!
                    </video>
                </div>
                <div className="video-controls-feedback">
                    <div className="controls">
                        <button onClick={playButton}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                        <button onClick={() => skip(-10)}><FaBackward /></button>
                        <button onClick={() => skip(10)}><FaForward /></button>
                    </div>
                    <div className="title-feedback">
                    <h2>{video.title}</h2>
                    <p>{video.creator}</p>
                    <div className="feedback">
                        <button onClick={likes} style={{ color: liked ? "#D17D98" : "#F4CCE9" }}><FaThumbsUp />{video.likes + (liked ? 1 : 0)}</button>
                        <button onClick={dislikes} style={{ color: disliked ? "#D17D98" : "#F4CCE9" }}><FaThumbsDown />{video.dislikes + (disliked ? 1 : 0)}</button>
                        <button onClick={handleFlag}><FaFlag /></button>
                        {showFlag && (
                            <div className="modal">
                                <p>Are you sure you want to flag this video?</p>
                                <button onClick={confirmFlag}>Yes</button>
                                <button onClick={() => setShowFlag(false)}>No</button>
                            </div>
                        )}
                    </div>
                    </div>
                </div>
            </div>
    
            <div className="comments">
                <h3>Comments:</h3>
                <form onSubmit={commentSubmit}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts" />
                    <button type="submit">Post comment</button>
                </form>
                <ul>
                    {comments.map((comment) => (
                    <li key={comment._id}>
                    <strong>{comment.user}:</strong> {comment.text}
                    </li>
                ))}
                </ul>
            </div>
        </div>
    );
}

export default VideoPlayer;