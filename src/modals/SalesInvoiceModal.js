import React, { useState, useEffect } from "react";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SalesInvoiceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString(),
    debtorId: "",
    debtorCode: "",
    companyName: "",
    items: [],
    payments: [],
    currencyCode: "",
    outstandingBalance: "",
  });

  const [item, setItem] = useState({
    itemCode: "",
    itemName: "",
    batchNo: "",
    itemDescription: "",
    itemUnitPrice: "",
    itemQuantity: "",
  });

  const [debtors, setDebtors] = useState([]); // Stores Debtor options
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [collapsedSections, setCollapsedSections] = useState({
    debtorInfo: true,
    items: true,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        dateTime: new Date().toISOString(),
        debtorId: localStorage.getItem("debtorId") || "",
        debtorCode: "",
        companyName: "",
        items: [],
        payments: [],
        currencyCode: "",
        outstandingBalance: "",
      });
      setItem({
        itemCode: "",
        itemName: "",
        batchNo: "",
        itemDescription: "",
        itemUnitPrice: "",
        itemQuantity: "",
      });

      fetchDebtors();
    }
  }, [isOpen]);

  // Fetch Debtor List
  const fetchDebtors = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Debtor/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          keyword: "",
          offset: 0,
          limit: 10,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const options = data.data.map((debtor) => ({
          value: debtor.debtorId,
          label: `${debtor.debtorCode} - ${debtor.companyName}`,
          debtorCode: debtor.debtorCode,
          companyName: debtor.companyName,
        }));
        setDebtors(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch debtors.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Debtors", message: error.message });
    }
  };

  // Handle Debtor Selection
  const handleDebtorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      debtorId: selectedOption.value,
      debtorCode: selectedOption.debtorCode,
      companyName: selectedOption.companyName,
    }));
    localStorage.setItem("debtorId", selectedOption.value); // Store for future use
  };

  const handleInputChange = (e, key) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleAddItem = () => {
    if (!item.itemCode || !item.itemName || !item.itemUnitPrice || !item.itemQuantity) {
      setErrorModal({ isOpen: true, title: "Incomplete Item", message: "Please fill in all item fields." });
      return;
    }
    setFormData((prev) => ({ ...prev, items: [...prev.items, { ...item }] }));
    setItem({
      itemCode: "",
      itemName: "",
      batchNo: "",
      itemDescription: "",
      itemUnitPrice: "",
      itemQuantity: "",
    });
  };

  const calculateTotalAmount = () => {
    return formData.items.reduce((total, item) => total + item.itemUnitPrice * item.itemQuantity, 0);
  };

  const handleSubmit = () => {
    setConfirmationModal(false);
    const isSuccess = Math.random() > 0.5; // Simulate success/failure
    if (isSuccess) {
      setSuccessModal({
        isOpen: true,
        title: "Submission Successful",
        message: "The sales invoice was submitted successfully.",
      });
    } else {
      setErrorModal({
        isOpen: true,
        title: "Submission Failed",
        message: "An error occurred while submitting the sales invoice.",
      });
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-content">
        <h2>Sales Invoice</h2>

        <div className="sales-popup-form">
          {/* Section 1: Debtor Information */}
          <h3 className="collapsible-header" onClick={() => toggleSection("debtorInfo")}>
            Debtor Information <i className={`fas ${collapsedSections.debtorInfo ? "fa-chevron-down" : "fa-chevron-up"}`} />
          </h3>
          {!collapsedSections.debtorInfo && (
            <div className="sales-form-section">
              <div className="sales-form-group">
                <label>Debtor Code</label>
                <Select
                  options={debtors}
                  value={debtors.find((debtor) => debtor.value === formData.debtorId) || ""}
                  onChange={handleDebtorChange}
                  isSearchable
                  placeholder="Select Debtor"
                />
              </div>
              <div className="sales-form-group">
                <label>Company Name</label>
                <input type="text" value={formData.companyName} readOnly />
              </div>
            </div>
          )}

          {/* Section 2: Item Information */}
          <h3 className="collapsible-header" onClick={() => toggleSection("items")}>
            Item Information <i className={`fas ${collapsedSections.items ? "fa-chevron-down" : "fa-chevron-up"}`} />
          </h3>
          {!collapsedSections.items && (
            <div className="sales-form-section">
              <div className="sales-form-group">
                <label>Item Code:</label>
                <input type="text" value={item.itemCode} onChange={(e) => setItem({ ...item, itemCode: e.target.value })} />
              </div>
              <div className="sales-form-group">
                <label>Item Name:</label>
                <input type="text" value={item.itemName} onChange={(e) => setItem({ ...item, itemName: e.target.value })} />
              </div>
              <div className="sales-form-group">
                <label>Unit Price:</label>
                <input type="number" value={item.itemUnitPrice} onChange={(e) => setItem({ ...item, itemUnitPrice: e.target.value })} />
              </div>
              <div className="sales-form-group">
                <label>Quantity:</label>
                <input type="number" value={item.itemQuantity} onChange={(e) => setItem({ ...item, itemQuantity: e.target.value })} />
              </div>
              <button className="modal-add-button" onClick={handleAddItem}>Add Item</button>
            </div>
          )}
        </div>

        <p><strong>Total Amount: </strong>{calculateTotalAmount().toFixed(2)}</p>

        <div className="transaction-modal-buttons">
          <button className="modal-add-button" onClick={handleSubmit}>Submit</button>
          <button className="modal-close-button" onClick={onClose}>Close</button>
        </div>

        <ConfirmationModal isOpen={confirmationModal} onConfirm={handleSubmit} onCancel={() => setConfirmationModal(false)} />
        <SuccessModal isOpen={successModal.isOpen} onClose={() => setSuccessModal({ isOpen: false })} />
        <ErrorModal isOpen={errorModal.isOpen} onClose={() => setErrorModal({ isOpen: false })} />
      </div>
    </div>
  );
};

export default SalesInvoiceModal;
