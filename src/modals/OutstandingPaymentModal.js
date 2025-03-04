import React, { useState } from "react";
import "../css/OutstandingPaymentModal.css";

const OutstandingPaymentModal = ({ isOpen, onClose, onConfirm, outstandingAmount, type }) => {
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [amount, setAmount] = useState(outstandingAmount);
    const [multiPayment, setMultiPayment] = useState([{ method: "cash", amount: "", referenceNo: "", cardNo: "", approvalCode: "" }]);
    const [reference, setReference] = useState(null);

    const handlePaymentMethodChange = (e) => {
      setPaymentMethod(e.target.value);
      if (e.target.value !== "multi") {
        setAmount(outstandingAmount);
        setMultiPayment([{ method: e.target.value, amount: outstandingAmount, referenceNo: "", cardNo: "", approvalCode: "" }]);
      }
    };
  
    const handleMultiPaymentChange = (index, field, value) => {
      const updatedPayments = [...multiPayment];
      updatedPayments[index][field] = value;
      setMultiPayment(updatedPayments);
    };
  
    const addMultiPaymentRow = () => {
      setMultiPayment([...multiPayment, { method: "cash", amount: "", referenceNo: "", cardNo: "", approvalCode: "" }]);
    };
  
    const removeMultiPaymentRow = (index) => {
      setMultiPayment(multiPayment.filter((_, i) => i !== index));
    };
  
    const handleSubmit = () => {
        if (paymentMethod === "multi") {
            const totalPaid = multiPayment.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
            onConfirm(multiPayment, totalPaid, type, reference);
        } else {
            const singlePayment = [{
                method: paymentMethod,
                amount: parseFloat(amount || 0),
                referenceNo: paymentMethod === "bank" ? multiPayment[0].referenceNo : "",
                cardNo: paymentMethod === "card" ? multiPayment[0].cardNo : "",
                approvalCode: paymentMethod === "card" ? multiPayment[0].approvalCode : "",
            }];
            onConfirm(singlePayment, parseFloat(amount || 0), type, reference);
        }
        onClose();
    };
  
    if (!isOpen) return null;
  

  return (
    <div className="modal-overlay">
    <div className="modal-content">
        <h2>Outstanding Payment: {outstandingAmount}</h2>
        <label>Payment Method:</label>
        <select className="payment-selections" value={paymentMethod} onChange={handlePaymentMethodChange}>
            <option value="cash">Cash Payment</option>
            <option value="card">Card Payment</option>
            <option value="bank">Bank Transfer</option>
            <option value="multi">Multi-Payment</option>
        </select>

        {type === "purchase" && (
            <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Enter Receipt Reference"
            />
        )}

        {paymentMethod === "multi" ? (
            <>
                {multiPayment.map((payment, index) => (
                    <div key={index} className="multi-payment-row">
                        <select
                            className="payment-selections"
                            value={payment.method}
                            onChange={(e) => handleMultiPaymentChange(index, "method", e.target.value)}
                        >
                            <option value="cash">Cash</option>
                            <option value="card">Card</option>
                            <option value="bank">Bank Transfer</option>
                        </select>
                        <input
                            type="number"
                            value={payment.amount}
                            onChange={(e) => handleMultiPaymentChange(index, "amount", e.target.value)}
                            placeholder="Enter Amount"
                        />
                        
                        {payment.method === "bank" && (
                            <input
                                type="text"
                                value={payment.referenceNo}
                                onChange={(e) => handleMultiPaymentChange(index, "referenceNo", e.target.value)}
                                placeholder="Enter Reference No."
                            />
                        )}

                        {payment.method === "card" && (
                            <>
                                <input
                                    type="text"
                                    value={payment.cardNo}
                                    onChange={(e) => handleMultiPaymentChange(index, "cardNo", e.target.value)}
                                    placeholder="Enter Card No."
                                />
                                <input
                                    type="text"
                                    value={payment.approvalCode}
                                    onChange={(e) => handleMultiPaymentChange(index, "approvalCode", e.target.value)}
                                    placeholder="Enter Approval Code"
                                />
                            </>
                        )}

                        {multiPayment.length > 1 && (
                            <button className="remove-btn" onClick={() => removeMultiPaymentRow(index)}>✖</button>
                        )}
                    </div>
                ))}
                <button className="add-btn" onClick={addMultiPaymentRow}>+ Add Payment</button>
            </>
        ) : (
            <>
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter Amount"
                />

                {paymentMethod === "bank" && (
                    <input
                        type="text"
                        value={multiPayment[0].referenceNo}
                        onChange={(e) => handleMultiPaymentChange(0, "referenceNo", e.target.value)}
                        placeholder="Enter Reference No."
                    />
                )}

                {paymentMethod === "card" && (
                    <>
                        <input
                            type="text"
                            value={multiPayment[0].cardNo}
                            onChange={(e) => handleMultiPaymentChange(0, "cardNo", e.target.value)}
                            placeholder="Enter Card No."
                        />
                        <input
                            type="text"
                            value={multiPayment[0].approvalCode}
                            onChange={(e) => handleMultiPaymentChange(0, "approvalCode", e.target.value)}
                            placeholder="Enter Approval Code"
                        />
                    </>
                )}
            </>
        )}

        <div className="payment-actions">
            <button className="payment-confirm-btn" onClick={handleSubmit}>Confirm</button>
            <button className="payment-cancel-btn" onClick={onClose}>Cancel</button>
        </div>
    </div>
</div>
);
};

export default OutstandingPaymentModal;
