import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockList.css';

const StockList = () => {
    const [stocks, setStocks] = useState({});

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const response = await axios.get('http://localhost:5000/latest-stocks'); 
                setStocks(response.data); 
            } catch (error) {
                console.error("Error fetching stocks:", error);
            }
        };

        fetchStocks();
    }, []);

    return (
        <div className="stock-list">
            <h2>Latest Stock Prices</h2>
            <table>
                <thead>
                    <tr>
                        <th>Symbol</th>
                        <th>Date</th>
                        <th>Close Price</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(stocks).map(([symbol, data]) => (
                        <tr key={symbol}>
                            <td>{symbol}</td>
                            <td>{data.date}</td>
                            <td>${data.close.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default StockList;
