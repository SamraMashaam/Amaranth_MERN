import React, { useEffect, useState } from "react";

function HomeViewer() {
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    return (
        <div>
            <h2>Home</h2>
            {username ? (
                <p>Welcome back, {username}!</p>
            ) : (
                <p>Welcome to Amaranth! Please login or register.</p>
            )}
        </div>
    );
}

export default HomeViewer;
