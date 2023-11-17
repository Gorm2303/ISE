// src/Header.js

import React from 'react';
import './Header.css';

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
    const handleLogout = () => {
        // Logic to handle logout
        // This should also involve clearing any stored authentication tokens or user data
        setIsLoggedIn(false);
    };

    return (
        <header className="header">
            <h1>Trading Platform</h1>
            <nav>
                {isLoggedIn ? (
                    <>
                        <button onClick={handleLogout}>Logout</button>
                        {/* Add more buttons or links for deposit/withdraw here */}
                    </>
                ) : (
                    // Show a login button or link if not logged in
                    <button onClick={() => {/* Logic to show login form */}}>
                        Login
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
