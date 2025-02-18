import React from "react";
import "../css/Transaction.css";

const CloseCounterSummaryModal = ({ isOpen, onClose, summary }) => {
  if (!isOpen || !summary) return null;

  return (
    <div className="close-counter-summary-overlay">
      <div className="close-counter-summary-container ">
        <h2>Counter Closing Summary</h2>
        <table className="close-counter-summary-table" >
          <tbody>
            <tr>
              <td><strong>Initial Balance</strong></td>
              <td>{summary.initialBalance?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Sales Amount</strong></td>
              <td>{summary.salesAmt?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Sales Payment Received</strong></td>
              <td>{summary.salesPaymentAmt?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Purchase Amount</strong></td>
              <td>{summary.purchaseAmt?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Cash In</strong></td>
              <td>{summary.cashInAmt?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Cash Out</strong></td>
              <td>{summary.cashOutAmt?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Purchase Payment Made</strong></td>
              <td>{summary.purchasePaymentAmt?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Sales Amount to be Received</strong></td>
              <td>{summary.salesAmtToBeReceived?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Purchase Amount to be Paid</strong></td>
              <td>{summary.purchaseAmtToBePaid?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Sales Amount Changed</strong></td>
              <td>{summary.salesAmtChanged?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Purchase Change Received</strong></td>
              <td>{summary.purchaseAmtChangeReceived?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Expected Closing Balance</strong></td>
              <td>{summary.expectedClosingBalance?.toFixed(2) ?? "0.00"}</td>
            </tr>
            <tr>
              <td><strong>Closing Balance</strong></td>
              <td>{summary.closingBalance?.toFixed(2) ?? "0.00"}</td>
              <td><strong>Balance Difference</strong></td>
              <td>{summary.balanceDifference?.toFixed(2) ?? "0.00"}</td>
            </tr>
          </tbody>
        </table>

        <button className="close-counter-summary-close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CloseCounterSummaryModal;
