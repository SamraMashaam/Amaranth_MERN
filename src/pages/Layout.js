import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom"; // Add useNavigate
import axios from "axios";

function Layout({ children }) {
  const [username, setUsername] = useState("");
  const [isCreator, setIsCreator] = useState(false);
  const navigate = useNavigate(); // Add navigate for logout

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      checkUserRole(storedUsername);
    }
  }, []);

  const checkUserRole = async (username) => {
    try {
      const creatorRes = await axios.get(`http://localhost:5000/api/creators/getAll`);
      const isCreatorUser = creatorRes.data.some(creator => creator.username === username);
      setIsCreator(isCreatorUser);
    } catch (err) {
      console.error("Error checking user role:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername("");
    setIsCreator(false);
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <div style={{ width: "250px", background: "#1a1a1a", color: "#fff", padding: "20px" }}>
        <a href="/" style={{ color: '#D17D98', textDecoration: 'none' }}>
          <h2>Amaranth</h2>
        </a>
        <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/">Home</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/accSettings">Settings</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/subs">Subscriptions</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/following">Following</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/creators">Creators</Link>
          <Link style={{ color: "#fff", textDecoration: "none" }} to="/search">Search</Link>
          {username && isCreator && (
            <Link style={{ color: "#fff", textDecoration: "none" }} to="/upload-video">
              Upload Video
            </Link>
          )}
          {username ? (
            <button
              onClick={handleLogout}
              style={{
                color: "#fff",
                background: "none",
                border: "none",
                padding: 0,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          ) : (
            <>
              <Link style={{ color: "#fff", textDecoration: "none" }} to="/viewerlogin">Login as Viewer</Link>
              <Link style={{ color: "#fff", textDecoration: "none" }} to="/creatorlogin">Login as Creator</Link>
            </>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;