import React, { useState, useEffect } from "react";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";
import "@fortawesome/fontawesome-free/css/all.min.css";

const CreditNoteModal = ({ isOpen, onClose, onReset }) => {
  const [formData, setFormData] = useState({
    debtorId: "",
    debtorCode: "",
    companyName: "",
    locationId: "",
    agentId: "",
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

  const [agents, setAgents] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const customerId = Number(localStorage.getItem("customerId"));
  const creditNoteId = localStorage.getItem("creditNoteId"); 
  const docNo = localStorage.getItem("docNo");

  useEffect(() => {
    if (isOpen) {
      setFormData({
        debtorId: "",
        debtorCode: "",
        companyName: "",
        locationId: "",
        agentId: "",
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

      fetchDebtors();
      fetchLocations();
      fetchItems();
      fetchAgents();
    }
  }, [isOpen]);

  const fetchAgents = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/GetUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const options = data.data.map((user) => ({
          value: user.userId,
          label: user.userName,
        }));
        setAgents(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch agents.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Agents", message: error.message });
    }
  };

  const handleAgentChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      agentId: selectedOption.value,
    }));
  };

  const fetchDebtors = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Debtor/GetRecords", {
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
        const options = data.data.map((debtor) => ({
          value: debtor.debtorId,
          label: `${debtor.debtorCode}`,
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

  const handleDebtorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      debtorId: selectedOption.value,
      debtorCode: selectedOption.debtorCode,
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
          label: `${item.itemCode} - ${item.description}`,
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
        const defaultUOM = selectedOption.itemUOMs.length === 1 ? selectedOption.itemUOMs[0] : null;

        updatedItems[rowIndex] = {
          ...updatedItems[rowIndex],
          itemId: selectedOption.value,
          itemCode: selectedOption.label,
          description: selectedOption.description,
          desc2: selectedOption.desc2,
          itemUOMId: defaultUOM ? defaultUOM.itemUOMId : "",
          unitPrice: defaultUOM ? defaultUOM.unitPrice : "",
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
            itemBatchId: "",
            subtotal: 0,
          },
        ],
      }));
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

  const handleSubmit = async () => {
    if (!formData.debtorId || formData.items.length === 0) {
      setErrorModal({
        isOpen: true,
        title: "Missing Information",
        message: "Please ensure debtor, and at least one item are selected.",
      });
      return;
    }
  
    const userId = formData.agentId || localStorage.getItem("userId");
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now - offset).toISOString().slice(0, 19);
  
    const payload = {
      actionData: {
        customerId,
        userId,
        id: creditNoteId,
      },
      creditNoteId,
      docNo,
      debtorId: formData.debtorId,
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
      const response = await fetch("https://optikposbackend.absplt.com/CreditNote/Save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.errorMessage === "There is currently no active counter session.") {
            onReset(data);
        }
        return;
      }
  
      if (response.ok && data.success) {
        setSuccessModal({
          isOpen: true,
          title: "Credit Note Saved",
          message: "The credit note has been successfully saved.",
          creditNoteId: creditNoteId,
        });
  
      } else {
        throw new Error(data.errorMessage || "Failed to save credit note.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Saving Credit Note",
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
        <h2>Credit Note</h2>
        <div className="sales-popup-form">
          <div className="sales-form-row">
            <div className="sales-form-group">
              <label>Debtor Code</label>
              <Select options={debtors} value={debtors.find((debtor) => debtor.value === formData.debtorId) || ""} onChange={handleDebtorChange} isSearchable placeholder="Select Debtor" />
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
            <div className="sales-form-group">
              <label>Agent</label>
              <Select
                options={agents}
                value={agents.find((agent) => agent.value === formData.agentId) ||
                  agents.find((agent) => agent.value === localStorage.getItem("userId")) ||
                  ""}
                onChange={handleAgentChange}
                isSearchable
                placeholder="Select Agent"
              />
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
                    <Select options={items} value={items.find((option) => option.value === itm.itemId) || null} onChange={(selectedOption) => handleItemChange(selectedOption, index)} isSearchable placeholder="Select Item" />
                  </td>
                  <td>
                    <input type="text" 
                      value={itm.description}
                      onChange={(e) => handleDescriptionChange(e, index)}
                    />
                  </td>
                  <td>
                    <Select 
                      options={itm.availableUOMs || []}
                      value={itm.availableUOMs?.find((uom) => uom.value === itm.itemUOMId) || null} 
                      onChange={(selectedOption) => handleUOMChange(selectedOption, index)}
                      isSearchable 
                      placeholder="Select UOM" 
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
                  />
                  </td>
                  <td className="readonly-field">
                    <input type="number" value={itm.subtotal.toFixed(2)} readOnly />
                  </td>                
                  </tr>
              ))}
            </tbody>
           </table>
           <button className="modal-add-item-button" onClick={handleAddItem}>Add Item</button>
        </div>
        <div className="sales-popup-form">
          <p><strong>Total: </strong>{formData.total.toFixed(2)}</p>
        </div>

          <div className="transaction-modal-buttons">
            <button className="modal-add-button" onClick={handleSubmit}>Save</button>
            <button className="modal-close-button" onClick={onClose}>Close</button>
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

  export default CreditNoteModal;
