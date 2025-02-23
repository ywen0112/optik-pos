import React, { useState, useEffect } from "react";
import "../../css/InquiryScreen.css";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import OutstandingPaymentModal from "../../modals/OutstandingPaymentModal";

const InquiryScreen = () => {
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(true);
  const [activeTab, setActiveTab] = useState("counterSession");
  const [counterSessions, setSessionCounters] = useState([]);
  const [expandedCounterRow, setExpandedCounterRow] = useState(null);
  // const [openDate, setOpenDate] = useState("");
  // const [closeDate, setCloseDate] = useState("");
  const [docNo, setDocNo] = useState("");
  const [isVoid, setIsVoid] = useState(false);
  const [isCashOut, setIsCashOut] = useState(false);
  const [isVoidAndCashOut, setIsVoidAndCashOut] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [usersCache, setUsersCache] = useState({});
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isSalesVoid, setIsSalesVoid] = useState(false);
  const [showAllSales, setShowAllSales] = useState(true);
  const [isSalesVoidAndCompleted, setIsSalesVoidAndCompleted] = useState(false);
  const [debtorCode, setDebtorCode] = useState("");
  const [purchaseTransactions, setPurchaseTransactions] = useState([]);
  const [expandedPurchaseRow, setExpandedPurchaseRow] = useState(null);
  const [isPurchaseVoid, setIsPurchaseVoid] = useState(false);
  const [isPurchaseVoidAndCompleted, setIsPurchaseVoidAndCompleted] = useState(false);
  const [showAllPurchases, setShowAllPurchases] = useState(true);
  const [creditorCode, setCreditorCode] = useState("");
  const [creditNote, setCreditNote] = useState([]);
  const [expandedCreditNoteRow, setExpandedCreditNoteRow] = useState(null);
  const [showAllCreditNote, setShowAllCreditNote] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, transactionId: null, message: "" });
  const [confirmSalesModal, setConfirmSalesModal] = useState({ isOpen: false, salesId: null, message: "" });
  const [confirmPurchasesModal, setConfirmPurchasesModal] = useState({ isOpen: false, purchaseId: null, message: "" });
  const [confirmCreditNoteModal, setConfirmCreditNoteModal] = useState({ isOpen: false, creditNoteId: null, message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const customerId = Number(localStorage.getItem("customerId"));
  const [payModal, setPayModal] = useState({ isOpen: false, salesId: null, outstandingAmount: 0, type: null });
  const [pagination, setPagination] = useState({
    counterSession: { currentPage: 1, itemsPerPage: 5 },
    cashTransaction: { currentPage: 1, itemsPerPage: 5 },
    salesInvoice: { currentPage: 1, itemsPerPage: 5 },
    purchaseInvoice: { currentPage: 1, itemsPerPage: 5 },
    creditNote: { currentPage: 1, itemsPerPage: 5 },
  });

  useEffect(() => {
    if (activeTab === "counterSession") {
      fetchCounterSessions();
    } 
    else if (activeTab === "cashTransaction") {
      fetchTransactions();
    }
    else if (activeTab === "salesInvoice") {
      fetchSalesTransactions();
    }
    else if (activeTab === "purchaseInvoice") {
      fetchPurchaseTransactions();
    }
    else if (activeTab === "creditNote") {
      fetchCreditNotes();
    }
  }, [activeTab, pagination[activeTab].currentPage, pagination[activeTab].itemsPerPage]);

  const fetchCounterSessions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/GetCounterSessionRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: (pagination.counterSession.currentPage - 1) * pagination.counterSession.itemsPerPage,
          limit: pagination.counterSession.itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSessionCounters([...data.data]);
        fetchUserNames(data.data);
        setTotalRecords(Math.ceil(data.data.length === pagination.counterSession.itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch transactions.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/GetCashTransactionsRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: (pagination.cashTransaction.currentPage - 1) * pagination.cashTransaction.itemsPerPage,
          limit: pagination.cashTransaction.itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTransactions([...data.data]);
        fetchUserNames(data.data);
        setTotalRecords(Math.ceil(data.data.length === pagination.cashTransaction.itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch transactions.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmVoidTransaction = (transactionId) => {
    setConfirmModal({
      isOpen: true,
      transactionId,
      message: "Are you sure you want to void this transaction? This action cannot be undone.",
    });
  };

  const handleVoidTransaction = async () => {
    if (!confirmModal.transactionId) return;
    setConfirmModal({ isOpen: false, transactionId: null, message: "" });
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/VoidCashTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          id: confirmModal.transactionId,
          userId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchTransactions();
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleFilterChange = (filterType) => {
    setIsVoid(filterType === "isVoid");
    setIsCashOut(filterType === "isCashOut");
    setIsVoidAndCashOut(filterType === "isVoidAndCashOut");
    setShowAll(filterType === "showAll");
  };

  const filteredTransactions = transactions.filter((txn) => {
    const lowerDocNo = docNo.toLowerCase();

    const matchesDocNo = !docNo || (txn.docNo && txn.docNo.toLowerCase().includes(lowerDocNo));

    if (isVoidAndCashOut) {
      return txn.isVoid === true && txn.isCashOut === true && matchesDocNo;
    }
    if (isVoid) {
      return txn.isVoid === true && matchesDocNo;
    }
    if (isCashOut) {
      return txn.isCashOut === true && matchesDocNo;
    }
    if (showAll) {
      return matchesDocNo;
    }
    return matchesDocNo;
  });

  const fetchSalesTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Sales/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: (pagination.salesInvoice.currentPage - 1) * pagination.salesInvoice.itemsPerPage,
          limit: pagination.salesInvoice.itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSalesTransactions([...data.data]);
        setTotalRecords(Math.ceil(data.data.length === pagination.salesInvoice.itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch sales transactions.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmVoidSalesTransaction = (salesId) => {
    setConfirmSalesModal({
      isOpen: true,
      salesId,
      message: "Are you sure you want to void this transaction? This action cannot be undone.",
    });
  };

  const handleVoidSalesTransaction = async () => {
    if (!confirmSalesModal.salesId) return;
    setConfirmSalesModal({ isOpen: false, salesId: null, message: "" });
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://optikposbackend.absplt.com/Sales/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          id: confirmSalesModal.salesId,
          userId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchSalesTransactions();
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleSalesFilterChange = (filterType) => {
    setIsComplete(filterType === "isComplete");
    setIsSalesVoid(filterType === "isSalesVoid");
    setIsSalesVoidAndCompleted(filterType === "isSalesVoidAndCompleted");
    setShowAllSales(filterType === "showAllSales");
  };

  const filteredSalesTransactions = salesTransactions.filter((txn) => {
    const lowerDocNo = docNo.toLowerCase();
    const lowerDebtorCode = debtorCode.toLowerCase();

    const matchesDocNo = !docNo || (txn.docNo && txn.docNo.toLowerCase().includes(lowerDocNo));
    const matchesDebtorCode = !debtorCode || (txn.debtorCode && txn.debtorCode.toLowerCase().includes(lowerDebtorCode));

    if (isSalesVoid) {
      return txn.isVoid === true && matchesDocNo && matchesDebtorCode;
    }
    if (isComplete) {
      return txn.isComplete === true && matchesDocNo && matchesDebtorCode;
    }
    if (isSalesVoidAndCompleted) {
      return txn.isVoid === true && txn.isComplete === true && matchesDocNo && matchesDebtorCode;
    }
    if (showAllSales) {
      return matchesDocNo && matchesDebtorCode;
    }
    return matchesDocNo && matchesDebtorCode;
  });

  const fetchPurchaseTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Purchases/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: (pagination.purchaseInvoice.currentPage - 1) * pagination.purchaseInvoice.itemsPerPage,
          limit: pagination.purchaseInvoice.itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPurchaseTransactions([...data.data]);
        setTotalRecords(Math.ceil(data.data.length === pagination.purchaseInvoice.itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch purchase transactions.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmVoidPurchasesTransaction = (purchaseId) => {
    setConfirmPurchasesModal({
      isOpen: true,
      purchaseId,
      message: "Are you sure you want to void this transaction? This action cannot be undone.",
    });
  };

  const handleVoidPurchasesTransaction = async () => {
    if (!confirmPurchasesModal.purchaseId) return;
    setConfirmPurchasesModal({ isOpen: false, purchaseId: null, message: "" });
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://optikposbackend.absplt.com/Purchases/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          id: confirmPurchasesModal.purchaseId,
          userId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchPurchaseTransactions();
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handlePurchasesFilterChange = (filterType) => {
    setIsComplete(filterType === "isComplete");
    setIsPurchaseVoid(filterType === "isPurchaseVoid");
    setIsPurchaseVoidAndCompleted(filterType === "isPurchaseVoidAndCompleted");
    setShowAllPurchases(filterType === "showAllPurchases");
  };

  const filteredPurchasesTransactions = purchaseTransactions.filter((txn) => {
    const lowerDocNo = docNo.toLowerCase();
    const lowerCreditorCode = creditorCode.toLowerCase();

    const matchesDocNo = !docNo || (txn.docNo && txn.docNo.toLowerCase().includes(lowerDocNo));
    const matchesCreditorCode = !creditorCode || (txn.creditorCode && txn.creditorCode.toLowerCase().includes(lowerCreditorCode));

    if (isPurchaseVoid) {
      return txn.isVoid === true && matchesDocNo && matchesCreditorCode;
    }
    if (isComplete) {
      return txn.isComplete === true && matchesDocNo && matchesCreditorCode;
    }
    if (isPurchaseVoidAndCompleted) {
      return txn.isVoid === true && txn.isComplete === true && matchesDocNo && matchesCreditorCode;
    }
    if (showAllPurchases) {
      return matchesDocNo && matchesCreditorCode;
    }
    return matchesDocNo && matchesCreditorCode;
  });

  const fetchCreditNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: (pagination.creditNote.currentPage - 1) * pagination.creditNote.itemsPerPage,
          limit: pagination.creditNote.itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCreditNote([...data.data]);
        setTotalRecords(Math.ceil(data.data.length === pagination.creditNote.itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch credit note.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Fetch Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const confirmVoidCreditNote = (creditNoteId) => {
    setConfirmCreditNoteModal({
      isOpen: true,
      creditNoteId,
      message: "Are you sure you want to void this transaction? This action cannot be undone.",
    });
  };

  const handleVoidCreditNote = async () => {
    if (!confirmCreditNoteModal.creditNoteId) return;
    setConfirmCreditNoteModal({ isOpen: false, creditNoteId: null, message: "" });
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          id: confirmCreditNoteModal.creditNoteId,
          userId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        fetchCreditNotes();
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleCreditNoteFilterChange = (filterType) => {
    setIsVoid(filterType === "isVoid");
    setShowAllCreditNote(filterType === "showAllCreditNote");
  };

  const filteredCreditNote = creditNote.filter((txn) => {
    const lowerDocNo = docNo.toLowerCase();
    const lowerDebtorCode = debtorCode.toLowerCase();

    const matchesDocNo = !docNo || (txn.docNo && txn.docNo.toLowerCase().includes(lowerDocNo));
    const matchesDebtorCode = !debtorCode || (txn.debtorCode && txn.debtorCode.toLowerCase().includes(lowerDebtorCode));

    if (isVoid) {
      return txn.isVoid === true && matchesDocNo && matchesDebtorCode;
    }
    if (showAllCreditNote) {
      return matchesDocNo && matchesDebtorCode;
    }
    return matchesDocNo && matchesDebtorCode;
  });

  const fetchUserNames = async (transactions) => {
    let userIds = new Set();
    transactions.forEach((txn) => {
      if (txn.createdBy) userIds.add(txn.createdBy);
      if (txn.lastModifiedBy) userIds.add(txn.lastModifiedBy);
    });

    const userNames = { ...usersCache };

    for (let userId of userIds) {
      if (!userNames[userId]) {
        try {
          const response = await fetch("https://optikposbackend.absplt.com/Users/GetSpecificUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: customerId,
              userId,
              id: userId,
            }),
          });

          const data = await response.json();
          if (response.ok && data.success) {
            userNames[userId] = data.data.userName;
          } else {
            userNames[userId] = "Unknown User";
          }
        } catch (error) {
          console.error(`Error fetching username for ${userId}:`, error);
          userNames[userId] = "Unknown User";
        }
      }
    }
    setUsersCache(userNames);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const handleItemsPerPageChange = (event) => {
    const newItemsPerPage = Number(event.target.value);
    setPagination((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], itemsPerPage: newItemsPerPage, currentPage: 1 },
    }));
  };

  const handlePageChange = (page) => {
    if (page >= 1) {
      setPagination((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], currentPage: page },
      }));
    }
  };
  
  const handlePaymentConfirm = async (payments, totalPaid, type, reference) => {
    try {
        const userId = localStorage.getItem("userId");
        const counterSessionId = localStorage.getItem("counterSessionId");
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000; 
        const localISOTime = new Date(now - offset).toISOString().slice(0, 19);

        const apiEndpoint = type === "sales"
            ? "https://optikposbackend.absplt.com/Sales/SaveSalesPayment"
            : "https://optikposbackend.absplt.com/Purchases/SavePurchasePayment";

        const remark = payments
            .map(payment => {
                let details = `Method: ${payment.method.toUpperCase()}`;
                if (payment.method === "card") {
                    details += `, Card No: ${payment.cardNo || "N/A"}, Approval Code: ${payment.approvalCode || "N/A"}`;
                }
                if (payment.method === "bank") {
                    details += `, Reference No: ${payment.referenceNo || "N/A"}`;
                }
                return details;
            })
            .join(" | ");

        const response = await fetch(apiEndpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                customerId: customerId,
                userId: userId,
                counterSessionId: counterSessionId,
                targetDocId: payModal.transactionId, 
                docDate: localISOTime,
                remark: remark,
                reference: reference, 
                amount: parseFloat(totalPaid.toFixed(2)), 
            }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error(data.errorMessage || "Payment failed.");
        }
        setPayModal({ isOpen: false, transactionId: null, outstandingAmount: 0 });

        type === "sales" ? fetchSalesTransactions() : fetchPurchaseTransactions();
    } catch (error) {
        setErrorModal({ isOpen: true, title: "Payment Error", message: error.message });
    }
};

  return (
    <div className="inquiry-container">
      <h3>Transaction Inquiry</h3>

      <div className="inquiry-tabs">
        <button className={activeTab === "counterSession" ? "active" : ""} onClick={() => setActiveTab("counterSession")}>
          Counter Session
        </button>
        <button className={activeTab === "cashTransaction" ? "active" : ""} onClick={() => setActiveTab("cashTransaction")}>
          Cash Transaction
        </button>
        <button className={activeTab === "salesInvoice" ? "active" : ""} onClick={() => setActiveTab("salesInvoice")}>
          Sales Invoice
        </button>
        <button className={activeTab === "purchaseInvoice" ? "active" : ""} onClick={() => setActiveTab("purchaseInvoice")}>
          Purchase Invoice
        </button>
        <button className={activeTab === "creditNote" ? "active" : ""} onClick={() => setActiveTab("creditNote")}>
          Credit Note
        </button>
      </div>

      {activeTab === "counterSession" && (
        <>
          {/* <div className="search-inquiry-container">
            <label>Open Date:</label>
            <input
              type="date"
              value={openDate}
              onChange={(e) => setOpenDate(e.target.value)}
              className="date-input"
            />

            <label>Close Date:</label>
            <input
              type="date"
              value={closeDate}
              onChange={(e) => setCloseDate(e.target.value)}
              className="date-input"
            />
          </div>      */}
          <div className="pagination-controls">
            <label>
              Show:
              <select
              value={pagination[activeTab].itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Session Code</th>
                  <th>Opening Balance</th>
                  <th>Closing Balance</th>
                  <th>Variance</th>
                  <th>Opened By</th>
                  <th>Closed By</th>
                  <th>Open Time</th>
                  <th>Close Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counterSessions.map((txn, index) => {
                  const isExpanded = expandedCounterRow === txn.counterSessionId;
                  return (
                    <React.Fragment key={txn.counterSessionId}>
                      <tr>
                      <td>{(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + index + 1}</td>
                      <td>{txn.sessionCode ? txn.sessionCode : "-"}</td>
                        <td>{txn.openingBal !== null ? txn.openingBal : "-"}</td>
                        <td>{txn.closingBal !== null ? txn.closingBal : "-"}</td>
                        <td>{txn.variance !== null ? txn.variance : "-"}</td>
                        <td>{txn.openBy ? txn.openBy : "-"}</td>
                        <td>{txn.closeBy ? txn.closeBy : "-"}</td>
                        <td>{txn.openTime ? formatDateTime(txn.openTime) : "-'"}</td>
                        <td>{txn.closeTime ? formatDateTime(txn.closeTime) : "-"}</td>
                        <td>
                          <button
                            className="view-button"
                            onClick={() => setExpandedCounterRow(isExpanded ? null : txn.counterSessionId)}
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="10">
                            <div className="expanded-content">
                              <h4>Additional Details</h4>
                              <table className="details-table">
                                <tbody>
                                  <tr>
                                    <td><strong>Sales Amount:</strong></td>
                                    <td>{txn.salesAmt !== null ? txn.salesAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Purchase Amount:</strong></td>
                                    <td>{txn.purchaseAmt !== null ? txn.purchaseAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Sales Payment Amount:</strong></td>
                                    <td>{txn.salesPaymentAmt !== null ? txn.salesPaymentAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Purchase Payment Amount:</strong></td>
                                    <td>{txn.purchasePaymentAmt !== null ? txn.purchasePaymentAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Cash In Amount:</strong></td>
                                    <td>{txn.cashInAmt !== null ? txn.cashInAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Cash Out Amount:</strong></td>
                                    <td>{txn.cashOutAmt !== null ? txn.cashOutAmt : "-"}</td>
                                  </tr>
                                  <tr>
                                    <td><strong>Expected Closing Balance:</strong></td>
                                    <td>{txn.expectedClosingBalance !== null ? txn.expectedClosingBalance : "-"}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button
              disabled={pagination[activeTab].currentPage === 1}
              onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination[activeTab].currentPage}</span>
            <button
              disabled={!totalRecords}
              onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
              >
              Next
            </button>
          </div>
        </>
      )}
      
      {activeTab === "cashTransaction" && (
        <>
          <div className="search-inquiry-container">
            <input
              type="text"
              placeholder="Enter Doc No"
              value={docNo}
              onChange={(e) => setDocNo(e.target.value)}
            />
            <label>
              <input
                type="checkbox"
                checked={isVoid}
                onChange={() => handleFilterChange("isVoid")}
              />
              Show Only Voided Transactions
            </label>
            <label>
              <input
                type="checkbox"
                checked={isCashOut}
                onChange={() => handleFilterChange("isCashOut")}
              />
              Show Only Cash Out Transactions
            </label>
            <label>
              <input
                type="checkbox"
                checked={isVoidAndCashOut}
                onChange={() => handleFilterChange("isVoidAndCashOut")}
              />
              Show Only Voided & Cash Out Transactions
            </label>
            <label>
              <input
                type="checkbox"
                checked={showAll}
                onChange={() => handleFilterChange("showAll")}
              />
              Show All Transactions
            </label>
          </div>

          <div className="pagination-controls">
            <label>
              Show:
              <select
                value={pagination[activeTab].itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Doc No</th>
                  <th>Amount</th>
                  <th>Remark</th>
                  <th>Is Void</th>
                  <th>Is Cash Out</th>
                  <th>Created By</th>
                  <th>Created Time</th>
                  <th>Last Modified By</th>
                  <th>Last Modified Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((txn, index) => (
                  <tr key={txn.cashTransactionId}>
                    <td>{(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + index + 1}</td>
                    <td>{txn.docNo || "-"}</td>
                    <td>{txn.effectedAmount !== null ? txn.effectedAmount : "-"}</td>
                    <td>{txn.remarks || "-"}</td>
                    <td>{txn.isVoid ? "Yes" : "No"}</td>
                    <td>{txn.isCashOut ? "Yes" : "No"}</td>
                    <td>{usersCache[txn.createdBy] || "-"}</td>
                    <td>{formatDateTime(txn.createdTimeStamp) || "-"}</td>
                    <td>{usersCache[txn.lastModifiedBy] || "-"}</td>
                    <td>{formatDateTime(txn.lastModifiedTimeStamp) || "-"}</td>
                    <td>
                      {txn.isVoid ? (
                        <button className="disabled-void" disabled>Voided</button>
                      ) : (
                        <button className="void-button" onClick={() => confirmVoidTransaction(txn.cashTransactionId)}>Void</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button
              disabled={pagination[activeTab].currentPage === 1}
              onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination[activeTab].currentPage}</span>
            <button
              disabled={!totalRecords}
              onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {activeTab === "salesInvoice" && (
        <>
          <div className="search-inquiry-container">
            <input type="text" placeholder="Enter Doc No" value={docNo} onChange={(e) => setDocNo(e.target.value)} />
            <input type="text" placeholder="Enter Debtor Code" value={debtorCode} onChange={(e) => setDebtorCode(e.target.value)} />
            <label><input type="checkbox" checked={isComplete} onChange={() => handleSalesFilterChange("isComplete")} /> Show Only Completed</label>
            <label><input type="checkbox" checked={isSalesVoid} onChange={() => handleSalesFilterChange("isSalesVoid")} /> Show Only Voided</label>
            <label><input type="checkbox" checked={isSalesVoidAndCompleted} onChange={() => handleSalesFilterChange("isSalesVoidAndCompleted")} /> Show Only Voided and Completed</label>
            <label><input type="checkbox" checked={showAllSales} onChange={() => handleSalesFilterChange("showAllSales")} /> Show All</label>
          </div>

          <div className="pagination-controls">
            <label>
              Show:
              <select
                value={pagination[activeTab].itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Doc Date</th>
                  <th>Doc No</th>
                  <th>Debtor Code</th>
                  <th>Total</th>
                  <th>Outstanding</th>
                  <th>Change</th>
                  <th>Completed</th>
                  <th>Void</th>
                  <th>Location Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalesTransactions.map((txn, index) => {
                  const isExpanded = expandedRow === txn.salesId;
                  const outstandingView = txn.outstandingBal < 0 ? 0 : txn.outstandingBal;
                  const changeView = txn.outstandingBal < 0 ? Math.abs(txn.outstandingBal) : 0;
                  return (
                    <React.Fragment key={txn.salesId}>
                      <tr>
                      <td>{(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + index + 1}</td>
                      <td>{formatDateTime(txn.docDate) || "-"}</td>
                        <td>{txn.docNo || "-"}</td>
                        <td>{txn.debtorCode || "-"}</td>
                        <td>{txn.total !== null ? txn.total: "-" }</td>
                        <td>{outstandingView}</td>
                        <td>{changeView}</td>
                        <td>{txn.isComplete ? "Yes" : "No"}</td>
                        <td>{txn.isVoid ? "Yes" : "No"}</td>
                        <td>{txn.locationCode || "-"}</td>
                        <td>
                          {txn.isVoid ? (
                            <button className="disabled-void" disabled>Voided</button>
                          ) : (
                            <button
                              className="void-button"
                              onClick={() => confirmVoidSalesTransaction(txn.salesId)}
                            >
                              Void
                            </button>
                          )}

                          <button
                            className="view-button"
                            onClick={() => setExpandedRow(isExpanded ? null : txn.salesId)}
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>

                          {!txn.isComplete && !txn.isVoid && (
                            <button
                              className="pay-button"
                              onClick={() => setPayModal({ isOpen: true, transactionId: txn.salesId, outstandingAmount: txn.outstandingBal, type: "sales" })
                            }
                            >
                              Pay
                            </button>
                          )}
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="9">
                            <div className="expanded-content">
                              <h4>Details</h4>
                              <table className="details-table">
                                <thead>
                                  <tr>
                                    <th>Item Code</th>
                                    <th>Description</th>
                                    <th>UOM</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Discount</th>
                                    <th>Discount Amount</th>
                                    <th>SubTotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {txn.details.map((detail) => (
                                    <tr key={detail.salesDetailId}>
                                      <td>{detail.itemCode || "-"}</td>
                                      <td>{detail.description || "-"}</td>
                                      <td>{detail.uom || "-"}</td>
                                      <td>{detail.qty !== null ? detail.qty : "-"}</td>
                                      <td>{detail.unitPrice !== null ? detail.unitPrice : "-"}</td>
                                      <td>{detail.discount || "-"}</td>
                                      <td>{detail.discountAmount !== null ? detail.discountAmount : "-"}</td>
                                      <td>{detail.subTotal !== null ? detail.subTotal : "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <h4>Payment History</h4>
                              {txn.paymentHistory.length > 0 ? (
                                <table className="details-table">
                                  <thead>
                                    <tr>
                                      <th>Payment Date</th>
                                      <th>Doc No</th>
                                      <th>Remark</th>
                                      <th>Reference</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {txn.paymentHistory.map((payment) => (
                                      <tr key={payment.salesPaymentId}>
                                        <td>{formatDateTime(payment.paymentDate) || "-"}</td>
                                        <td>{payment.docNo || "-"}</td>
                                        <td>{payment.remark || "-"}</td>
                                        <td>{payment.reference || "-"}</td>
                                        <td>{payment.amount !== null ? payment.amount : "-"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>No payment history available.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button
              disabled={pagination[activeTab].currentPage === 1}
              onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination[activeTab].currentPage}</span>
            <button
              disabled={!totalRecords}
              onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {activeTab === "purchaseInvoice" && (
        <>
          <div className="search-inquiry-container">
            <input type="text" placeholder="Enter Doc No" value={docNo} onChange={(e) => setDocNo(e.target.value)} />
            <input type="text" placeholder="Enter Creditor Code" value={creditorCode} onChange={(e) => setCreditorCode(e.target.value)} />
            <label><input type="checkbox" checked={isComplete} onChange={() => handlePurchasesFilterChange("isComplete")} /> Show Only Completed</label>
            <label><input type="checkbox" checked={isPurchaseVoid} onChange={() => handlePurchasesFilterChange("isPurchaseVoid")} /> Show Only Voided</label>
            <label><input type="checkbox" checked={isPurchaseVoidAndCompleted} onChange={() => handleSalesFilterChange("isPurchaseVoidAndCompleted")} /> Show Only Voided and Completed</label>
            <label><input type="checkbox" checked={showAllPurchases} onChange={() => handlePurchasesFilterChange("showAllPurchases")} /> Show All</label>
          </div>

          <div className="pagination-controls">
            <label>
              Show:
              <select
                value={pagination[activeTab].itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Doc Date</th>
                  <th>Doc No</th>
                  <th>Creditor Code</th>
                  <th>Total</th>
                  <th>Outstanding</th>
                  <th>Change</th>
                  <th>Completed</th>
                  <th>Void</th>
                  <th>Location Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchasesTransactions.map((txn, index) => {
                  const isExpanded = expandedPurchaseRow === txn.purchaseId;
                  const outstandingView = txn.outstandingBal < 0 ? 0 : txn.outstandingBal;
                  const changeView = txn.outstandingBal < 0 ? Math.abs(txn.outstandingBal) : 0;
                  return (
                    <React.Fragment key={txn.purchaseId}>
                      <tr>
                        <td>{(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + index + 1}</td>
                        <td>{formatDateTime(txn.docDate) || "-"}</td>
                        <td>{txn.docNo || "-"}</td>
                        <td>{txn.creditorCode || "-"}</td>
                        <td>{txn.total !== null ? txn.total : "-'"}</td>
                        <td>{outstandingView}</td>
                        <td>{changeView}</td>
                        <td>{txn.isComplete ? "Yes" : "No"}</td>
                        <td>{txn.isVoid ? "Yes" : "No"}</td>
                        <td>{txn.locationCode || "-"}</td>
                        <td>
                          {txn.isVoid ? (
                            <button className="disabled-void" disabled>Voided</button>
                          ) : (
                            <button
                              className="void-button"
                              onClick={() => confirmVoidPurchasesTransaction(txn.purchaseId)}
                            >
                              Void
                            </button>
                          )}

                          <button
                            className="view-button"
                            onClick={() => setExpandedPurchaseRow(isExpanded ? null : txn.purchaseId)}
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>

                            {!txn.isComplete && !txn.isVoid && (
                              <button
                                className="pay-button"
                                onClick={() => setPayModal({ isOpen: true, transactionId: txn.purchaseId, outstandingAmount: txn.outstandingBal, type: "purchase" })}
                              >
                                Pay
                              </button>
                            )}
                       </td>
                      </tr>

                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="9">
                            <div className="expanded-content">
                              <h4>Details</h4>
                              <table className="details-table">
                                <thead>
                                  <tr>
                                    <th>Item Code</th>
                                    <th>Description</th>
                                    <th>UOM</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Discount</th>
                                    <th>Discount Amount</th>
                                    <th>SubTotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {txn.details.map((detail) => (
                                    <tr key={detail.purchaseDetailId}>
                                      <td>{detail.itemCode || "-"}</td>
                                      <td>{detail.description | "-"}</td>
                                      <td>{detail.uom || "-"}</td>
                                      <td>{detail.qty !== null ? detail.qty : "-"}</td>
                                      <td>{detail.unitPrice !== null ? detail.unitPrice : "-"}</td>
                                      <td>{detail.discount || "-"}</td>
                                      <td>{detail.discountAmount !== null ? detail.discountAmount : "-"}</td>
                                      <td>{detail.subTotal !== null ? detail.subTotal : "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              <h4>Payment History</h4>
                              {txn.paymentHistory.length > 0 ? (
                                <table className="details-table">
                                  <thead>
                                    <tr>
                                      <th>Payment Date</th>
                                      <th>Remark</th>
                                      <th>Reference</th>
                                      <th>Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {txn.paymentHistory.map((payment) => (
                                      <tr key={payment.purchasePaymentId}>
                                        <td>{formatDateTime(payment.paymentDate) || "-"}</td>
                                        <td>{payment.remark || "-"}</td>
                                        <td>{payment.reference || "-"}</td>
                                        <td>{payment.amount !== null ? payment.amount : "-"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p>No payment history available.</p>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button
              disabled={pagination[activeTab].currentPage === 1}
              onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination[activeTab].currentPage}</span>
            <button
              disabled={!totalRecords}
              onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {activeTab === "creditNote" && (
        <>
          <div className="search-inquiry-container">
            <input type="text" placeholder="Enter Doc No" value={docNo} onChange={(e) => setDocNo(e.target.value)} />
            <input type="text" placeholder="Enter Debtor Code" value={debtorCode} onChange={(e) => setDebtorCode(e.target.value)} />
            <label><input type="checkbox" checked={isVoid} onChange={() => handleCreditNoteFilterChange("isVoid")} /> Show Only Voided</label>
            <label><input type="checkbox" checked={showAllCreditNote} onChange={() => handleCreditNoteFilterChange("showAllCreditNote")} /> Show All</label>
          </div>

          <div className="pagination-controls">
            <label>
              Show:
              <select
                value={pagination[activeTab].itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Doc Date</th>
                  <th>Doc No</th>
                  <th>Debtor Code</th>
                  <th>Total</th>
                  <th>Void</th>
                  <th>Location Code</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreditNote.map((txn, index) => {
                  const isExpanded = expandedCreditNoteRow === txn.creditNoteId;
                  return (
                    <React.Fragment key={txn.creditNoteId}>
                      <tr>
                        <td>{(pagination[activeTab].currentPage - 1) * pagination[activeTab].itemsPerPage + index + 1}</td>
                        <td>{formatDateTime(txn.docDate) || "-"}</td>
                        <td>{txn.docNo || "-"}</td>
                        <td>{txn.debtorCode || "-"}</td>
                        <td>{txn.total !== null ? txn.total : "-"}</td>
                        <td>{txn.isVoid ? "Yes" : "No"}</td>
                        <td>{txn.locationCode || "-" }</td>
                        <td>
                          {txn.isVoid ? (
                            <button className="disabled-void" disabled>Voided</button>
                          ) : (
                            <button
                              className="void-button"
                              onClick={() => confirmVoidCreditNote(txn.creditNoteId)}
                            >
                              Void
                            </button>
                          )}

                          <button
                            className="view-button"
                            onClick={() => setExpandedCreditNoteRow(isExpanded ? null : txn.creditNoteId)}
                          >
                            {isExpanded ? "Hide" : "View"}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="expanded-row">
                          <td colSpan="7">
                            <div className="expanded-content">
                              <h4>Details</h4>
                              <table className="details-table">
                                <thead>
                                  <tr>
                                    <th>Item Code</th>
                                    <th>Description</th>
                                    <th>UOM</th>
                                    <th>Qty</th>
                                    <th>Unit Price</th>
                                    <th>Discount</th>
                                    <th>SubTotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {txn.details.map((detail) => (
                                    <tr key={detail.creditNoteDetailId}>
                                      <td>{detail.itemCode || "-"}</td>
                                      <td>{detail.description || "-"}</td>
                                      <td>{detail.uom || "-"}</td>
                                      <td>{detail.qty !== null ? detail.qty : "-"}</td>
                                      <td>{detail.unitPrice !== null ? detail.unitPrice : "-"}</td>
                                      <td>{detail.discountAmount !== null ? detail.discountAmount : "-"}</td>
                                      <td>{detail.subTotal !== null ? detail.subTotal : "-"}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="pagination">
            <button
              disabled={pagination[activeTab].currentPage === 1}
              onClick={() => handlePageChange(pagination[activeTab].currentPage - 1)}
            >
              Previous
            </button>
            <span>Page {pagination[activeTab].currentPage}</span>
            <button
              disabled={!totalRecords}
              onClick={() => handlePageChange(pagination[activeTab].currentPage + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
      {confirmModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmModal.isOpen}
          title="Confirm Void"
          message={confirmModal.message}
          onConfirm={handleVoidTransaction}
          onCancel={() => setConfirmModal({ isOpen: false, transactionId: null, message: "" })}
        />
      )}
      {confirmSalesModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmSalesModal.isOpen}
          title="Confirm Void"
          message={confirmSalesModal.message}
          onConfirm={handleVoidSalesTransaction}
          onCancel={() => setConfirmSalesModal({ isOpen: false, salesId: null, message: "" })}
        />
      )}
      {confirmPurchasesModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmPurchasesModal.isOpen}
          title="Confirm Void"
          message={confirmPurchasesModal.message}
          onConfirm={handleVoidPurchasesTransaction}
          onCancel={() => setConfirmPurchasesModal({ isOpen: false, purchaseId: null, message: "" })}
        />
      )}
      {confirmCreditNoteModal.isOpen && (
        <ConfirmationModal
          isOpen={confirmCreditNoteModal.isOpen}
          title="Confirm Void"
          message={confirmCreditNoteModal.message}
          onConfirm={handleVoidCreditNote}
          onCancel={() => setConfirmCreditNoteModal({ isOpen: false, creditNoteId: null, message: "" })}
        />
      )}
      {errorModal.isOpen && (
        <ErrorModal
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        />
      )}
      {payModal.isOpen && (
        <OutstandingPaymentModal
          isOpen={payModal.isOpen}
          onClose={() => setPayModal({ isOpen: false, transactionId: null })}
          onConfirm={(payments, totalPaid, type, reference) => handlePaymentConfirm(payments, totalPaid, type, reference)}
          outstandingAmount={payModal.outstandingAmount}
          type={payModal.type} 
        />
      )}

    </div>
  );
};

export default InquiryScreen;
