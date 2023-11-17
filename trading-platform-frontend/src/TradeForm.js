// src/TradeForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './TradeForm.css';


const TradeForm = () => {
    const [tradeType, setTradeType] = useState('buy'); // 'buy' or 'sell'
    const [stockSymbol, setStockSymbol] = useState('');
    const [quantity, setQuantity] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = `http://localhost:5000/stocks/${tradeType}`; // Adjust URL based on your backend
        const data = {
            stockSymbol,
            quantity: Number(quantity),
        };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: 'Bearer yourTokenHere', // Replace with actual token
                },
            });
            alert(response.data.message); // Show success message
            // Reset form or additional actions on success
        } catch (error) {
            console.error("Trade error:", error);
            // Handle error (e.g., show an error message)
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
