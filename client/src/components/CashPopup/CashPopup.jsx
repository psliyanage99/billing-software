import React, { useState } from "react";
import "./CashPopup.css";

const CashPopup = ({ grandTotal, onClose, onSubmit }) => {
  const [cash, setCash] = useState("");

  const handleCashSubmit = () => {
    const cashValue = parseFloat(cash);
    if (isNaN(cashValue) || cashValue < grandTotal) {
      alert("Insufficient cash. Please enter a valid amount.");
      return;
    }
    onSubmit(cashValue);  // send back to CartSummary
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCashSubmit();
    }
  };

  return (
    <div className="cash-popup-overlay">
      <div className="cash-popup-content">
        <h4>Cash Payment</h4>
        <p>
          Total Amount: <strong>Rs.{grandTotal.toFixed(2)}</strong>
        </p>

        <input
          type="number"
          placeholder="Enter cash received"
          className="form-control mb-3"
          value={cash}
          // id={cash}
          onChange={(e) => setCash(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleCashSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashPopup;
