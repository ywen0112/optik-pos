import React, { useState } from "react";
import "../../css/CrudModal.css";
import "../../css/Transaction.css";
import ErrorModal from "../../modals/ErrorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import SuccessModal from "../../modals/SuccessModal";

const PurchaseInvoice = () => {
  const [formData, setFormData] = useState({
    creditorCode: "",
    companyName: "",
    registrationNumber: "",
    natureOfBusiness: "",
    TIN: "",
    mobile: "",
    fax: "",
    address: "",
    locationId: "",
    items: [],
    payments: [],
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

  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });

   // Mock data for creditors
   const creditorMockData = {
    C001: {
      companyName: "ABC Supplies Ltd.",
      registrationNumber: "12345678",
      natureOfBusiness: "Retail",
      TIN: "TIN1234",
      mobile: "9876543210",
      fax: "123-456789",
      address: "123 Supplier Street",
      locationId: "L001",
      currencyCode: "USD",
    },
    C002: {
      companyName: "XYZ Traders",
      registrationNumber: "98765432",
      natureOfBusiness: "Wholesale",
      TIN: "TIN5678",
      mobile: "1234567890",
      fax: "987-654321",
      address: "456 Trader Avenue",
      locationId: "L002",
      currencyCode: "EUR",
    },
  };

  // Mock data for items
  const itemMockData = {
    I001: {
      itemName: "Widget A",
      batchNo: "B001",
      itemDescription: "High-quality widget",
      unitPrices: {
        USD: 50.0,
        EUR: 45.0,
      },
    },
    I002: {
      itemName: "Gadget B",
      batchNo: "B002",
      itemDescription: "Premium gadget",
      unitPrices: {
        USD: 75.0,
        EUR: 70.0,
      },
    },
  };

  const handleInputChange = (e, key) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [key]: value }));

    // Auto-populate creditor details when creditorCode is entered
    if (key === "creditorCode" && creditorMockData[value]) {
      const creditor = creditorMockData[value];
      setFormData((prev) => ({
        ...prev,
        ...creditor,
      }));
    }
  };

  const handleItemCodeChange = (e) => {
    const value = e.target.value;
    setItem((prev) => ({ ...prev, itemCode: value }));

    // Auto-populate item details when itemCode is entered
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
    return formData.payments.reduce((total, payment) => total + parseFloat(payment.amount || 0), 0);
  };

  const handleSubmit = () => {
    setConfirmationModal(true);
  };

  const handleConfirmSubmit = () => {
    setConfirmationModal(false);
    // Simulate submission success
    setTimeout(() => {
      setSuccessModal({ isOpen: true, title: "Submission Successful", message: "The purchase invoice has been submitted successfully!" });
    }, 500);
  };

  const handleCloseErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const handleCloseSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="purchase-invoice-container">
      <h2>Purchase Invoice</h2>

      {/* First Section: Info */}
      <div className="section">
        <h3>Info</h3>
        <div className="popup-form">
          <div className="form-group">
            <label>Creditor Code:</label>
            <input type="text" value={formData.creditorCode} onChange={(e) => handleInputChange(e, "creditorCode")} />
          </div>
          <div className="form-group">
            <label>Company Name:</label>
            <input type="text" value={formData.companyName} onChange={(e) => handleInputChange(e, "companyName")} />
          </div>
          <div className="form-group">
            <label>Registration Number:</label>
            <input type="text" value={formData.registrationNumber} onChange={(e) => handleInputChange(e, "registrationNumber")} />
          </div>
          <div className="form-group">
            <label>Nature of Business:</label>
            <input type="text" value={formData.natureOfBusiness} onChange={(e) => handleInputChange(e, "natureOfBusiness")} />
          </div>
          <div className="form-group">
            <label>TIN:</label>
            <input type="text" value={formData.TIN} onChange={(e) => handleInputChange(e, "TIN")} />
          </div>
          <div className="form-group">
            <label>Mobile:</label>
            <input type="text" value={formData.mobile} onChange={(e) => handleInputChange(e, "mobile")} />
          </div>
          <div className="form-group">
            <label>Fax:</label>
            <input type="text" value={formData.fax} onChange={(e) => handleInputChange(e, "fax")} />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input type="text" value={formData.address} onChange={(e) => handleInputChange(e, "address")} />
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
            <label>Location ID:</label>
            <input type="text" value={formData.locationId} onChange={(e) => handleInputChange(e, "locationId")} />
          </div>
        </div>
      </div>

      {/* Second Section: Items */}
      <div className="section">
        <h3>Items</h3>
        <div className="popup-form">
          <div className="form-group">
            <label>Item Code:</label>
            <input type="text" value={item.itemCode} onChange={handleItemCodeChange} />
          </div>
          <div className="form-group">
            <label>Item Name:</label>
            <input type="text" value={item.itemName} onChange={(e) => setItem((prev) => ({ ...prev, itemName: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Batch No:</label>
            <input type="text" value={item.batchNo} onChange={(e) => setItem((prev) => ({ ...prev, batchNo: e.target.value }))} />
          </div>
          <div className="form-group">
            <label>Item Description:</label>
            <input type="text" value={item.itemDescription} onChange={(e) => setItem((prev) => ({ ...prev, itemDescription: e.target.value }))} />
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
          <button className="add-cash-button" onClick={handleAddItem}>
            Add Item
          </button>
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
              </tr>
            </thead>
            <tbody>
              {formData.items.map((i, index) => (
                <tr key={index}>
                  <td>{i.itemCode}</td>
                  <td>{i.itemName}</td>
                  <td>{i.itemDescription}</td>
                  <td>{i.itemUnitPrice.toFixed(2)}</td>
                  <td>{i.itemQuantity}</td>
                  <td>{(i.itemUnitPrice * i.itemQuantity).toFixed(2)}</td>
                </tr>
              ))}
              {formData.items.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
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
                <td>
                  <strong>{calculateTotalAmount().toFixed(2)} {formData.currencyCode}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Third Section: Payments */}
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
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </div>

      {/* Modals */}
      <ErrorModal 
        isOpen={errorModal.isOpen} 
        title={errorModal.title} 
        message={errorModal.message} 
        onClose={handleCloseErrorModal} 
        />

      <ConfirmationModal
        isOpen={confirmationModal}
        title="Confirm Submission"
        message="Are you sure you want to submit this purchase invoice?"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmationModal(false)}
        />

      <SuccessModal 
        isOpen={successModal.isOpen} 
        title={successModal.title} 
        message={successModal.message} 
        onClose={handleCloseSuccessModal} 
        />
    </div>
  );
};

export default PurchaseInvoice;
