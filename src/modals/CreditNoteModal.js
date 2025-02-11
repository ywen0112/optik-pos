import React, { useState, useEffect } from "react";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CreditNoteModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    dateTime: new Date().toISOString(),
    debtorCode: "",
    debtorName: "",
    memberCode: "",
    debtorMobile: "",
    debtorAddress: "",
    pickUpLocationId: "",
    glassesProfile: {},
    contactLensProfile: {},
    items: [],
    payments: [],
    salesAgent: "",
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

  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [error, setError] = useState("");
  const [collapsedSections, setCollapsedSections] = useState({
    debtorInfo: true,
    glassesProfile: true,
    contactLensesProfile: true,
    items: true,
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        dateTime: new Date().toISOString(),
        debtorCode: "",
        debtorName: "",
        memberCode: "",
        debtorMobile: "",
        debtorAddress: "",
        pickUpLocationId: "",
        glassesProfile: {},
        contactLensProfile: {},
        items: [],
        payments: [],
        salesAgent: "",
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
      setError("");
    }
  }, [isOpen]);

  const handleInputChange = (e, section, key) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
    }
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

  const calculateTotalPaid = () => {
    return formData.payments.reduce((total, payment) => total + parseFloat(payment.amount), 0);
  };

  const handleSubmit = () => {
    setConfirmationModal(false);
    // Simulate submission process
    const isSuccess = Math.random() > 0.5; // Simulate success/failure randomly
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

  if (!isOpen) return null; // Prevent rendering when modal is closed

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-content">
        <h2>Credit Note</h2>

      <div className="sales-popup-form">
        {/* Section 1: Debtor Information */}
        <h3 className="collapsible-header" onClick={() => toggleSection("debtorInfo")}>
          Debtor Information <i className={`fas ${collapsedSections.debtorInfo ? "fa-chevron-down" : "fa-chevron-up"}`} />
        </h3>
        {!collapsedSections.debtorInfo && (
        <div className="sales-form-section">
          <div className="sales-form-group">
            <label>Date Time</label>
            <input type="text" value={formData.dateTime} readOnly />
          </div>
          <div className="sales-form-group">
            <label>Debtor Code</label>
            <input type="text" value={formData.debtorCode} onChange={(e) => handleInputChange(e, null, "debtorCode")} />
          </div>
          <div className="sales-form-group">
            <label>Debtor Name</label>
            <input type="text" value={formData.debtorName} onChange={(e) => handleInputChange(e, null, "debtorName")} />
          </div>
          <div className="sales-form-group">
            <label>Member Code</label>
            <input type="text" value={formData.memberCode} onChange={(e) => handleInputChange(e, null, "memberCode")} />
          </div>
          <div className="sales-form-group">
            <label>Debtor Mobile</label>
            <input type="text" value={formData.debtorMobile} onChange={(e) => handleInputChange(e, null, "debtorMobile")} />
          </div>
          <div className="sales-form-group">
            <label>Debtor Address</label>
            <input type="text" value={formData.debtorAddress} onChange={(e) => handleInputChange(e, null, "debtorAddress")} />
          </div>
          <div className="sales-form-group">
            <label>Outstanding Balance</label>
            <input type="text" value={formData.debtorAddress} onChange={(e) => handleInputChange(e, null, "debtorAddress")} />
          </div>
          <div className="sales-form-group">
            <label>Currency Code</label>
            <select value={formData.currencyCode} onChange={(e) => handleInputChange(e, null, "currencyCode")}>
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MYR">MYR</option>
            </select>
          </div>
        </div>
        )}

        {/* Section 2: Glasses Profile */}
        <h3 className="collapsible-header" onClick={() => toggleSection("glassesProfile")}>
          Glasses Profile <i className={`fas ${collapsedSections.glassesProfile ? "fa-chevron-down" : "fa-chevron-up"}`} />
        </h3>
          {!collapsedSections.glassesProfile && (
            <div className="sales-profile-form-section">
              {["Right Eye SPH", "Right Eye CYL", "Right Eye AXIS", "Left Eye SPH", "Left Eye CYL", "Left Eye AXIS"].map((label) => (
                <div className="sales-form-group" key={label}>
                  <label>{label}:</label>
                  <input type="text" value={formData.glassesProfile[label] || ""} onChange={(e) => handleInputChange(e, "glassesProfile", label)} />
                </div>
              ))}
            </div>
          )}

          {/* Section 3: Contact Lenses Profile */}
          <h3 className="collapsible-header" onClick={() => toggleSection("contactLensesProfile")}>
            Contact Lenses Profile <i className={`fas ${collapsedSections.contactLensesProfile ? "fa-chevron-down" : "fa-chevron-up"}`} />
          </h3>
          {!collapsedSections.contactLensesProfile && (
            <div className="sales-profile-form-section">
              {["Right Eye SPH", "Right Eye CYL", "Right Eye AXIS", "Left Eye SPH", "Left Eye CYL", "Left Eye AXIS"].map((label) => (
                <div className="sales-form-group" key={label}>
                  <label>{label}:</label>
                  <input type="text" value={formData.contactLensProfile[label] || ""} onChange={(e) => handleInputChange(e, "contactLensProfile", label)} />
                </div>
              ))}
            </div>
          )}

        {/* Section 4: Item Information */}
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
          <div className="sales-form-group">
            <label>Batch No:</label>
            <input type="text" value={item.batchNo} onChange={(e) => setItem({ ...item, batchNo: e.target.value })} />
          </div>
          <div className="sales-form-group">
            <label>Description:</label>
            <input type="text" value={item.itemDescription} onChange={(e) => setItem({ ...item, itemDescription: e.target.value })} />
          </div>
        </div>
        )}
        
        <div className="transaction-table">
              <table>
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((i, index) => (
                    <tr key={index}>
                      <td>{i.itemCode}</td>
                      <td>{i.itemName}</td>
                      <td>{i.itemUnitPrice.toFixed(2)}</td>
                      <td>{i.itemQuantity}</td>
                      <td>{(i.itemUnitPrice * i.itemQuantity).toFixed(2)}</td>
                      <td>
                        <button className="edit-button" onClick={() => setItem({ ...i })}>Edit</button>
                        <button className="delete-button" onClick={() => setFormData({ ...formData, items: formData.items.filter((_, idx) => idx !== index) })}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>

        {/* Total Summary */}
        <p><strong>Total Amount: </strong>{calculateTotalAmount().toFixed(2)}</p>

        {/* Action Buttons */}
        <div className="transaction-modal-buttons">
          <button className="modal-add-button" onClick={handleSubmit}>Submit</button>
          <button className="modal-close-button" onClick={onClose}>Close</button>
        </div>

        {/* Modals */}
        <ConfirmationModal isOpen={confirmationModal} title="Confirm Submission" message="Are you sure you want to submit the sales invoice?" onConfirm={handleSubmit} onCancel={() => setConfirmationModal(false)} />
        <SuccessModal isOpen={successModal.isOpen} title={successModal.title} message={successModal.message} onClose={() => setSuccessModal({ isOpen: false })} />
        <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ isOpen: false })} />
        </div>
    </div>
  );
};

export default CreditNoteModal;
