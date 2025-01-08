import React, { useState, useEffect } from "react";
import "../../css/Transaction.css";
import ErrorModal from "../../components/ErrorModal"; // Import the ErrorModal component

const Transaction = () => {
  const [formData, setFormData] = useState({
    openCounter: "",
    closeCounter: "",
    cashInValue: "",
    cashInDescription: "",
    cashOutValue: "",
    cashOutDescription: "",
  });
  const [historyData, setHistoryData] = useState([]);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transaction history");
        }
        const data = await response.json();
        setHistoryData(data);
      } catch (error) {
        setErrorModal({
          isOpen: true,
          title: "Error Fetching Data",
          message: error.message,
        });
        console.error("Error fetching history data:", error);
      }
    };
    fetchHistory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (transactionType) => {
    const transactionData = {
      transactionType,
      description:
        transactionType === "Cash In"
          ? formData.cashInDescription
          : transactionType === "Cash Out"
          ? formData.cashOutDescription
          : "",
      amount:
        transactionType === "Cash In"
          ? formData.cashInValue
          : transactionType === "Cash Out"
          ? formData.cashOutValue
          : formData[transactionType.toLowerCase().replace(" ", "")],
    };
  
    console.log("Data being sent to API:", transactionData);
  
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transactionData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit transaction");
      }
  
      const updatedData = await response.json();
      setHistoryData(updatedData);
  
      //After a successful API call, setFormData is used to clear only the relevant fields
      setFormData((prevData) => ({
        ...prevData,
        [transactionType === "Open Counter" ? "openCounter" : 
         transactionType === "Close Counter" ? "closeCounter" : 
         transactionType === "Cash In" ? "cashInValue" : "cashOutValue"]: "",
        [transactionType === "Cash In" ? "cashInDescription" : 
         transactionType === "Cash Out" ? "cashOutDescription" : ""]: "",
      }));
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Submitting Transaction",
        message: error.message,
      });
      console.error("Error submitting transaction:", error);
    }
  };

  const handleCloseModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="transaction-container">
      <div className="management-section">
        <div className="counter-management">
          <h3>Counter Management</h3>
          <div className="form-group">
            <label>Open Counter:</label>
            <div className="value-form-group">
              <input
                type="number"
                name="openCounter"
                value={formData.openCounter}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
              <span className="transaction-button">
                <button onClick={() => handleSubmit("Open Counter")}>Submit</button>
              </span>
            </div>
          </div>
          <div className="form-group">
            <label>Close Counter:</label>
            <div className="value-form-group">
              <input
                type="number"
                name="closeCounter"
                value={formData.closeCounter}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
              <span className="transaction-button">
                <button onClick={() => handleSubmit("Close Counter")}>Submit</button>
              </span>
            </div>
          </div>
        </div>
        <div className="cash-management">
          <h3>Cash Management</h3>
          <div className="form-group">
            <label>Cash In:</label>
            <div className="value-form-group">
              <input
                type="number"
                name="cashInValue"
                value={formData.cashInValue}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
              <span className="transaction-button">
                <button onClick={() => handleSubmit("Cash In")}>Submit</button>
              </span>
            </div>
            <input
              type="text"
              name="cashInDescription"
              value={formData.cashInDescription}
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>
          <div className="form-group">
            <label>Cash Out:</label>
            <div className="value-form-group">
              <input
                type="number"
                name="cashOutValue"
                value={formData.cashOutValue}
                onChange={handleInputChange}
                placeholder="Enter amount"
              />
              <span className="transaction-button">
                <button onClick={() => handleSubmit("Cash Out")}>Submit</button>
              </span>
            </div>
            <input
              type="text"
              name="cashOutDescription"
              value={formData.cashOutDescription}
              onChange={handleInputChange}
              placeholder="Description"
            />
          </div>
        </div>
      </div>

      <h3>Transaction History</h3>
      <table className="transaction-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Transaction Type</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {historyData.map((entry, index) => (
            <tr key={entry.id || index}>
              <td>{index + 1}</td>
              <td>{entry.transactionType}</td>
              <td>{entry.description}</td>
              <td>{entry.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Transaction;
