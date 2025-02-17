import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";

const paymentMethods = [
  { value: "cash", label: "Cash Payment" },
  { value: "card", label: "Card Payment" },
  { value: "bank", label: "Bank Transfer" }
];

const PaymentModal = ({ isOpen, onClose, total, type, onSubmit }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    if (isOpen) {
      setPayments(
        type === "Multi"
          ? [{ method: "", amount: 0, cardNo: "", approvalCode: "" }]
          : [{ method: type, amount: total.toFixed(2), cardNo: "", approvalCode: "" }]
      );
    }
  }, [isOpen, type, total]);

  const handlePaymentChange = (selectedOption, index) => {
    const updatedPayments = [...payments];
    updatedPayments[index].method = selectedOption.value;
    updatedPayments[index].cardNo = ""; // Reset if method changes
    updatedPayments[index].approvalCode = "";
    setPayments(updatedPayments);
  };

  const handleAmountChange = (e, index) => {
    const updatedPayments = [...payments];
    updatedPayments[index].amount = parseFloat(e.target.value) || "";
    setPayments(updatedPayments);
  };

  const handleCardDetailsChange = (e, index, field) => {
    const updatedPayments = [...payments];
    updatedPayments[index][field] = e.target.value;
    setPayments(updatedPayments);
  };

  const addPaymentMethod = () => {
    setPayments([...payments, { method: "", amount: 0, cardNo: "", approvalCode: "" }]);
  };

  const removePaymentMethod = (index) => {
    setPayments(payments.filter((_, i) => i !== index));
  };

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = total > totalPaid ? total - totalPaid : 0;
  const changes = totalPaid > total ? totalPaid - total : 0;

  const handleConfirmPayment = async () => {
    setLoading(true);

    const customerId = localStorage.getItem("customerId");
    const userId = localStorage.getItem("userId");
    const counterSessionId = localStorage.getItem("counterSessionId");
    const targetDocId = localStorage.getItem("salesId");

    const formattedAmount = parseFloat(totalPaid).toFixed(2);

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
          remark: "",
          reference: "",
          amount: formattedAmount,
          payments: payments.map(p => ({
            method: p.method,
            amount: p.amount,
            cardNo: p.method === "card" ? p.cardNo : null,
            approvalCode: p.method === "card" ? p.approvalCode : null,
          })),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || "Failed to save payment.");
      }

      onSubmit(payments, outstandingBalance, changes);
      onClose();
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Save Payment", message: error.message });
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
        {outstandingBalance > 0 ? (
          <p><strong>Outstanding Balance:</strong> {outstandingBalance.toFixed(2)}</p>
        ) : (
          <p><strong>Changes:</strong> {changes.toFixed(2)}</p>
        )}
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
              {payment.method === "Card" && (
                <div className="card-payment-details">
                  <input
                    type="text"
                    value={payment.cardNo}
                    onChange={(e) => handleCardDetailsChange(e, index, "cardNo")}
                    placeholder="Card Number"
                    className="card-input"
                  />
                  <input
                    type="text"
                    value={payment.approvalCode}
                    onChange={(e) => handleCardDetailsChange(e, index, "approvalCode")}
                    placeholder="Approval Code"
                    className="card-input"
                  />
                </div>
              )}
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
        <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ isOpen: false })} />
      </div>
    </div>
  );
};

export default PaymentModal;
