// src/LoginForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ setIsLoggedIn, setShowLoginModal }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Form submitted'); // Check if this logs when you click the login button

        const url = 'http://localhost:5000/auth/login'; // Adjust URL based on your backend
        const data = { username, password };

        try {
            const response = await axios.post(url, data);
            // Handle the response here. Typically, you would save the JWT token received
            // and update the logged-in state of the user.
            console.log(response.data); // You might want to replace this with proper action
            // Assuming the JWT is in the 'token' field of the response
            localStorage.setItem('userToken', response.data.token);
            setIsLoggedIn(true); // Update the logged-in state
            setShowLoginModal(false)
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
