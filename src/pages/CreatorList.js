import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function CreatorList() {
    const [creatorData, setCreatorData] = useState([
        { username: "john_doe" },
        { username: "jane_smith" },
        { username: "creator_123" },
        { username: "streamer_abc" }
    ]);


    return (
        <div className="Ccontainer">
            <h2>Creator List</h2>
            <div className="creator-list">
            {creatorData.map((creator) => (
                    <div key={creator.username} className="creator-card">
                    <h3 className="creator-label">{creator.username}</h3>
                    <Link to={`/creators/${creator.username}`} className="creator-link">
                        View Channel
                    </Link>
                </div>
                ))}
            </div>
        </div>
    );
}

export default CreatorList;
