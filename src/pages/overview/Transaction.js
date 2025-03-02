import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Transaction.css";
import ErrorModal from "../../modals/ErrorModal";
import CashSaleModal from "../../modals/CashSaleModal";
import SalesInvoice from "../../modals/SalesInvoiceModal";
import PurchaseInvoiceModal from "../../modals/PurchaseInvoiceModal";
import CreditNoteModal from "../../modals/CreditNoteModal";
import CloseCounterModal from "../../modals/CloseCounterModal";
import CloseCounterSummaryModal from "../../modals/CloseCounterSummaryModal";
import SuccessModal from "../../modals/SuccessModal";

const Transaction = () => {
  const [isCounterOpen, setIsCounterOpen] = useState(false);
  const [openCounterAmount, setOpenCounterAmount] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [counterSessionId, setCounterSessionId] = useState(null);
  const [counterSummary, setCounterSummary] = useState(null);
  const [modalType, setModalType] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalesInvoiceOpen, setIsSalesInvoiceOpen] = useState(false); 
  const [isPurchaseInvoiceOpen, setIsPurchanseInvoiceOpen] = useState(false);
  const [isCreditNoteOpen, setIsCreditNoteOpen] = useState(false);
  const [isCloseCounterOpen, setIsCloseCounterOpen] = useState(false);
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");
  const accessRights = JSON.parse(localStorage.getItem("accessRights")) || [];
  const salesInvoiceRights = accessRights.find((item) => item.module === "Transaction Sales Invoice") || {};
  const purchaseInvoiceRights = accessRights.find((item) => item.module === "Transaction Purchase Invoice") || {};
  const creditNoteRights = accessRights.find((item) => item.module === "Transaction Credit Note") || {};
  const [counterOpenedModal, setCounterOpenedModal] = useState({ isOpen: false, openingBal: 0, isExist: false  });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    const storedCounterSessionId = localStorage.getItem("counterSessionId");
    const storedOpeningBal = localStorage.getItem("openingBal");
    const storedIsCounterOpen = localStorage.getItem("isCounterOpen") === "true";

    if (storedCounterSessionId && storedOpeningBal && storedIsCounterOpen) {
      setCounterSessionId(storedCounterSessionId);
      setOpenCounterAmount(parseFloat(storedOpeningBal));
      setIsCounterOpen(true);
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
          customerId: Number(customerId),
          userId: userId,
          openingBalance: parseFloat(openCounterAmount),
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCounterSessionId(data.data.counterSessionId);
        setIsCounterOpen(true);
        const openingBal = data.data.openingBal !== null ? data.data.openingBal : parseFloat(openCounterAmount);
        setOpenCounterAmount(openingBal);
        setCounterOpenedModal({ isOpen: true, openingBal, isExist: data.data.isExist });
        localStorage.setItem("counterSessionId", data.data.counterSessionId);
        localStorage.setItem("openingBal", openingBal);
        localStorage.setItem("isCounterOpen", "true");
      } else {
        throw new Error(data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleResetAndCloseState = (data) => {
    setIsCounterOpen(false);
    setCounterSessionId(null);
    setOpenCounterAmount("");
    localStorage.removeItem("counterSessionId");
    localStorage.removeItem("openingBal");
    localStorage.removeItem("isCounterOpen");

    setIsSalesInvoiceOpen(false);
    setIsPurchanseInvoiceOpen(false);
    setIsCreditNoteOpen(false);
    setErrorModal({ isOpen: true, title: "Error Processing Transaction", message: data.errorMessage });
  }

  const handleCloseCounter = async ({ amount }) => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/CloseCounterSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          closingBalance: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errorMessage === "There is currently no active counter session.") {
          handleResetAndCloseState(data);
          throw new Error(data.errorMessage || "Failed to process transaction.");
        }
      }

      setCounterSummary(data.data); 
      handleResetAndCloseState();
      setIsCloseCounterOpen(false);
      navigate("/main/transaction");
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Closing Counter", message: error.message });
    }
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleAddCashTransaction = async ({ type, amount, description }) => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/NewCashTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          isCashOut: type === "cashout",
          remarks: description,
          effectedAmount: parseFloat(amount),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errorMessage === "There is currently no active counter session.") {
          handleResetAndCloseState(data);
          throw new Error(data.errorMessage || "Failed to process transaction.");
        }
      }

      setSuccessModal({
        isOpen: true,
        title: "Cash Transaction Saved",
        message: "The cash transaction has been successfully saved.",
      });
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Processing Transaction", message: error.message });
    }
  };

  const handleOpenSalesInvoice = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Sales/New", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          id: "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { salesId, docNo } = data.data;
        localStorage.setItem("salesId", salesId);
        localStorage.setItem("docNo", docNo);
        setIsSalesInvoiceOpen(true);
      } else {
        throw new Error(data.errorMessage || "Failed to create sales invoice.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Sales Invoice Error", message: error.message });
    }
  };

  const handleOpenPurchaseInvoice = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Purchases/New", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          id: "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { purchaseId, docNo } = data.data;

        localStorage.setItem("purchaseId", purchaseId);
        localStorage.setItem("docNo", docNo);

        setIsPurchanseInvoiceOpen(true);
      } else {
        throw new Error(data.errorMessage || "Failed to create purchase invoice.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Purchase Invoice Error", message: error.message });
    }
  };
;

  const handleOpenCreditNote = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/New", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          userId: userId,
          id: "",
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const { creditNoteId, docNo } = data.data;

        localStorage.setItem("creditNoteId", creditNoteId);
        localStorage.setItem("docNo", docNo);

        setIsCreditNoteOpen(true);
      } else {
        throw new Error(data.errorMessage || "Failed to create credit note.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Credit Note Error", message: error.message });
    }
  };

  const handleExportReport = async() =>{
    try{
      const response = await fetch(`https://optikposbackend.absplt.com/CashCounter/GetCounterSummaryReport?CounterSessionId=${counterSessionId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        const byteCharacters = atob(data.data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
  
        const link = document.createElement("a");
        link.href = url;
        link.download = `CounterSession.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(data.errorMessage || "Failed to export the report.");
      }
    }catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Export Report Error",
        message: error.message,
      });
    }
  };

  return (
    <div className="open-counter-container">
      <h3>Transaction</h3>
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
          {salesInvoiceRights.allow && (
          <button className="transaction-button" onClick={handleOpenSalesInvoice}>
            Sales Invoice
          </button>
          )}
          {purchaseInvoiceRights.allow && (
          <button className="transaction-button" onClick={handleOpenPurchaseInvoice}>
            Purchase Invoice
          </button> 
          )}
          {creditNoteRights.allow && (  
          <button className="transaction-button" onClick={handleOpenCreditNote}>
            Credit Note
          </button>  
          )}
          <button className="transaction-button close-counter-button" onClick={() => setIsCloseCounterOpen(true)}>Close Counter</button>
        </div>
      )}

      {counterOpenedModal.isOpen && (
        <SuccessModal
          isOpen={counterOpenedModal.isOpen}
          title="Counter Status"
          message={
            counterOpenedModal.isExist
              ? `Counter is opened. Opening Balance: ${counterOpenedModal.openingBal}`
              : `Counter open successfully. Opening Balance is ${counterOpenedModal.openingBal}`
          }
          onClose={() => setCounterOpenedModal({ isOpen: false, openingBal: 0 })}
        />
      )}

      <CashSaleModal isOpen={isModalOpen} type={modalType} onClose={()=> setIsModalOpen(false)} onAdd={handleAddCashTransaction}/>
      <SalesInvoice isOpen={isSalesInvoiceOpen} onClose={() => setIsSalesInvoiceOpen(false)} onReset={handleResetAndCloseState}/>
      <PurchaseInvoiceModal isOpen={isPurchaseInvoiceOpen} onClose={() => setIsPurchanseInvoiceOpen(false)} onReset={handleResetAndCloseState}/>
      <CreditNoteModal isOpen={isCreditNoteOpen} onClose={() => setIsCreditNoteOpen(false)} onReset={handleResetAndCloseState}/>
      <CloseCounterModal isOpen={isCloseCounterOpen} onClose={() => setIsCloseCounterOpen(false)} onCloseCounter={handleCloseCounter}/>
      <CloseCounterSummaryModal isOpen={!!counterSummary} summary={counterSummary} onClose={() => {setCounterSummary(null)}} onExportReport={handleExportReport}/>
      <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={()=> setErrorModal({ isOpen: false, title: "", message: "" })}/>
      <SuccessModal  isOpen={successModal.isOpen} title={successModal.title} message={successModal.message} onClose={() => setSuccessModal({ isOpen: false, title: "", message: "" })}/>
    </div>
  );
};

export default Transaction;
