// src/AccountForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './AccountForm.css';

const AccountForm = () => {
    const [actionType, setActionType] = useState('deposit'); // 'deposit' or 'withdraw'
    const [amount, setAmount] = useState(0);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = `http://localhost:5000/account/${actionType}`; // Adjust URL based on your backend
        const data = { amount: Number(amount) };

        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: 'Bearer yourTokenHere', // Replace with actual token
                },
            });
            alert(response.data.message); // Show success message
            // Reset form or additional actions on success
        } catch (error) {
            console.error("Account action error:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <form className="account-form" onSubmit={handleSubmit}>
            <h2>Account Management</h2>

            <label>
                Action:
                <select value={actionType} onChange={e => setActionType(e.target.value)}>
                    <option value="deposit">Deposit</option>
                    <option value="withdraw">Withdraw</option>
                </select>
            </label>

            <label>
                Amount:
                <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                />
            </label>

            <button type="submit">Execute {actionType}</button>
        </form>
    );
};

export default AccountForm;
