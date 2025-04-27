import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginViewer()
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username:"", password:""});
    const [error, setError] = useState("");

    const handleInputChange = (e) => 
    {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const handleSubmit = async (e) => 
    {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch('http://localhost:5000/api/viewers/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
              console.log(data.message);
              localStorage.setItem("username", formData.username);
              navigate("/"); 
            } else {
              setError(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Server error. Please try again.');
        }
    };

    return(
        <div>
          <h2>Login as Viewer</h2>
          <p>Welcome back to Amaranth!</p>
          <form className="creatorForm" onSubmit={handleSubmit}>
            <div>
              <label>Username:</label>
              <input type="text" name="username" value={formData.username} onChange={handleInputChange}/>
            </div>

            <div>
              <label>Password:</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange}/>
            </div>

            {error && <span style={{ color: "red" }}>{error}</span>}

            <button type="submit">Login</button>
          </form>
          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#F4CCE9' }}>
            Don't have an account?{' '}
            <a href="/registerviewer" style={{ color: '#D17D98', textDecoration: 'underline' }}>
                Register here
            </a>
            </p>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: '#F4CCE9' }}>
            Are you a creator?{' '}
            <a href="/creatorlogin" style={{ color: '#D17D98', textDecoration: 'underline' }}>
                Sign In
            </a>
            </p>
        </div>
    )
};

export default LoginViewer;
