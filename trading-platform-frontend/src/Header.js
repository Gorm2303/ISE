// src/Header.js

import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn, onShowLogin, onShowRegister }) => {
    const handleLogout = () => {
        // Set the logged in state to false
        setIsLoggedIn(false);
    
        // Clear any stored user data or tokens. 
        // This depends on where and how you're storing these data.
        localStorage.removeItem('userToken'); // Assuming the token is stored in localStorage with the key 'userToken'
    };

    return (
        <header className="header">
            <h1>Trading Platform</h1>
            <nav>
                {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                ) : (
                    // Show a login button or link if not logged in
                    <>
                        <button onClick={onShowLogin}>Login</button>
                        <button onClick={onShowRegister}>Register</button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
