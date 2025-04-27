import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DonationPage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState(10);

  const handleDonate = async () => {
    try {
      await axios.post(`http://localhost:5000/api/creators/donate/${username}`, { amount: selectedAmount });
      alert(`Successfully donated $${selectedAmount} to ${username}!`);
      navigate(`/creators/${username}`);
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed. Please try again.");
    }
  };

  return (
    <div className="donation-container">
      <h2>Donate to {username}</h2>
      <div className="amount-options">
        <button onClick={() => setSelectedAmount(10)} className={selectedAmount === 10 ? "" : "tab-button"}>$10</button>
        <button onClick={() => setSelectedAmount(20)} className={selectedAmount === 20 ? "" : "tab-button"}>$20</button>
        <button onClick={() => setSelectedAmount(50)} className={selectedAmount === 50 ? "" : "tab-button"}>$50</button>
      </div>
      <button onClick={handleDonate} className="confirm-donate-button">
        Confirm Donation
      </button>
    </div>
  );
}

export default DonationPage;