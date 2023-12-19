// src/RegisterForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';

const RegisterForm = ({ setIsLoggedIn, setShowRegisterModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                password
            });
            // Handle successful registration (e.g., logging in the user)
            alert(response.data.message);
            setIsLoggedIn(true); // Assuming successful registration logs the user in
            setShowRegisterModal(false)
        } catch (error) {
            console.error("Registration error:", error.response.data.message);
            alert(error.response.data.message);
        }
    };

    return (
        <form onSubmit={handleRegister} className="register-form">
            <h2>Register</h2>
            <label>
                Username:
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </label>
            <label>
                Password:
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
