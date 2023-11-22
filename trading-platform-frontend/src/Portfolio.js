// Portfolio.js
import React from 'react';
import './Portfolio.css';

const Portfolio = ({ portfolio, balance }) => { // If balance is passed as a prop
    // Use the 'portfolio' prop directly to render portfolio data
    // ...

    return (
        <div className="portfolio">
            <h2>My Balance: ${balance.toFixed(2)}</h2>
            <h3>My Portfolio</h3>
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
                            <td>{item.stockSymbol}</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Portfolio;
