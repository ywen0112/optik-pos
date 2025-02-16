import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import "../../css/Transaction.css";

const CloseCounter = () => {
  const [closeCounterAmount, setCloseCounterAmount] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [confirmationModal, setConfirmationModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseCounter = () => {
    if (!closeCounterAmount || parseFloat(closeCounterAmount) <= 0) {
      setErrorModal({
        isOpen: true,
        title: "Invalid Amount",
        message: "Please enter a valid amount to close the counter.",
      });
      return;
    }
    setConfirmationModal(true);
  };

  const handleConfirmCloseCounter = () => {
    setConfirmationModal(false);
    setTimeout(() => {
      navigate("/main/transaction");
    }, 500);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="close-counter-container">
      <h2>Close Counter</h2>
      <div className="close-counter-form">
        <input
          type="number"
          placeholder="Enter Amount"
          value={closeCounterAmount}
          onChange={(e) => setCloseCounterAmount(e.target.value)}
        />
        <button className="close-counter-button" onClick={handleCloseCounter}>
          Close Counter
        </button>
      </div>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseErrorModal}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal}
        title="Confirm Close Counter"
        message="Are you sure you want to close the counter?"
        onConfirm={handleConfirmCloseCounter}
        onCancel={() => setConfirmationModal(false)}
      />
    </div>
  );
};

export default CloseCounter;
