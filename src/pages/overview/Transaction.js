import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Transaction.css";
import ErrorModal from "../../modals/ErrorModal";
import CashSaleModal from "../../modals/CashSaleModal";
import SalesInvoice from "../../modals/SalesInvoiceModal";
import PurchaseInvoiceModal from "../../modals/PurchaseInvoiceModal";
import CreditNoteModal from "../../modals/CreditNoteModal";
import CloseCounterModal from "../../modals/CloseCounterModal";

const Transaction = () => {
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [openCounterAmount, setOpenCounterAmount] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [counterSessionId, setCounterSessionId] = useState(null);

  const [modalType, setModalType] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalesInvoiceOpen, setIsSalesInvoiceOpen] = useState(false); 
  const [isPurchaseInvoiceOpen, setIsPurchanseInvoiceOpen] = useState(false);
  const [isCreditNoteOpen, setIsCreditNoteOpen] = useState(false);
  const [isCloseCounterOpen, setIsCloseCounterOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedSessionId = localStorage.getItem("counterSessionId");
    const storedOpeningBalance = localStorage.getItem("openingBalance");

    if (storedSessionId) {
      setIsCounterOpen(true);
      setCounterSessionId(storedSessionId);
      setOpenCounterAmount(storedOpeningBalance || ""); // ✅ Show stored opening balance
    }
  }, []);

  const handleOpenCounter = async () => {
    if (!openCounterAmount || parseFloat(openCounterAmount) < 0) {
      setErrorModal({
        isOpen: true,
        title: "Invalid Amount",
        message: "Please enter a valid amount to open the counter.",
      });
      return;
    }

    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/OpenCounterSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          userId: localStorage.getItem("userId"),
          openingBalance: parseFloat(openCounterAmount),
        }),
      });

      const data = await response.json();
      console.log("Open Counter Response:", data);

      if (response.ok && data.success) {
        localStorage.setItem("counterSessionId", data.data.counterSessionId);
        localStorage.setItem("openingBalance", openCounterAmount);
        setCounterSessionId(data.data.counterSessionId);
        setIsCounterOpen(true);
      } else {
        throw new Error(data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleCloseCounter = async ({ amount }) => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/CloseCounterSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          userId: localStorage.getItem("userId"),
          counterSessionId: counterSessionId,
          closingBalance: parseFloat(amount),
        }),
      });

      const data = await response.json();
      console.log("Close Counter Response:", data);

      if (response.ok && data.success) {
        // ✅ Clear stored session and reset state
        localStorage.removeItem("counterSessionId");
        localStorage.removeItem("openingBalance");
        setCounterSessionId(null);
        setIsCounterOpen(false);
        setOpenCounterAmount("");
        setIsCloseCounterOpen(false);
        navigate("/main/transaction"); // ✅ Redirect to transaction page
      } else {
        throw new Error(data.errorMessage || "Failed to close counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Closing Counter", message: error.message });
    }
  };


  const handleAddCashTransaction = async ({ type, amount, description }) => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/NewCashTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          userId: localStorage.getItem("userId"),
          counterSessionId: counterSessionId,
          isCashOut: type === "cashout",
          remarks: description,
          effectedAmount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      console.log("Cash Transaction Response:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.errorMessage || "Failed to process transaction.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Processing Transaction", message: error.message });
    }
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenSalesInvoice = () => {
    setIsSalesInvoiceOpen(true);
  };

  const handleCloseSalesInvoice = () => {
    setIsSalesInvoiceOpen(false);
  };

  const handleOpenPurchaseInvoice = () => {
    setIsPurchanseInvoiceOpen(true);
  };

  const handleClosePurchaseInvoice = () => {
    setIsPurchanseInvoiceOpen(false);
  };

  const handleOpenCreditNote = () => {
    setIsCreditNoteOpen(true);
  };

  const handleCloseCreditNote = () => {
    setIsCreditNoteOpen(false);
  };

  const handleOpenCloseCounter = () => {
    setIsCloseCounterOpen(true);
  };

  const handleCloseCloseCounter = () => {
    setIsCloseCounterOpen(false);
  };


  return (
    <div className="open-counter-container">
      <h2>Transaction</h2>
      <div className="open-counter-form">
        <input
          className="open-counter-input"
          type="number"
          placeholder="Enter Amount"
          value={openCounterAmount}
          onChange={(e) => setOpenCounterAmount(e.target.value)}
          disabled={isCounterOpen}
        />
        {!isCounterOpen && (
          <button className="open-counter-button" onClick={handleOpenCounter}>
            Open Counter
          </button>
        )}
      </div>

      {isCounterOpen && (
        <div className="transaction-options">
          <button className="transaction-button" onClick={() => handleOpenModal("cashin")}>
            Cash In
          </button>
          <button className="transaction-button" onClick={() => handleOpenModal("cashout")}>
            Cash Out
          </button>
          <button className="transaction-button" onClick={handleOpenSalesInvoice}>
            Sales Invoice
          </button>
          <button className="transaction-button" onClick={handleOpenPurchaseInvoice}>
            Purchase Invoice
          </button>   
          <button className="transaction-button" onClick={handleOpenCreditNote}>
            Credit Note
          </button>  
          <button className="transaction-button close-counter-button" onClick={handleOpenCloseCounter}>Close Counter</button>
        </div>
      )}

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseErrorModal}
      />

      <CashSaleModal
        isOpen={isModalOpen}
        type={modalType}
        onClose={handleCloseModal}
        onAdd={handleAddCashTransaction}
      />

    <SalesInvoice isOpen={isSalesInvoiceOpen} onClose={handleCloseSalesInvoice} />
    <PurchaseInvoiceModal isOpen={isPurchaseInvoiceOpen} onClose={handleClosePurchaseInvoice} />
    <CreditNoteModal isOpen={isCreditNoteOpen} onClose={handleCloseCreditNote} />
    <CloseCounterModal isOpen={isCloseCounterOpen} onClose={handleCloseCloseCounter} onCloseCounter={handleCloseCounter}/>

</div>
  );
};

export default Transaction;
