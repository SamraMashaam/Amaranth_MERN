import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function CreatorList() {
  const [creatorData, setCreatorData] = useState([]);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/creators/getAll');
        setCreatorData(response.data);
      } catch (error) {
        console.error("Error fetching creators:", error);
      }
    };

    fetchCreators();
  }, []);

  return (
    <div className="Ccontainer">
      <h2>Creator List</h2>
      <div className="creator-list">
        {creatorData.length > 0 ? (
          creatorData.map((creator) => (
            <div key={creator.username} className="creator-card">
              <h3 className="creator-label">{creator.username}</h3>
              <Link to={`/creators/${creator.username}`} className="creator-link">
                View Channel
              </Link>
            </div>
          ))
        ) : (
          <p>No creators found.</p>
        )}
      </div>
    </div>
  );
}

export default CreatorList;