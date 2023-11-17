// src/LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ setIsLoggedIn }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = 'http://localhost:5000/auth/login'; // Adjust URL based on your backend
        const data = { username, password };

        try {
            const response = await axios.post(url, data);
            // Handle the response here. Typically, you would save the JWT token received
            // and update the logged-in state of the user.
            console.log(response.data); // You might want to replace this with proper action
            setIsLoggedIn(true); // Update the logged-in state
        } catch (error) {
            console.error("Login error:", error);
            // Handle error (e.g., show an error message)
            setIsLoggedIn(false);
        }
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h2>Login</h2>

            <label>
                Username:
                <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
            </label>

            <label>
                Password:
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </label>

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
