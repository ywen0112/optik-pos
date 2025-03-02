import React, { useState, useEffect } from "react";
import "../css/Transaction.css";
import ErrorModal from "./ErrorModal";
import SuccessModal from "./SuccessModal";
import ConfirmationModal from "./ConfirmationModal";
import PaymentModal from "./PaymentModal"
import Select from "react-select";
import "@fortawesome/fontawesome-free/css/all.min.css";

const SalesInvoiceModal = ({ isOpen, onClose, onReset }) => {
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

  const [agents, setAgents] = useState([]);
  const [debtors, setDebtors] = useState([]);
  const [locations, setLocations] = useState([]);
  const [items, setItems] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, type: "" });
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [previousEyeRecord, setPreviousEyeRecord] = useState(null);
  const [eyePowerData, setEyePowerData] = useState(null);

  const customerId = Number(localStorage.getItem("customerId"));
  const salesId = localStorage.getItem("salesId"); 
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
      setPreviousEyeRecord(null);
      setPaymentModal({ isOpen: false, type: ""})

      fetchDebtors();
      fetchLocations();
      fetchItems();
      fetchAgents();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const fetchNewEyePower = async () => {
        try {
          const userId = localStorage.getItem("userId");
          const response = await fetch("https://optikposbackend.absplt.com/EyePower/New", {
            method: "POST",
            headers: { "accept": "text/plain", "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: customerId,
              userId: userId,
              id: ""
            }),
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setEyePowerData(data.data);
          } else {
            throw new Error(data.errorMessage || "Failed to fetch new eye power data.");
          }
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error Fetching New Eye Power.", message: error.message });
        }
      };
      fetchNewEyePower();
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
          customerId: customerId,
          keyword: "",
          offset: 0,
          limit: 9999,
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

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
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
        const options = data.data.map((location) => ({
          value: location.locationId,
          label: `${location.locationCode} - ${location.description}`,
        }));
        setLocations(options);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch locations.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Locations", message: error.message });
    }
  };

  const fetchEyeRecord = async (debtorId) => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("https://optikposbackend.absplt.com/EyePower/GetDebtorPreviousEyeProfile", {
        method: "POST",
        headers: { "accept": "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customerId,
          userId: userId,
          id: debtorId,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPreviousEyeRecord(data.data);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch previous eye record.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Eye Record", message: error.message });
    }
  };

  const handleDebtorChange = (selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      debtorId: selectedOption.value,
      debtorCode: selectedOption.debtorCode,
      companyName: selectedOption.companyName,
    }));
    if (selectedOption.value) {
      fetchEyeRecord(selectedOption.value);
    }
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
          customerId: customerId,
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
          itemBatchId: "",
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

  const handleSaveEyePower = async () => {
    const userId = formData.agentId || localStorage.getItem("userId");
    const payload = {
      actionData: {
        customerId: customerId,
        userId: userId,
        id: eyePowerData.eyePowerId 
      },
      eyePowerId: eyePowerData.eyePowerId, 
      debtorId: formData.debtorId,
      salesId: salesId,
      opticalHeight: eyePowerData?.opticalHeight,
      segmentHeight: eyePowerData?.segmentHeight,
      lensProfile: {
        lens_R_SPH: eyePowerData.lensProfile?.lens_R_SPH ,
        lens_R_CYL: eyePowerData.lensProfile?.lens_R_CYL ,
        lens_R_AXIS: eyePowerData.lensProfile?.lens_R_AXIS ,
        lens_R_BC: eyePowerData.lensProfile?.lens_R_BC ,
        lens_R_DIA: eyePowerData.lensProfile?.lens_R_DIA ,
        lens_R_K_READING: eyePowerData.lensProfile?.lens_R_K_READING ,
        lens_L_SPH: eyePowerData.lensProfile?.lens_L_SPH ,
        lens_L_CYL: eyePowerData.lensProfile?.lens_L_CYL ,
        lens_L_AXIS: eyePowerData.lensProfile?.lens_L_AXIS ,
        lens_L_BC: eyePowerData.lensProfile?.lens_L_BC ,
        lens_L_DIA: eyePowerData.lensProfile?.lens_L_DIA ,
        lens_L_K_READING: eyePowerData.lensProfile?.lens_L_K_READING ,
      },

      latestGlassProfile: {
        latest_Glass_R_SPH: eyePowerData.latestGlassProfile?.latest_Glass_R_SPH ,
        latest_Glass_R_CYL: eyePowerData.latestGlassProfile?.latest_Glass_R_CYL ,
        latest_Glass_R_AXIS: eyePowerData.latestGlassProfile?.latest_Glass_R_AXIS ,
        latest_Glass_R_PRISM: eyePowerData.latestGlassProfile?.latest_Glass_R_PRISM ,
        latest_Glass_R_VA: eyePowerData.latestGlassProfile?.latest_Glass_R_VA ,
        latest_Glass_R_ADD: eyePowerData.latestGlassProfile?.latest_Glass_R_ADD ,
        latest_Glass_R_PD: eyePowerData.latestGlassProfile?.latest_Glass_R_PD ,
        latest_Glass_L_SPH: eyePowerData.latestGlassProfile?.latest_Glass_L_SPH ,
        latest_Glass_L_CYL: eyePowerData.latestGlassProfile?.latest_Glass_L_CYL ,
        latest_Glass_L_AXIS: eyePowerData.latestGlassProfile?.latest_Glass_L_AXIS ,
        latest_Glass_L_PRISM: eyePowerData.latestGlassProfile?.latest_Glass_L_PRISM ,
        latest_Glass_L_VA: eyePowerData.latestGlassProfile?.latest_Glass_L_VA ,
        latest_Glass_L_ADD: eyePowerData.latestGlassProfile?.latest_Glass_L_ADD ,
        latest_Glass_L_PD: eyePowerData.latestGlassProfile?.latest_Glass_L_PD ,
      },

      actualGlassProfile: {
        actual_Glass_R_SPH: eyePowerData.actualGlassProfile?.actual_Glass_R_SPH ,
        actual_Glass_R_CYL: eyePowerData.actualGlassProfile?.actual_Glass_R_CYL ,
        actual_Glass_R_AXIS: eyePowerData.actualGlassProfile?.actual_Glass_R_AXIS ,
        actual_Glass_R_PRISM: eyePowerData.actualGlassProfile?.actual_Glass_R_PRISM ,
        actual_Glass_R_VA: eyePowerData.actualGlassProfile?.actual_Glass_R_VA ,
        actual_Glass_R_ADD: eyePowerData.actualGlassProfile?.actual_Glass_R_ADD ,
        actual_Glass_R_PD: eyePowerData.actualGlassProfile?.actual_Glass_R_PD ,
        actual_Glass_L_SPH: eyePowerData.actualGlassProfile?.actual_Glass_L_SPH ,
        actual_Glass_L_CYL: eyePowerData.actualGlassProfile?.actual_Glass_L_CYL ,
        actual_Glass_L_AXIS: eyePowerData.actualGlassProfile?.actual_Glass_L_AXIS ,
        actual_Glass_L_PRISM: eyePowerData.actualGlassProfile?.actual_Glass_L_PRISM ,
        actual_Glass_L_VA: eyePowerData.actualGlassProfile?.actual_Glass_L_VA ,
        actual_Glass_L_ADD: eyePowerData.actualGlassProfile?.actual_Glass_L_ADD ,
        actual_Glass_L_PD: eyePowerData.actualGlassProfile?.actual_Glass_L_PD ,
      },
    };
  
    try {
      const response = await fetch("https://optikposbackend.absplt.com/EyePower/Save", {
        method: "POST",
        headers: { "accept": "text/plain", "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok && data.success) {
      } else {
        throw new Error(data.errorMessage || "Failed to save eye power data.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Saving Eye Power", message: error.message });
    }
  };  

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
          id: salesId,
      },
      salesId,
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
      const response = await fetch("https://optikposbackend.absplt.com/Sales/Save", {
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
            title: "Sales Invoice Saved",
            message: "The sales invoice has been successfully saved.",
            salesId: salesId,
        });

      await handleSaveEyePower(); 
      setIsPaymentConfirmed(true);
      } else {
        throw new Error(data.errorMessage || "Failed to save sales invoice.");
      }
    } catch (error) {
        setErrorModal({
            isOpen: true,
            title: "Error Saving Sales Invoice",
            message: error.message,
        });
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch(`https://optikposbackend.absplt.com/Sales/GetSalesReport?SalesId=${salesId}`);
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
        link.download = `SalesReport_${docNo}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        throw new Error(data.errorMessage || "Failed to export the report.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Export Report Error",
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
        <h2>Sales Invoice</h2>
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
                value={agents.find((agent) => agent.value === formData.agentId) || ""}
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
        
        <div className="previous-eye-record-section">
        <strong>Previous Eye Record</strong>
        {previousEyeRecord ? (
          <table className="eye-record-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>PRISM</th>
                <th>VA</th>
                <th>ADD</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Right</td>
                <td>{previousEyeRecord.r_SPH !== null ? previousEyeRecord.r_SPH : "-"}</td>
                <td>{previousEyeRecord.r_CYL !== null ? previousEyeRecord.r_CYL : "-"}</td>
                <td>{previousEyeRecord.r_AXIS !== null ? previousEyeRecord.r_AXIS : "-"}</td>
                <td>{previousEyeRecord.r_PRISM !== null ? previousEyeRecord.r_PRISM : "-"}</td>
                <td>{previousEyeRecord.r_VA !== null ? previousEyeRecord.r_VA : "-"}</td>
                <td>{previousEyeRecord.r_ADD !== null ? previousEyeRecord.r_ADD : "-"}</td>
                <td>{previousEyeRecord.r_PD !== null ? previousEyeRecord.r_PD : "-"}</td>
              </tr>
              <tr>
                <td>Left</td>
                <td>{previousEyeRecord.l_SPH !== null ? previousEyeRecord.l_SPH : "-"}</td>
                <td>{previousEyeRecord.l_CYL !== null ? previousEyeRecord.l_CYL : "-"}</td>
                <td>{previousEyeRecord.l_AXIS !== null ? previousEyeRecord.l_AXIS : "-"}</td>
                <td>{previousEyeRecord.l_PRISM !== null ? previousEyeRecord.l_PRISM : "-"}</td>
                <td>{previousEyeRecord.l_VA !== null ? previousEyeRecord.l_VA : "-"}</td>
                <td>{previousEyeRecord.l_ADD !== null ? previousEyeRecord.l_ADD : "-"}</td>
                <td>{previousEyeRecord.l_PD !== null ? previousEyeRecord.l_PD : "-"}</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <p>No previous eye record found.</p>
        )}
      </div>

      <strong>Eye Power Data</strong>
      <table className="eye-record-table">
        <tbody>
          <tr>
            <td className="height-label">Optical Height</td>
            <td>
              <input
                type="number"
                value={eyePowerData?.opticalHeight || ""}
                onChange={(e) =>
                  setEyePowerData({ ...eyePowerData, opticalHeight: e.target.value })
                }
              />
            </td>
            <td className="height-label">Segment Height</td>
            <td>
              <input
                type="number"
                value={eyePowerData?.segmentHeight || ""}
                onChange={(e) =>
                  setEyePowerData({ ...eyePowerData, segmentHeight: e.target.value })
                }
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="eye-power-input-section">
      {eyePowerData && (
        <>
          <strong>Lens Profile</strong>
          <table className="eye-record-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>BC</th>
                <th>DIA</th>
                <th>K_READING</th>
              </tr>
            </thead>
            <tbody>
              {["R", "L"].map((side) => (
                <tr key={side}>
                  <td>{side === "R" ? "Right" : "Left"}</td>
                  {["SPH", "CYL", "AXIS", "BC", "DIA", "K_READING"].map((param) => {
                    const fieldName = `lens_${side}_${param}`; 
                    return (
                      <td key={fieldName}>
                        <input
                          type="number"
                          value={eyePowerData.lensProfile[fieldName]}
                          onChange={(e) =>
                            setEyePowerData({
                              ...eyePowerData,
                              lensProfile: {
                                ...eyePowerData.lensProfile,
                                [fieldName]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <strong>Latest Glass Profile</strong>
          <table className="eye-record-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>PRISM</th>
                <th>VA</th>
                <th>ADD</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              {["R", "L"].map((side) => (
                <tr key={side}>
                  <td>{side === "R" ? "Right" : "Left"}</td>
                  {["SPH", "CYL", "AXIS", "PRISM", "VA", "ADD", "PD"].map((param) => {
                    const fieldName = `latest_Glass_${side}_${param}`;
                    return (
                      <td key={fieldName}>
                        <input
                          type="number"
                          value={eyePowerData.latestGlassProfile[fieldName]}
                          onChange={(e) =>
                            setEyePowerData({
                              ...eyePowerData,
                              latestGlassProfile: {
                                ...eyePowerData.latestGlassProfile,
                                [fieldName]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          <strong>Actual Glass Profile</strong>
          <table className="eye-record-table">
            <thead>
              <tr>
                <th>Parameter</th>
                <th>SPH</th>
                <th>CYL</th>
                <th>AXIS</th>
                <th>PRISM</th>
                <th>VA</th>
                <th>ADD</th>
                <th>PD</th>
              </tr>
            </thead>
            <tbody>
              {["R", "L"].map((side) => (
                <tr key={side}>
                  <td>{side === "R" ? "Right" : "Left"}</td>
                  {["SPH", "CYL", "AXIS", "PRISM", "VA", "ADD", "PD"].map((param) => {
                    const fieldName = `actual_Glass_${side}_${param}`;
                    return (
                      <td key={fieldName}>
                        <input
                          type="number"
                          value={eyePowerData.actualGlassProfile[fieldName]}
                          onChange={(e) =>
                            setEyePowerData({
                              ...eyePowerData,
                              actualGlassProfile: {
                                ...eyePowerData.actualGlassProfile,
                                [fieldName]: e.target.value,
                              },
                            })
                          }
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </>
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
        <PaymentModal 
          isOpen={paymentModal.isOpen} 
          type={paymentModal.type} 
          total={outstandingBalance} 
          onSubmit={handleSubmitPayment} 
          onClose={() => setPaymentModal({ isOpen: false, type: "" })} 
          onReset={onReset}
        />
      )}
    </div>

      <ConfirmationModal isOpen={confirmationModal} onConfirm={handleSubmit} onCancel={() => setConfirmationModal(false)} />
      <SuccessModal isOpen={successModal.isOpen} title={successModal.title} message={successModal.message} onClose={handleSuccessModalClose} onExportReport={handleExportReport} />         
      <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ isOpen: false })} />
      </div>
    </div>
    );
  };

  export default SalesInvoiceModal;
