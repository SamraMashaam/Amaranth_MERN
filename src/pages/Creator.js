import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function Creator() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followId, setFollowId] = useState(null);
  const [viewerUsername, setViewerUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setViewerUsername(storedUsername);
      checkSubscription(storedUsername);
      checkFollow(storedUsername);
    }
  }, [username]);

  const checkSubscription = async (viewerUsername) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/subscriptions/${viewerUsername}`);
      const subscription = res.data.find(sub => sub.creator === username && sub.status === 'active');
      setIsSubscribed(!!subscription);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  };

  const checkFollow = async (viewerUsername) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/follows/${viewerUsername}`);
      const follow = res.data.find(f => f.creator === username && f.isFollowing);
      if (follow) {
        setIsFollowing(true);
        setFollowId(follow._id);
      }
    } catch (err) {
      console.error("Error checking follow:", err);
    }
  };

  const handleFollow = async () => {
    if (!viewerUsername) {
      navigate("/viewerlogin");
      return;
    }

    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/follows/${followId}`);
        setIsFollowing(false);
        setFollowId(null);
        toast.success(`Unfollowed ${username}`);
      } else {
        const res = await axios.post(`http://localhost:5000/api/follows`, {
          viewerUsername,
          creatorUsername: username,
        });
        setIsFollowing(true);
        setFollowId(res.data._id);
        toast.success(`Following ${username}`);
      }
    } catch (err) {
      console.error("Follow error:", err);
      toast.error("Failed to update follow status");
    }
  };

  const handleSubscribe = async () => {
    if (!viewerUsername) {
      navigate("/viewerlogin");
      return;
    }

    try {
      if (isSubscribed) {
        const res = await axios.get(`http://localhost:5000/api/subscriptions/${viewerUsername}`);
        const subscription = res.data.find(sub => sub.creator === username && sub.status === 'active');
        if (subscription) {
          await axios.put(`http://localhost:5000/api/subscriptions/${subscription._id}/cancel`);
          setIsSubscribed(false);
          toast.success(`Unsubscribed from ${username}`);
        }
      } else {
        await axios.post(`http://localhost:5000/api/subscriptions`, {
          viewerUsername,
          creatorUsername: username,
          planType: "Premium",
          price: 9.99,
        });
        setIsSubscribed(true);
        toast.success(`Subscribed to ${username}`);
      }
    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Failed to update subscription");
    }
  };

  const handleDonate = () => {
    navigate(`/creators/${username}/donate`);
  };

  return (
    <div className="container">
      <h2>{username}</h2>
      <div>
        <button className="fllw-button" onClick={handleFollow}>
          {isFollowing ? "Unfollow" : "Follow"}
        </button>
        <button className="sub-button" onClick={handleSubscribe}>
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
        <button className="sub-button" onClick={handleDonate}>
          Donate
        </button>
      </div>
    </div>
  );
}

export default Creator;