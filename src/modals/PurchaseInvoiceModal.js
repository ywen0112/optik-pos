import React, { useState, useEffect } from "react";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PurchasePaymentModal from "./PurchasePaymentModal";
import Select from "react-select";
import "@fortawesome/fontawesome-free/css/all.min.css";

const PurchaseInvoiceModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    creditorId: "",
    creditorCode: "",
    companyName: "",
    locationId: "",
    items: [{
      itemId: "",
      itemCode: "",
      description: "",
      desc2: "",
      itemUOMId: "",
      unitPrice: "",
      qty: 0,
      discount: "percentage", 
      discountAmount: 0,
      itemBatchId: "",
      subtotal: 0,
    }],
    payments: [],
    total: 0,
  });

  const [item, setItem] = useState({
    itemId: "",
    itemCode: "",
    description: "",
    desc2: "",
    itemUOMId: "",
    unitPrice: "",
    qty: 0,
    discount: "percentage",
    discountAmount: 0,
    itemBatchId: "",
    subtotal: 0,
  });

  const [creditors, setCreditors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, type: "" });
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        creditorId: "",
        creditorCode: "",
        companyName: "",
        locationId: "",
        items: [{
          itemId: "",
          itemCode: "",
          description: "",
          desc2: "",
          itemUOMId: "",
          unitPrice: "",
          qty: 0,
          discount: "percentage", 
          discountAmount: 0,
          itemBatchId: "",
          subtotal: 0,
        }],
        payments: [],
        total: 0,
      });
      setItem({
        itemId: "",
        itemCode: "",
        description: "",
        desc2: "",
        itemUOMId: "",
        unitPrice: "",
        qty: 0,
        discount: "percentage",
        discountAmount: 0, 
        itemBatchId: "",
        subtotal: 0,   
      });

      setIsPaymentConfirmed(false); 

      fetchCreditors();
      fetchLocations();
      fetchItems();
    }
  }, [isOpen]);

  const fetchCreditors = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Creditor/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const options = data.data.map((creditor) => ({
          value: creditor.creditorId,
          label: `${creditor.creditorCode}`,
          creditorCode: creditor.creditorCode,
          companyName: creditor.companyName,
        }));
        setCreditors(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch creditors.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Creditors", message: error.message });
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const options = data.data.map((location) => ({
          value: location.locationId,
          label: location.locationCode,
        }));
        setLocations(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch locations.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Locations", message: error.message });
    }
  };

  const handleCreditorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      creditorId: selectedOption.value,
      creditorCode: selectedOption.creditorCode,
      companyName: selectedOption.companyName,
    }));
    
  };

  const handleLocationChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      locationId: selectedOption.value,
    }));
  };

  const fetchItems = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Item/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const options = data.data.map((item) => ({
          value: item.itemId,
          label: item.itemCode,
          description: item.description,
          desc2: item.desc2,
          itemUOMs: item.itemUOMs,
        }));
        setItems(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch items.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Items", message: error.message });
    }
  };

  const handleItemChange = (selectedOption, rowIndex) => {
      setFormData((prev) => {
        const updatedItems = [...prev.items];
    
        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          itemId: selectedOption.value,
          itemCode: selectedOption.label,
          description: selectedOption.description,
          desc2: selectedOption.desc2,
          itemUOMId: "",
          unitPrice: "",
          subtotal: 0, 
          availableUOMs: selectedOption.itemUOMs.map(uom => ({ 
            value: uom.itemUOMId,
            label: uom.uom,
            unitPrice: uom.unitPrice,
          })),
        };
    
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        
        return { ...prev, items: updatedItems, total: newTotal };
      });
    };
    
    const handleDescriptionChange = (event, rowIndex) => {
      const { value } = event.target;
    
      setFormData((prev) => {
        const updatedItems = [...prev.items];
    
        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          description: value,
        };
    
        return { ...prev, items: updatedItems };
      });
    };

    const handleUOMChange = (selectedOption, rowIndex) => {
      setFormData((prev) => {
        const updatedItems = [...prev.items];
    
        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          itemUOMId: selectedOption.value,
          unitPrice: selectedOption.unitPrice,
          subtotal: (selectedOption.unitPrice * updatedItems[rowIndex].qty) - (updatedItems[rowIndex].discountAmount || 0),
        };
    
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    
        return { ...prev, items: updatedItems, total: newTotal };
      });
    };
    
    const handleQuantityChange = (e, rowIndex) => {
      let newQty = parseInt(e.target.value);
  
      if (isNaN(newQty)) {
        newQty = 0;
      }
    
      setFormData((prev) => {
        const updatedItems = [...prev.items];
    
        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          qty: newQty,
          subtotal: (updatedItems[rowIndex].unitPrice || 0) * newQty - (updatedItems[rowIndex].discountAmount || 0),
        };
    
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    
        return { ...prev, items: updatedItems, total: newTotal };
      });
    };
  
    const handleDiscountTypeChange = (selectedOption, rowIndex) => {
      setFormData((prev) => {
        const updatedItems = [...prev.items];
        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          discount: selectedOption.value, 
          discountAmount: 0, 
        };
    
        return { ...prev, items: updatedItems };
      });
    };
  
  
    const handleDiscountAmountChange = (e, rowIndex) => {
      let discountValue = e.target.value.trim(); 

      if (isNaN(discountValue)) {
        discountValue = 0;
      }
    
      setFormData((prev) => {
        const updatedItems = prev.items.map((item, index) => {
          if (index === rowIndex) {
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const qty = parseInt(item.qty, 10) || 0;
            let finalDiscountAmount = 0;
            let subtotal = unitPrice * qty;
    
            if (item.discount === "percentage") {
              finalDiscountAmount = (subtotal * discountValue) / 100; 
            } else {
              finalDiscountAmount = discountValue; 
            }
    
            return {
              ...item,
              discountAmount: discountValue, 
              subtotal: subtotal - finalDiscountAmount, 
            };
          }
          return item;
        });
    
        return { ...prev, items: updatedItems, total: updatedItems.reduce((sum, item) => sum + item.subtotal, 0) };
      });
    };  
  
    useEffect(() => {
      setItem((prev) => ({
        ...prev,
        subtotal: (prev.unitPrice * prev.qty) - prev.discountAmount,
      }));
    }, [item.unitPrice, item.qty, item.discountAmount]);
  
    const handleAddItem = () => {
      const lastItem = formData.items[formData.items.length - 1];
    
      if (!lastItem.itemId || lastItem.qty < 0 || lastItem.unitPrice < 0) {
        setErrorModal({
          isOpen: true,
          title: "Incomplete Item",
          message: "Please fill in all required fields before adding a new item.",
        });
        return;
      }
    
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items, 
          {
            itemId: "",
            itemCode: "",
            description: "",
            desc2: "",
            itemUOMId: "",
            unitPrice: "",
            qty: 0,
            discount: "percentage",
            discountAmount: 0,
            subtotal: 0,
          },
        ],
      }));
      setIsPaymentConfirmed(false);
    };  
  
    useEffect(() => {
      if (isOpen) {
        setFormData((prev) => ({
          ...prev,
          payments: [],
          total: prev.items.reduce((sum, item) => sum + item.subtotal, 0),
        }));
      }
    }, [isOpen]);


  const handleOpenPaymentModal = (type) => {
    if (!isPaymentConfirmed) {
      setPaymentModal({ isOpen: true, type });
    }
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({ isOpen: false, type: "" });
  };

  const handleSubmitPayment = (payments, outstandingBalance, changes) => {
    setFormData((prev) => ({
      ...prev,
      payments,
      outstandingBalance,
      changes,
    }));
  
    setIsPaymentConfirmed(true);
    setPaymentModal({ isOpen: false, type: "" });
  };

  const totalPaid = formData.payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalance = formData.total > totalPaid ? formData.total - totalPaid : 0;
  const changes = totalPaid > formData.total ? totalPaid - formData.total : 0;

  const handleSubmit = async () => {
    if (!formData.creditorId || formData.items.length === 0) {
      setErrorModal({
        isOpen: true,
        title: "Missing Information",
        message: "Please ensure creditor, and at least one item are selected.",
      });
      return;
    }
  
    const customerId = Number(localStorage.getItem("customerId"));
    const userId = localStorage.getItem("userId");
    const purchaseId = localStorage.getItem("purchaseId");
    const counterSessionId = localStorage.getItem("counterSessionId");
    const docNo = localStorage.getItem("docNo");
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000; // Convert minutes to milliseconds
    const localISOTime = new Date(now - offset).toISOString().slice(0, 19);

  
    const payload = {
      actionData: {
        customerId,
        userId,
        id: purchaseId,
      },
      purchaseId,
      docNo,
      counterSessionId,
      creditorId: formData.creditorId,
      docDate: localISOTime,
      locationId: formData.locationId,
      remark: "",
      total: formData.total,
      details: formData.items.map(item => ({
        itemId: item.itemId,
        itemUOMId: item.itemUOMId,
        description: item.description,
        desc2: item.desc2,
        itemBatchId: "", 
        qty: item.qty,
        unitPrice: item.unitPrice,
        discount: item.discount,
        discountAmount: item.discountAmount,
        subTotal: item.subtotal,
      })),
    };
  
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Purchases/Save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      console.log("Purchase Save Response:", data);
  
      if (response.ok && data.success) {
        setSuccessModal({
          isOpen: true,
          title: "Purchase Invoice Saved",
          message: "The purchase invoice has been successfully saved.",
          purchaseId: purchaseId,
        });
  
        setIsPaymentConfirmed(true);
      } else {
        throw new Error(data.errorMessage || "Failed to save purchase invoice.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Saving Purchase Invoice",
        message: error.message,
      });
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="sales-modal-overlay">
      <div className="sales-modal-content">
        <h2>Purchase Invoice</h2>
        <div className="sales-popup-form">
          <div className="sales-form-row">
            <div className="sales-form-group">
              <label>Creditor Code</label>
              <Select options={creditors} value={creditors.find((creditor) => creditor.value === formData.creditorId) || ""} onChange={handleCreditorChange} isSearchable placeholder="Select Creditor" />
            </div>
            <div className="sales-form-group">
              <label>Company Name</label>
              <input type="text" value={formData.companyName} 
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                />
            </div>
            <div className="sales-form-group">
              <label>Location Code</label>
              <Select options={locations} value={locations.find((location) => location.value === formData.locationId) || ""} onChange={handleLocationChange} isSearchable placeholder="Select Location" />
            </div>
          </div>
        
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>UOM</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Discount</th>
                <th>Discount Amount</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
            {formData.items.map((itm, index) => (
                <tr key={index}>
                  <td>
                    <Select options={items} value={items.find((option) => option.value === itm.itemId) || null} onChange={(selectedOption) => handleItemChange(selectedOption, index)} isSearchable placeholder="Select Item" isDisabled={isPaymentConfirmed} />
                  </td>
                  <td>
                    <input type="text" 
                      value={itm.description} 
                      onChange={(e) => handleDescriptionChange(e, index)}
                      disabled={isPaymentConfirmed}
                    />
                  </td>
                  <td>
                    <Select 
                      options={itm.availableUOMs || []}
                      value={itm.availableUOMs?.find((uom) => uom.value === itm.itemUOMId) || null} 
                      onChange={(selectedOption) => handleUOMChange(selectedOption, index)}
                      isSearchable 
                      placeholder="Select UOM" 
                      isDisabled={isPaymentConfirmed} 
                    />
                  </td>
                  <td className="readonly-field">
                    <input type="number" value={itm.unitPrice} readOnly />
                  </td>
                  <td>
                    <input type="text" 
                      min="0"
                      value={itm.qty} 
                      onChange={(e) => handleQuantityChange(e, index)}
                      disabled={isPaymentConfirmed}  
                    />
                  </td>
                  <td>
                    <Select
                      options={[
                        { value: "percentage", label: "Percentage (%)" },
                        { value: "fixed", label: "Fixed Amount" },
                      ]}
                      value={{ value: itm.discount, label: itm.discount === "percentage" ? "Percentage (%)" : "Fixed Amount" }}
                      onChange={(selectedOption) => handleDiscountTypeChange(selectedOption, index)}
                    />
                  </td>
                  <td>
                  <input
                    type="text"
                    value={itm.discountAmount} 
                    onChange={(e) => handleDiscountAmountChange(e, index)}
                    min="0"
                    disabled={isPaymentConfirmed}
                  />
                  </td>
                  <td className="readonly-field">
                    <input type="number" value={itm.subtotal.toFixed(2)} readOnly />
                  </td>                
                  </tr>
              ))}
            </tbody>
           </table>
           {!isPaymentConfirmed && (
           <button className="modal-add-item-button" onClick={handleAddItem}>Add Item</button>
          )}
          </div>
        <div className="sales-popup-form">
          <p><strong>Total: </strong>{formData.total.toFixed(2)}</p>
          {outstandingBalance > 0 ? (
          <p><strong>Outstanding Balance:</strong> {outstandingBalance.toFixed(2)}</p>
        ) : (
          <p><strong>Changes:</strong> {changes.toFixed(2)}</p>
        )} 
          {formData.payments.length > 0 && formData.payments.map((payment, index) => (
            <p key={index}>
              <strong>{payment.method}:</strong> {payment.amount}
            </p>
          ))}

          {!isPaymentConfirmed && (
            <div className="payment-options">
              <button className="payment-button" onClick={() => handleOpenPaymentModal("Cash")}>
                Cash Payment
              </button>
              <button className="payment-button" onClick={() => handleOpenPaymentModal("Card")}>
                Card Payment
              </button>
              <button className="payment-button" onClick={() => handleOpenPaymentModal("Bank")}>
                Bank Transfer
              </button>
              <button className="payment-button" onClick={() => handleOpenPaymentModal("Multi")}>
                Multipayment
              </button>
            </div>
          )}
        </div>

          <div className="transaction-modal-buttons">
            <button className="modal-add-button" onClick={handleSubmit}>Save</button>
            <button className="modal-close-button" onClick={onClose}>Close</button>

            {paymentModal.isOpen && (
              <PurchasePaymentModal 
                isOpen={paymentModal.isOpen} 
                type={paymentModal.type} 
                total={outstandingBalance} 
                onSubmit={handleSubmitPayment} 
                onClose={handleClosePaymentModal} 
              />
            )}
          </div>
          <ConfirmationModal isOpen={confirmationModal} onConfirm={handleSubmit} onCancel={() => setConfirmationModal(false)} />
          <SuccessModal 
              isOpen={successModal.isOpen} 
              title={successModal.title} 
              message={successModal.message} 
              onClose={handleSuccessModalClose} 
            />         
            <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ isOpen: false })} />
          </div>
      </div>
    );
  };

  export default PurchaseInvoiceModal;
