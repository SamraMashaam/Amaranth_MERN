import { useState, useEffect } from "react";
import axios from "axios";

const AccountSettings = () => {
  const [userData, setUserData] = useState({});
  const [editingField, setEditingField] = useState(null);
  const [newValues, setNewValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    console.log(storedUser)
    if (storedUser) {
      fetchUserData(storedUser);
    }
  }, []);

  const fetchUserData = async (username) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/user/${username}`);
      setUserData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setNewValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = async (field) => {
    const updatedValue = newValues[field];

    try {
      await axios.put("http://localhost:5000/api/user/update", {
        username: userData.username, // important: identify which user
        field,
        value: updatedValue,
      });

      setUserData((prev) => ({
        ...prev,
        [field]: updatedValue || prev[field],
      }));

      setEditingField(null);
      console.log(`Updated ${field} successfully`);
    } catch (error) {
      console.error(`Failed to update ${field}`, error);
    }
  };
  
  if (loading) {
    return <p>Loading account settings...</p>;
  }

  return (
    <div className="settings-container">
      <h2 className="settings-title">Account Settings</h2>
      <div className="settings-grid">
        {Object.keys(userData).map((field) => (
          <div key={field} className="settings-row">
            <label className="settings-label">{field}:</label>

            {editingField === field ? (
              <input
                type={field === "password" ? "password" : "text"}
                defaultValue={field === "password" ? "" : userData[field]}
                placeholder={field === "password" ? "Enter new password" : ""}
                onChange={(e) => handleChange(field, e.target.value)}
                className="settings-input"
              />
            ) : (
              <span className="settings-value">
                {field === "password" ? "********" : userData[field]}
              </span>
            )}

            {editingField === field ? (
              <button onClick={() => saveChanges(field)} className="save-btn">
                Save
              </button>
            ) : (
              <button onClick={() => setEditingField(field)} className="edit-btn">
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSettings;