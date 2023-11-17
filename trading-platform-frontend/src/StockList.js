// src/StockList.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockList.css';

const StockList = () => {
    const [stocks, setStocks] = useState([]);

    useEffect(() => {
        // Function to fetch stocks from the backend
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/stocks'); // Adjust the URL based on your backend
                setStocks(response.data);
            } catch (error) {
                console.error("Error fetching stocks:", error);
                // Handle errors here (e.g., show a notification to the user)
            }
        };

        fetchStocks();
    }, []); // Empty dependency array ensures this runs once on component mount

    return (
        <div className="stock-list">
            <h2>Available Stocks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map(stock => (
                        <tr key={stock.id}>
                            <td>{stock.symbol}</td>
                            <td>{stock.name}</td>
                            <td>${stock.price.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
