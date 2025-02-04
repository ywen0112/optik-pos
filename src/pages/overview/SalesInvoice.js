import React, { useState } from "react";
import "../../css/CrudModal.css";
import "../../css/Transaction.css"
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";
import ConfirmationModal from "../../modals/ConfirmationModal";

const SalesInvoice = () => {
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

   // Mock debtor data
   const debtorMockData = {
    D001: {
      debtorName: "John Doe",
      memberCode: "M001",
      debtorMobile: "1234567890",
      debtorAddress: "123 Main Street",
      tin: "TIN12345",
      currencyCode: "USD",
      pickUpLocationId: "L001",
      glassesProfile: {
        "Right Eye SPH": "-1.5",
        "Right Eye CYL": "-0.5",
        "Right Eye AXIS": "90",
        "Left Eye SPH": "-1.0",
        "Left Eye CYL": "-0.25",
        "Left Eye AXIS": "80",
      },
      contactLensProfile: {
        "Right Eye SPH": "-1.5",
        "Right Eye CYL": "-0.5",
        "Right Eye AXIS": "90",
        "Left Eye SPH": "-1.0",
        "Left Eye CYL": "-0.25",
        "Left Eye AXIS": "80",
      },
    },
    D002: {
      debtorName: "Jane Smith",
      memberCode: "M002",
      debtorMobile: "0987654321",
      debtorAddress: "456 Elm Street",
      tin: "TIN67890",
      currencyCode: "EUR",
      pickUpLocationId: "L002",
      glassesProfile: {
        "Right Eye SPH": "-2.0",
        "Right Eye CYL": "-1.0",
        "Right Eye AXIS": "70",
        "Left Eye SPH": "-1.5",
        "Left Eye CYL": "-0.75",
        "Left Eye AXIS": "60",
      },
      contactLensProfile: {
        "Right Eye SPH": "-2.0",
        "Right Eye CYL": "-1.0",
        "Right Eye AXIS": "70",
        "Left Eye SPH": "-1.5",
        "Left Eye CYL": "-0.75",
        "Left Eye AXIS": "60",
      },
    },
  };

  const itemMockData = {
    I001: {
      itemName: "Widget A",
      batchNo: "B001",
      itemDescription: "High-quality widget",
      unitPrices: {
        USD: 50.0,
        EUR: 45.0,
        MYR: 200.0,
      },
    },
    I002: {
      itemName: "Gadget B",
      batchNo: "B002",
      itemDescription: "Premium gadget",
      unitPrices: {
        USD: 75.0,
        EUR: 70.0,
        MYR: 300.0,
      },
    },
  };

  const handleInputChange = (e, section, key) => {
    const value = e.target.value;
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [key]: value }));
      
      // Auto-fill debtor details when debtorCode is entered
      if (key === "debtorCode" && debtorMockData[value]) {
        const debtor = debtorMockData[value];
        setFormData((prev) => ({
          ...prev,
          ...debtor,
          glassesProfile: debtor.glassesProfile,
          contactLensProfile: debtor.contactLensProfile,
        }));
      }
    }
  };

  const handleItemCodeChange = (e) => {
    const value = e.target.value;
    setItem((prev) => ({ ...prev, itemCode: value }));

    // Auto-fill item details when itemCode is entered
    if (itemMockData[value]) {
      const selectedItem = itemMockData[value];
      setItem((prev) => ({
        ...prev,
        itemName: selectedItem.itemName,
        batchNo: selectedItem.batchNo,
        itemDescription: selectedItem.itemDescription,
        itemUnitPrice: selectedItem.unitPrices[formData.currencyCode] || 0,
      }));
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

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="sales-invoice-container">
      <h2>Sales Invoice</h2>

      {/* First Section: Info */}
      <div className="section">
        <h3>Info</h3>
        <div className="popup-form">
          <div className="form-group">
            <label>Date Time:</label>
            <input type="text" value={formData.dateTime} readOnly />
          </div>
          <div className="form-group">
            <label>Debtor Code:</label>
            <input
              type="text"
              value={formData.debtorCode}
              onChange={(e) => handleInputChange(e, null, "debtorCode")}
            />
          </div>
          <div className="form-group">
            <label>Debtor Name:</label>
            <input
              type="text"
              value={formData.debtorName}
              onChange={(e) => handleInputChange(e, null, "debtorName")}
            />
          </div>
          <div className="form-group">
            <label>Member Code:</label>
            <input
              type="text"
              value={formData.memberCode}
              onChange={(e) => handleInputChange(e, null, "memberCode")}
            />
          </div>
          <div className="form-group">
            <label>Debtor Mobile:</label>
            <input
              type="text"
              value={formData.debtorMobile}
              onChange={(e) => handleInputChange(e, null, "debtorMobile")}
            />
          </div>
          <div className="form-group">
            <label>Debtor Address:</label>
            <input
              type="text"
              value={formData.debtorAddress}
              onChange={(e) => handleInputChange(e, null, "debtorAddress")}
            />
          </div>
          <div className="form-group">
            <label>TIN:</label>
            <input
              type="text"
              value={formData.tin}
              readOnly
              />
          </div>
          <div className="form-group">
            <label>Currency Code:</label>
            <select
              value={formData.currencyCode}
              onChange={(e) => handleInputChange(e, null, "currencyCode")}
            >
              <option value="">Select Currency Code</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="MYR">MYR</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pick Up Location ID:</label>
            <select
              value={formData.pickUpLocationId}
              onChange={(e) => handleInputChange(e, null, "pickUpLocationId")}
            >
              <option value="">Select Location</option>
              <option value="L001">L001</option>
              <option value="L002">L002</option>
              <option value="L003">L003</option>
            </select>
          </div>
        </div>
      </div>

      {/* Second Section: Eye Power Record */}
      <div className="section">
        <h3>Eye Power Record</h3>
        <h4>Glasses Profile</h4>
        <div className="popup-form">
        {[
          "Right Eye SPH",
          "Right Eye CYL",
          "Right Eye AXIS",
          "Left Eye SPH",
          "Left Eye CYL",
          "Left Eye AXIS",
        ].map((label) => (
          <div className="form-group" key={label}>
            <label>{label}:</label>
            <input
              type="text"
              value={formData.glassesProfile[label]}
              onChange={(e) => handleInputChange(e, "glassesProfile", label)}
            />
          </div>
        ))}
        </div>
        <h4>Contact Lens Profile</h4>
        <div className="popup-form">
        {[
          "Right Eye SPH",
          "Right Eye CYL",
          "Right Eye AXIS",
          "Left Eye SPH",
          "Left Eye CYL",
          "Left Eye AXIS",
        ].map((label) => (
          <div className="form-group" key={label}>
            <label>{label}:</label>
            <input
              type="text"
              value={formData.contactLensProfile[label]}
              onChange={(e) => handleInputChange(e, "contactLensProfile", label)}
            />
          </div>
        ))}
        </div>
      </div>

      {/* Third Section: Items */}
      <div className="section">
        <h3>Items</h3>
        <div className="popup-form">
          <div className="form-group">
            <label>Item Code:</label>
            <input
              type="text"
              value={item.itemCode}
              onChange={handleItemCodeChange}
            />
          </div>
          <div className="form-group">
            <label>Item Name:</label>
            <input
              type="text"
              value={item.itemName}
              onChange={(e) => setItem((prev) => ({ ...prev, itemName: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Batch No:</label>
            <input
              type="text"
              value={item.batchNo}
              onChange={(e) => setItem((prev) => ({ ...prev, batchNo: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Item Description:</label>
            <input
              type="text"
              value={item.itemDescription}
              onChange={(e) => setItem((prev) => ({ ...prev, itemDescription: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Item Unit Price:</label>
            <input
              type="number"
              value={item.itemUnitPrice}
              onChange={(e) => setItem((prev) => ({ ...prev, itemUnitPrice: parseFloat(e.target.value) }))}
            />
          </div>
          <div className="form-group">
            <label>Item Quantity:</label>
            <input
              type="number"
              value={item.itemQuantity}
              onChange={(e) => setItem((prev) => ({ ...prev, itemQuantity: parseInt(e.target.value, 10) }))}
            />
          </div>
          <button className="add-cash-button" onClick={handleAddItem}>Add Item</button>
        </div>

        {/* Items Table */}
        <div className="transaction-table">
          <table>
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Item Description</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Amount ({formData.currencyCode})</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((i, index) => (
                <tr key={index}>
                  <td>{i.itemCode}</td>
                  <td>{i.itemName}</td>
                  <td>{i.itemDescription}</td>
                  <td>{i.itemUnitPrice.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      value={i.itemQuantity}
                      onChange={(e) => {
                        const updatedItems = [...formData.items];
                        updatedItems[index].itemQuantity = parseInt(e.target.value, 10);
                        setFormData((prev) => ({ ...prev, items: updatedItems }));
                      }}
                      style={{ width: "60px" }}
                    />
                  </td>
                  <td>{(i.itemUnitPrice * i.itemQuantity).toFixed(2)}</td>
                  <td>
                    <button
                      className="edit-button"
                      onClick={() => {
                        const editedItem = formData.items[index];
                        setItem({ ...editedItem });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        const updatedItems = formData.items.filter((_, idx) => idx !== index);
                        setFormData((prev) => ({ ...prev, items: updatedItems }));
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {formData.items.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No items added
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" style={{ textAlign: "right" }}>
                  <strong>Total Amount:</strong>
                </td>
                <td colSpan="2">
                  <strong>{calculateTotalAmount().toFixed(2)} {formData.currencyCode}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Fourth Section: Payments */}
      <div className="section">
        <h3>Payments</h3>
        <div className="popup-form">
          {/* Payment Method 1 */}
          <div className="form-group">
            <label>Payment Method 1:</label>
            <select
              value={formData.payments[0]?.method || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payments: [
                    { method: e.target.value, amount: prev.payments[0]?.amount || "" },
                    ...(prev.payments.slice(1) || []),
                  ],
                }))
              }
              required
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="e-Wallet">e-Wallet</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount 1:</label>
            <input
              type="number"
              value={formData.payments[0]?.amount || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payments: [
                    { method: prev.payments[0]?.method || "", amount: e.target.value },
                    ...(prev.payments.slice(1) || []),
                  ],
                }))
              }
              required
            />
          </div>

          {/* Payment Method 2 */}
          <div className="form-group">
            <label>Payment Method 2 (Optional):</label>
            <select
              value={formData.payments[1]?.method || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payments: [
                    ...(prev.payments.slice(0, 1) || []),
                    { method: e.target.value, amount: prev.payments[1]?.amount || "" },
                  ],
                }))
              }
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Credit/Debit Card">Credit/Debit Card</option>
              <option value="e-Wallet">e-Wallet</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
          <div className="form-group">
            <label>Amount 2 (Optional):</label>
            <input
              type="number"
              value={formData.payments[1]?.amount || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  payments: [
                    ...(prev.payments.slice(0, 1) || []),
                    { method: prev.payments[1]?.method || "", amount: e.target.value },
                  ],
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Calculation Section */}
      <div className="section">
        <h3>Summary</h3>
        <p>Total Amount: {calculateTotalAmount().toFixed(2)}</p>
        <p>Total Paid: {calculateTotalPaid().toFixed(2)}</p>
        <p>Change: {(calculateTotalPaid() - calculateTotalAmount()).toFixed(2)}</p>
      </div>

      <div className="submit-button-container">
        <button
          className="submit-button"
          onClick={() => setConfirmationModal(true)}
        >
          Submit
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationModal}
        title="Confirm Submission"
        message="Are you sure you want to submit the sales invoice?"
        onConfirm={handleSubmit}
        onCancel={() => setConfirmationModal(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={handleCloseSuccessModal}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={handleCloseErrorModal}
      />
    </div>
  );
};

export default SalesInvoice;
