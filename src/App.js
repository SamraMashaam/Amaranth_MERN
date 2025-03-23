import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterViewer from "./pages/RegisterViewer";
// import loginViewer from "./pages/loginViewer";
 import AccountSettings from "./pages/AccountSettings";
 import CreatorList from "./pages/CreatorList";
 import Creator from "./pages/Creator";
 import RegisterCreator from "./pages/RegisterCreator";
 import VideoPlayer from "./pages/VideoPlayer";
 import { Subscriptions } from "./pages/Subscriptions";
 import { Following } from "./pages/Following";

function App() {
    return (
        <Router>
            <nav>
                <Link to="/">Home</Link> | 
                <Link to="/registerviewer">Sign-Up</Link> |
                <Link to="/registercreator">Sign-Up</Link> |
                <Link to="/playvideo">Video</Link> |
                <Link to="/accSettings">Settings</Link> |
                <Link to="/subs">Subscriptions</Link> |
                <Link to="/following">Following</Link> |
                <Link to="/creators">Creators</Link>
            </nav>

            <Routes>
                <Route path="/registerviewer" element={<RegisterViewer />} />
                <Route path="/registercreator" element={<RegisterCreator />} />
                <Route path="/playvideo" element={<VideoPlayer />} />
                <Route path="/accSettings" element={<AccountSettings />} />
                <Route path="/creators" element={<CreatorList />} />
                <Route path="/subs" element={<Subscriptions />} />
                <Route path="/following" element={<Following />} />
                <Route path="/creators/:username" element={<Creator/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
