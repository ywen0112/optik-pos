import React, { useState } from "react";
import "../../css/Transaction.css";
import ErrorModal from "../../components/ErrorModal";

const SalesInvoice = () => {
  const [customerName, setCustomerName] = useState("");
  const [items, setItems] = useState([]);
  const [eyePower, setEyePower] = useState({ left: "", right: "" });
  const [locationId, setLocationId] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPayment, setNewPayment] = useState({ method: "", amount: "" });
  const [outstandingAmount, setOutstandingAmount] = useState(0);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  const handleAddItem = () => {
    if (!locationId) {
      setErrorModal({
        isOpen: true,
        title: "Missing Location",
        message: "Please provide a valid location ID for item pick-up.",
      });
      return;
    }

    const newItem = {
      id: items.length + 1,
      eyePower: { ...eyePower },
      locationId,
    };
    setItems([...items, newItem]);
    setEyePower({ left: "", right: "" });
    setLocationId("");
  };

  const handleAddPayment = () => {
    if (!newPayment.method || parseFloat(newPayment.amount) <= 0) {
      setErrorModal({
        isOpen: true,
        title: "Invalid Payment",
        message: "Please provide a valid payment method and amount.",
      });
      return;
    }

    const payment = {
      method: newPayment.method,
      amount: parseFloat(newPayment.amount),
    };
    setPaymentMethods([...paymentMethods, payment]);
    setNewPayment({ method: "", amount: "" });

    const totalPayments = paymentMethods.reduce((total, p) => total + p.amount, 0) + payment.amount;
    setOutstandingAmount(Math.max(0, outstandingAmount - totalPayments));
  };

  const handleSubmitInvoice = () => {
    if (!customerName || items.length === 0) {
      setErrorModal({
        isOpen: true,
        title: "Incomplete Invoice",
        message: "Please fill in all required details and add at least one item.",
      });
      return;
    }

    // Submit invoice logic here
    console.log("Invoice Submitted:", {
      customerName,
      items,
      paymentMethods,
      outstandingAmount,
    });

    resetForm();
  };

  const resetForm = () => {
    setCustomerName("");
    setItems([]);
    setEyePower({ left: "", right: "" });
    setLocationId("");
    setPaymentMethods([]);
    setNewPayment({ method: "", amount: "" });
    setOutstandingAmount(0);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="sales-invoice-container">
      <h2>Sales Invoice</h2>
      <div className="invoice-form">
        <label>Customer Name:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Enter Customer Name"
        />

        <h3>Eye Power</h3>
        <div className="eye-power-inputs">
          <label>Left:</label>
          <input
            type="number"
            value={eyePower.left}
            onChange={(e) => setEyePower({ ...eyePower, left: e.target.value })}
            placeholder="Left Eye Power"
          />
          <label>Right:</label>
          <input
            type="number"
            value={eyePower.right}
            onChange={(e) => setEyePower({ ...eyePower, right: e.target.value })}
            placeholder="Right Eye Power"
          />
        </div>

        <label>Location ID:</label>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Enter Location ID"
        />
        <button onClick={handleAddItem} className="add-item-button">
          Add Item
        </button>
      </div>

      <h3>Items</h3>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Left Eye Power</th>
            <th>Right Eye Power</th>
            <th>Location ID</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.eyePower.left}</td>
              <td>{item.eyePower.right}</td>
              <td>{item.locationId}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Payments</h3>
      <div className="payment-section">
        <input
          type="text"
          placeholder="Payment Method"
          value={newPayment.method}
          onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={newPayment.amount}
          onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
        />
        <button onClick={handleAddPayment} className="add-payment-button">
          Add Payment
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Payment Method</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {paymentMethods.map((payment, index) => (
            <tr key={index}>
              <td>{payment.method}</td>
              <td>{payment.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Outstanding Amount: {outstandingAmount.toFixed(2)}</h3>

      <div className="invoice-actions">
        <button onClick={handleSubmitInvoice} className="submit-button">
          Submit Invoice
        </button>
        <button onClick={resetForm} className="cancel-button">
          Cancel
        </button>
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
