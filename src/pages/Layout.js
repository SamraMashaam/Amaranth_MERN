import React from "react";

import { Link, Outlet } from "react-router-dom"; // <-- Import Outlet

function Layout({ children }) {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Sidebar */}
            <div style={{ width: "250px", background: "#1a1a1a", color: "#fff", padding: "20px" }}>
            <a href="/" style={{ color: '#D17D98', textDecoration: 'none' }}>
            <h2>Amaranth</h2>
            </a>
                
                <nav style={{ display: "flex", flexDirection: "column", gap: "15px", marginTop: "30px" }}>
                    <Link style={{ color: "#fff", textDecoration: "none" }} to="/accSettings">Settings</Link>
                    <Link style={{ color: "#fff", textDecoration: "none" }} to="/subs">Subscriptions</Link>
                    <Link style={{ color: "#fff", textDecoration: "none" }} to="/following">Following</Link>
                    <Link style={{ color: "#fff", textDecoration: "none" }} to="/creators">Creators</Link>
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
