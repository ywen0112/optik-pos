import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/Transaction.css";

const paymentMethods = [
  { value: "cash", label: "Cash Payment" },
  { value: "card", label: "Card Payment" },
  { value: "bank", label: "Bank Transfer" }
];

const PaymentModal = ({ isOpen, onClose, total, type, onSubmit }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setPayments(type === "Multi" ? [{ method: "", amount: 0 }] : [{ method: type, amount: total }]);
    }
  }, [isOpen, type, total]);

  const handlePaymentChange = (selectedOption, index) => {
    const updatedPayments = [...payments];
    updatedPayments[index].method = selectedOption.value;
    setPayments(updatedPayments);
  };

  const handleAmountChange = (e, index) => {
    const updatedPayments = [...payments];
    updatedPayments[index].amount = parseFloat(e.target.value) || 0;
    setPayments(updatedPayments);
  };

  const addPaymentMethod = () => {
    setPayments([...payments, { method: "", amount: 0 }]);
  };

  const removePaymentMethod = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = total - totalPaid;

  const handleConfirmPayment = async () => {
    if (totalPaid > total) {
      setError("Overpayment! Adjust payment amounts.");
      return;
    }

    setLoading(true);
    setError("");

    const customerId = localStorage.getItem("customerId") || 0;
    const userId = localStorage.getItem("userId") || "";
    const counterSessionId = localStorage.getItem("counterSessionId") || "";
    const targetDocId = localStorage.getItem("salesId") || "";

    const remark = payments.map(p => `${p.method}: ${p.amount.toFixed(2)}`).join(", ") + 
                   ` | Outstanding: ${outstandingBalance.toFixed(2)}, Total: ${total.toFixed(2)}`;

    try {
      const response = await fetch("https://optikposbackend.absplt.com/Sales/SaveSalesPayment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          counterSessionId: counterSessionId,
          targetDocId: targetDocId,
          docDate: new Date().toISOString(),
          remark: remark,
          reference: "", 
          amount: totalPaid
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || "Failed to save payment.");
      }

      onSubmit(payments); 
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{type === "Multi" ? "Multipayment" : `${type} Payment`}</h2>
        <p><strong>Total Amount:</strong> {total.toFixed(2)}</p>
        <p><strong>Outstanding Balance:</strong> {outstandingBalance.toFixed(2)}</p>

        {error && <p className="error-message">{error}</p>}

        <div className="payment-container">
          {payments.map((payment, index) => (
            <div key={index} className="payment-row">
              {type === "Multi" && (
                <Select
                  options={paymentMethods}
                  value={paymentMethods.find(pm => pm.value === payment.method) || ""}
                  onChange={(selectedOption) => handlePaymentChange(selectedOption, index)}
                  placeholder="Select Payment Method"
                  className="payment-method-select"
                />
              )}
              <input
                type="number"
                value={payment.amount}
                onChange={(e) => handleAmountChange(e, index)}
                placeholder="Enter Amount"
                min="0"
                className="payment-amount-input"
              />

              {type === "Multi" && (
                <button className="modal-add-payment-button" onClick={addPaymentMethod}>Add Payment Method</button>
              )}

              {type === "Multi" && payments.length > 1 && (
                <button className="remove-btn" onClick={() => removePaymentMethod(index)}>X</button>
              )}
            </div>
          ))}
        </div>

        <div className="transaction-modal-buttons">
          <button className="modal-add-button" onClick={handleConfirmPayment} disabled={loading}>
            {loading ? "Processing..." : "Confirm Payment"}
          </button>
          <button className="modal-close-button" onClick={onClose} disabled={loading}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
