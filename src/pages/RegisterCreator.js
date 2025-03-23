import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterCreator()
{
    const navigate = useNavigate();
    const [formData, setFormData] = useState({username:"", password:"", email:"", bankNum:""});

    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => 
    {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };

    const validateForm = () => 
    {
        const newErrors = {};
    
        if (!formData.username.trim()) 
        {
          newErrors.username = "Username is required";
        }
    
        if (!formData.password.trim()) 
        {
          newErrors.password = "Password is required";
        }
    
        if (!formData.email.trim()) 
        {
          newErrors.email = "Email is required";
        } 
        else if (!/\S+@\S+\.\S+/.test(formData.email)) 
        {
          newErrors.email = "Email is invalid";
        }
    
        if (!formData.bankNum.trim()) 
        {
          newErrors.bankNum = "Bank number is required";
        } 
        else if (!/^\d+$/.test(formData.bankNum)) 
        {
          newErrors.bankNum = "Bank number must contain only numbers";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => 
    {
        e.preventDefault();
        
        if (validateForm()) {
          // BACKEND
          navigate("/");
        } 
        else 
        {
          console.log("Form has errors");
        }
    };
    


return(
    <div>
      <h2>Register as a Creator</h2>
      <p>Welcome to Amaranth's ever growing community of creators!</p>
      <form className="creatorForm" onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input type="text" name="username" value={formData.username} onChange={handleInputChange}/>
          {errors.username && <span style={{ color: "red" }}>{errors.username}</span>}
        </div>

        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleInputChange}/>
          {errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
        </div>

        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleInputChange}/>
          {errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
        </div>

        <div>
          <label>Bank Number:</label>
          <input type="text" name="bankNum" value={formData.bankNum} onChange={handleInputChange}/>
          {errors.bankNum && <span style={{ color: "red" }}>{errors.bankNum}</span>}
        </div>

        <button type="submit">Let's go!</button>
        </form>
    </div>

)
};

export default RegisterCreator;