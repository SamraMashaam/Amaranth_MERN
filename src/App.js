import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterViewer from "./pages/RegisterViewer";
import LoginViewer from "./pages/LoginViewer";
import AccountSettings from "./pages/AccountSettings";
import CreatorList from "./pages/CreatorList";
import Creator from "./pages/Creator";
import RegisterCreator from "./pages/RegisterCreator";
import VideoPlayer from "./pages/VideoPlayer";
import { Subscriptions } from "./pages/Subscriptions";
import { Following } from "./pages/Following";
import HomePage from "./pages/HomePage";
import LoginCreator from "./pages/LoginCreator";
import Layout from "./pages/Layout";
import DonationPage from "./pages/DonationPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Pages WITHOUT Layout (no sidebar) */}
                <Route path="/registerviewer" element={<RegisterViewer />} />
                <Route path="/registercreator" element={<RegisterCreator />} />
                <Route path="/viewerlogin" element={<LoginViewer />} />
                <Route path="/creatorlogin" element={<LoginCreator />} />

                {/* Pages WITH Layout (sidebar) */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/playvideo" element={<VideoPlayer />} />
                    <Route path="/accSettings" element={<AccountSettings />} />
                    <Route path="/subs" element={<Subscriptions />} />
                    <Route path="/following" element={<Following />} />
                    <Route path="/creators" element={<CreatorList />} />
                    <Route path="/creators/:username" element={<Creator />} />
                    <Route path="/creators/:username/donate" element={<DonationPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;