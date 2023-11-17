import React, { useState, useEffect } from 'react';
// Import your components here
import Header from './Header';
import StockList from './StockList';
import TradeForm from './TradeForm';
import AccountForm from './AccountForm';
import LoginForm from './LoginForm';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // More state variables like user balance, stock data, etc.

    useEffect(() => {
        // Optionally check user's auth status on initial load
    }, []);

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <StockList />
            {isLoggedIn ? (
                <>
                    <TradeForm />
                    <AccountForm />
                </>
            ) : (
                <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
        </div>
    );
}

export default App;
