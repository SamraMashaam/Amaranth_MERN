import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Creator(){
    const { username } = useParams();
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
                <button className="sub-button">
                    Donate
                </button>
                </div>
            </div>
            
        );
}

export default Creator;