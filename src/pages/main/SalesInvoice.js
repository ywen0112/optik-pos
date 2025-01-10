import React, { useState } from "react";
import "../../css/Transaction.css";
import ErrorModal from "../../components/ErrorModal";

const SalesInvoice = () => {
  const [cashInValue, setCashInValue] = useState("");
  const [cashInDescription, setCashInDescription] = useState("");
  const [cashOutValue, setCashOutValue] = useState("");
  const [cashOutDescription, setCashOutDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  const handleAddTransaction = (type) => {
    const amount = type === "Cash In" ? cashInValue : cashOutValue;
    const description = type === "Cash In" ? cashInDescription : cashOutDescription;

    if (!amount || parseFloat(amount) <= 0) {
      setErrorModal({
        isOpen: true,
        title: "Invalid Amount",
        message: `Please enter a valid amount for ${type}.`,
      });
      return;
    }
    

    const newTransaction = {
      type,
      description,
      amount: parseFloat(amount),
    };

    setTransactions([...transactions, newTransaction]);
    type === "Cash In" ? setCashInValue("") : setCashOutValue("");
    type === "Cash In" ? setCashInDescription("") : setCashOutDescription("");
  };

  const calculateTotalAmount = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "Cash In"
        ? total + transaction.amount
        : total - transaction.amount; 
    }, 0);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="cash-management-container">
      <h2>Sales Invoice</h2>
      <div className="cash-management">
        <div className="cash-in">
          <label>Cash In:</label>
          <div className="cash-amount">
            <input
              type="number"
              placeholder="Enter Amount"
              value={cashInValue}
              onChange={(e) => setCashInValue(e.target.value)}
            />
            <button className="add-cash-button" onClick={() => handleAddTransaction("Cash In")}>
              Add
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter Description"
            value={cashInDescription}
            onChange={(e) => setCashInDescription(e.target.value)}
          />
        </div>
        <div className="cash-out">
          <label>Cash Out:</label>
          <div className="cash-amount">
            <input
              type="number"
              placeholder="Enter Amount"
              value={cashOutValue}
              onChange={(e) => setCashOutValue(e.target.value)}
            />
            <button className="add-cash-button" onClick={() => handleAddTransaction("Cash Out")}>
              Add
            </button>
          </div>
          <input
            type="text"
            placeholder="Enter Description"
            value={cashOutDescription}
            onChange={(e) => setCashOutDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="transaction-table">
        <table>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.type}</td>
                <td>{transaction.description}</td>
                <td>{transaction.amount.toFixed(2)}</td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No transactions added
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" style={{ textAlign: "right" }}>
                <strong>Total Amount:</strong>
              </td>
              <td>
                <strong>{calculateTotalAmount().toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseErrorModal}
      />
    </div>
  );
};

export default SalesInvoice;
