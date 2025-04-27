import React from "react";
import { useParams, useNavigate } from "react-router-dom";

function Creator() {
  const { username } = useParams();
  const navigate = useNavigate();

  const handleDonate = () => {
    navigate(`/creators/${username}/donate`);
  };

  return (
    <div className="container">
      <h2>{username}</h2>
      <div>
        <button className="fllw-button">
          Follow
        </button>
        <button className="sub-button">
          Subscribe
        </button>
        <button className="sub-button" onClick={handleDonate}>
          Donate
        </button>
      </div>
    </div>
  );
}

export default Creator;
