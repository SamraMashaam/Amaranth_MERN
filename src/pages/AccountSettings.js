import { useState } from "react";

const AccountSettings = () => {
  const [userData, setUserData] = useState({
    username: "john_doe",
    email: "john@example.com",
    age: 25,
    bankAccount: "1234-5678-9012",
    password: "********",
  });

  const [editingField, setEditingField] = useState(null);
  const [newValues, setNewValues] = useState({});

  const handleChange = (field, value) => {
    setNewValues((prev) => ({ ...prev, [field]: value }));
  };

  const saveChanges = (field) => {
    setUserData((prev) => ({
      ...prev,
      [field]: newValues[field] || prev[field],
    }));
    setEditingField(null);
    console.log(`Updating ${field} to:`, newValues[field]); // Placeholder for backend update
  };

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
                defaultValue={userData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="settings-input"
              />
            ) : (
              <span className="settings-value">{userData[field]}</span>
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
