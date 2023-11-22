// src/TradeForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './TradeForm.css';

const TradeForm = ({ setPortfolio, setBalance }) => {
    const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('userToken'); // Retrieve the stored token
        
        // Determine the correct endpoint based on the trade type
        const endpoint = tradeType === 'buy' ? '/stocks/buy' : '/stocks/sell';
        const url = `http://localhost:5000${endpoint}`;

        try {
            const response = await axios.post(url, {
                stockSymbol,
                quantity: Number(quantity),
                // ... other data if necessary
            }, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token in the Authorization header
                }
            });
            // Handle the response here (e.g., show success message)
            if (response.status === 200) {
                alert(response.data.message);
                fetchPortfolio(); // Update portfolio
                fetchBalance();  // Update balance
            }
        } catch (error) {
            console.error("Trade error:", error.response.data.message);
            alert(error.response.data.message);
        }        
    };

    const fetchBalance = async () => {
        const token = localStorage.getItem('userToken'); // Retrieve the stored token
        const url = 'http://localhost:5000/user/balance'; // URL of your balance endpoint
    
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token in the Authorization header
                }
            });
    
            if (response.status === 200) {
                setBalance(response.data.balance); // Update the balance state
            }
        } catch (error) {
            console.error("Error fetching balance:", error);
            // Handle error (e.g., show an error message)
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
        <form className="trade-form" onSubmit={handleSubmit}>
            <h2>Trade Stocks</h2>

            <label>
                Trade Type:
                <select value={tradeType} onChange={e => setTradeType(e.target.value)}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                </select>
            </label>

            <label>
                Stock Symbol:
                <input
                    type="text"
                    value={stockSymbol}
                    onChange={e => setStockSymbol(e.target.value)}
                    required
                />
            </label>

            <label>
                Quantity:
                <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                />
            </label>

            <button type="submit">Execute Trade</button>
        </form>
    );
};

export default TradeForm;
