import React, { useState, useEffect } from "react";
import "../../css/InquiryScreen.css";

const InquiryScreen = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("cashTransaction");
  const [docNo, setDocNo] = useState("");
  const [isVoid, setIsVoid] = useState(false);
  const [isCashOut, setIsCashOut] = useState(false);
  const [isVoidAndCashOut, setIsVoidAndCashOut] = useState(false);
  const [showAll, setShowAll] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [usersCache, setUsersCache] = useState({});
  const [salesTransactions, setSalesTransactions] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isSalesVoid, setIsSalesVoid] = useState(false);
  const [showAllSales, setShowAllSales] = useState(true);
  const [isSalesVoidAndCompleted, setIsSalesVoidAndCompleted] = useState(false);
  const [debtorCode, setDebtorCode] = useState("");
  const [purchaseTransactions, setPurchaseTransactions] = useState([]);
  const [isPurchaseVoid, setIsPurchaseVoid] = useState(false);
  const [isPurchaseVoidAndCompleted, setIsPurchaseVoidAndCompleted] = useState(false);
  const [showAllPurchases, setShowAllPurchases] = useState(true);
  const [creditorCode, setCreditorCode] = useState("");
  const [creditNote, setCreditNote] = useState([]);
  const [showAllCreditNote, setShowAllCreditNote] = useState(true);

  useEffect(() => {
    if (activeTab === "cashTransaction") {
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
 
  }, [activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/GetCashTransactionsRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTransactions([...data.data]);
        fetchUserNames(data.data);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch transactions.");
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Sales/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSalesTransactions([...data.data]);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch sales transactions.");
      }
    } catch (error) {
      console.error("Error fetching sales transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPurchaseTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Purchases/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setPurchaseTransactions([...data.data]);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch purchase transactions.");
      }
    } catch (error) {
      console.error("Error fetching purchase transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCreditNotes = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCreditNote([...data.data]);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch credit note.");
      }
    } catch (error) {
      console.error("Error fetching credit note:", error);
    } finally {
      setLoading(false);
    }
  };

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
              customerId: 0,
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

  const handleVoidTransaction = async (cashTransactionId) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://optikposbackend.absplt.com/CashCounter/VoidCashTransaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          id: cashTransactionId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchTransactions(); // Refresh table after voiding
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      alert("Error voiding transaction. Please try again.");
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

  const handleVoidSales = async (salesId) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://optikposbackend.absplt.com/Sales/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          id: salesId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchSalesTransactions(); // Refresh table after voiding
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      alert("Error voiding transaction. Please try again.");
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

  const handleVoidPurchase = async (purchaseId) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://optikposbackend.absplt.com/Purchases/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          id: purchaseId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchPurchaseTransactions(); // Refresh table after voiding
      } else {
        throw new Error(data.errorMessage || "Failed to void transaction.");
      }
    } catch (error) {
      alert("Error voiding transaction. Please try again.");
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

  const handleVoidCreditNote = async (creditNoteId) => {
    try {
      const userId = localStorage.getItem("userId");

      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/Void", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: 0,
          id: creditNoteId,
          userId,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        fetchCreditNotes(); // Refresh table after voiding
      } else {
        throw new Error(data.errorMessage || "Failed to void credit note.");
      }
    } catch (error) {
      console.error("Error voiding credit note:", error);
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
  
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="inquiry-container">
      <h3>Transaction Inquiry</h3>

      {/* Tabs Section */}
      <div className="inquiry-tabs">
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

      {/* Inquiry Screens */}
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
                  <td>{index + 1}</td>
                  <td>{txn.docNo}</td>
                  <td>{txn.effectedAmount}</td>
                  <td>{txn.remarks}</td>
                  <td>{txn.isVoid ? "Yes" : "No"}</td>
                  <td>{txn.isCashOut ? "Yes" : "No"}</td>
                  <td>{usersCache[txn.createdBy] || "Loading..."}</td>
                  <td>{formatDateTime(txn.createdTimeStamp)}</td>
                  <td>{usersCache[txn.lastModifiedBy] || "-"}</td>
                  <td>{formatDateTime(txn.lastModifiedTimeStamp)}</td>
                  <td>
                    {txn.isVoid ? <button className="disabled-void" disabled>Voided</button> : <button className="void-button" onClick={() => handleVoidTransaction(txn.cashTransactionId)}>Void</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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

          {loading ? (
            <p>Loading...</p>
            ) : (
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Doc No</th>
                <th>Debtor Code</th>
                <th>Total</th>
                <th>Outstanding</th>
                <th>Location</th>
                <th>Completed</th>
                <th>Void</th>
                <th>Doc Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSalesTransactions.map((txn, index) => (
                <tr key={txn.salesId}>
                  <td>{index + 1}</td>
                  <td>{txn.docNo}</td>
                  <td>{txn.debtorCode}</td>
                  <td>{txn.total}</td>
                  <td>{txn.outstandingBal}</td>
                  <td>{txn.locationCode}</td>
                  <td>{txn.isComplete ? "Yes" : "No"}</td>
                  <td>{txn.isVoid ? "Yes" : "No"}</td>
                  <td>{formatDateTime(txn.docDate)}</td>
                  <td>
                    {txn.isVoid ? <button className="disabled-void" disabled>Voided</button> : <button className="void-button" onClick={() => handleVoidSales(txn.salesId)}>Void</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
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

          {loading ? (
            <p>Loading...</p>
            ) : (
          <table className="inquiry-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Doc No</th>
                <th>Creditor Code</th>
                <th>Total</th>
                <th>Outstanding</th>
                <th>Location</th>
                <th>Completed</th>
                <th>Void</th>
                <th>Doc Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchasesTransactions.map((txn, index) => (
                <tr key={txn.salesId}>
                  <td>{index + 1}</td>
                  <td>{txn.docNo}</td>
                  <td>{txn.creditorCode}</td>
                  <td>{txn.total}</td>
                  <td>{txn.outstandingBal}</td>
                  <td>{txn.locationCode}</td>
                  <td>{txn.isComplete ? "Yes" : "No"}</td>
                  <td>{txn.isVoid ? "Yes" : "No"}</td>
                  <td>{formatDateTime(txn.docDate)}</td>
                  <td>
                    {txn.isVoid ? <button className="disabled-void" disabled>Voided</button> : <button className="void-button" onClick={() => handleVoidPurchase(txn.purchaseId)}>Void</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
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

            {loading ? (
              <p>Loading...</p>
              ) : (
            <table className="inquiry-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Doc No</th>
                  <th>Debtor Code</th>
                  <th>Total</th>
                  <th>Location</th>
                  <th>Void</th>
                  <th>Doc Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreditNote.map((txn, index) => (
                  <tr key={txn.creditNoteId}>
                    <td>{index + 1}</td>
                    <td>{txn.docNo}</td>
                    <td>{txn.debtorCode}</td>
                    <td>{txn.total}</td>
                    <td>{txn.locationCode}</td>
                    <td>{txn.isVoid ? "Yes" : "No"}</td>
                    <td>{formatDateTime(txn.docDate)}</td>
                    <td>
                      {txn.isVoid ? <button className="disabled-void" disabled>Voided</button> : <button className="void-button" onClick={() => handleVoidCreditNote(txn.creditNoteId)}>Void</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </>
        )}
    </div>
  );
};

export default InquiryScreen;
