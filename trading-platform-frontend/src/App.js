import React, { useState, useEffect } from 'react';
// Import your components here
import Header from './Header';
import StockList from './StockList';
import TradeForm from './TradeForm';
import AccountForm from './AccountForm';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Portfolio from './Portfolio';
import Modal from './Modal';
import axios from 'axios';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [portfolio, setPortfolio] = useState([]); // Add this line
    const [balance, setBalance] = useState(0);

    // More state variables like user balance, stock data, etc.

    // Example of how you might fetch portfolio data upon login
    useEffect(() => {
        if (isLoggedIn) {
            fetchBalance();
            fetchPortfolio();
        }
    }, [isLoggedIn]);

    const fetchBalance = async () => {
        // Logic to fetch balance from the backend
        // Example:
        const token = localStorage.getItem('userToken');
        try {
            const response = await axios.get('http://localhost:5000/user/balance', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
            // Handle error...
        }
    };

    const fetchPortfolio = async () => {
        const token = localStorage.getItem('userToken'); // Retrieve the stored token
    
        const yourConfig = {
            headers: {
                Authorization: `Bearer ${token}` // Attach the token in the Authorization header
            }
        };
    
        try {
            const response = await axios.get('http://localhost:5000/user/portfolio', yourConfig);
            setPortfolio(response.data.portfolio);
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            // Handle error...
        }
    };    

    return (
        <div>
            <Header 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                onShowLogin={() => setShowLoginModal(true)} 
                onShowRegister={() => setShowRegisterModal(true)}
            />
            <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
                <LoginForm setIsLoggedIn={setIsLoggedIn} setShowLoginModal={setShowLoginModal} />
            </Modal>

            <Modal isOpen={showRegisterModal} onClose={() => setShowRegisterModal(false)}>
                <RegisterForm setIsLoggedIn={setIsLoggedIn} setShowRegisterModal={setShowRegisterModal} />
            </Modal>
            <StockList />
            {isLoggedIn &&
                <>
                    <Portfolio balance={balance} portfolio={portfolio} />
                    <TradeForm setPortfolio={setPortfolio} setBalance={setBalance} />
                    <AccountForm balance={balance} setBalance={setBalance} />
                </>
            }
        </div>
    );    
}

export default App;
