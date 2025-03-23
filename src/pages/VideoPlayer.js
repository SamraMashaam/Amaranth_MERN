import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay, FaPause, FaBackward, FaForward, FaThumbsUp, FaThumbsDown, FaFlag } from "react-icons/fa";

const VideoPlayer = () =>
{
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [liked, setLiked] = useState(false);
    const [disliked, setDisliked] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [showFlag, setShowFlag] = useState(false);

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

    const likes = () =>
    {
        setLiked(!liked);
        if (disliked) setDisliked(false);
    };

    const dislikes = () =>
    {
        setDisliked(!disliked);
        if (liked) setLiked(false);
    };

    const commentSubmit = (e) =>
    {
        e.preventDefault();
        if (newComment.trim())
        {
            setComments([...comments, newComment]);
            setNewComment("");
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

    return (
        <div className="video-player">
            <div className="video-section">
                <div className="videoContainer">
                    <video ref={videoRef} controls={false}>
                        <source src="/videos/samplevideo.mp4" type="video/mp4" />
                        If you are seeing this message, your browser does not support the video tag!
                    </video>
                </div>
                <div className="video-controls-feedback">
                    <div className="controls">
                        <button onClick={playButton}>{isPlaying ? <FaPause /> : <FaPlay />}</button>
                        <button onClick={() => skip(-10)}><FaBackward /></button>
                        <button onClick={() => skip(10)}><FaForward /></button>
                    </div>
                    <h2>Video Title</h2>
                    <div className="feedback">
                        <button onClick={likes} style={{ color: liked ? "#D17D98" : "#F4CCE9" }}><FaThumbsUp /></button>
                        <button onClick={dislikes} style={{ color: disliked ? "#D17D98" : "#F4CCE9" }}><FaThumbsDown /></button>
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
    
            <div className="comments">
                <h3>Comments:</h3>
                <form onSubmit={commentSubmit}>
                    <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Share your thoughts" />
                    <button type="submit">Post comment</button>
                </form>
                <ul>
                    {comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default VideoPlayer;