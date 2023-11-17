// src/Portfolio.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Portfolio.css';

const Portfolio = () => {
    const [portfolio, setPortfolio] = useState([]);

    // In your Portfolio component
useEffect(() => {
    const fetchPortfolio = async () => {
        try {
            const token = localStorage.getItem('userToken'); // Retrieve the stored token
            const response = await axios.get('http://localhost:5000/user/portfolio', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPortfolio(response.data.portfolio);
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            // Handle errors (e.g., redirect to login if unauthorized)
        }
    };

    fetchPortfolio();
}, []);


    return (
        <div className="portfolio">
            <h2>My Portfolio</h2>
            <table>
                <thead>
                    <tr>
                        <th>Stock Symbol</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {portfolio.map((item, index) => (
                        <tr key={index}>
                            <td>{item.symbol}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;
