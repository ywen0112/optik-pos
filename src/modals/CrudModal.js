import React, { useState, useEffect } from "react";
import "../css/CrudModal.css";
import ErrorModal from "./ErrorModal";
import Select from "react-select";

const CrudModal = ({
  isOpen,
  title,
  fields,
  data,
  onClose,
  onSave,
  onInputChange,
  isViewing,
}) => {
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    setErrors({});
  }, [isOpen]);

  const validateFields = () => {
    const validationErrors = {};
    fields.forEach((field) => {
      if (field.required && !data[field.name]) {
        validationErrors[field.name] = `${field.label} is required.`;
      }
      if (field.type === "email" && field.name === "email") {
        const emailRegex = /^[^\s@]+@[^\s@]+$/;
        if (!emailRegex.test(data[field.name] || "")) {
          validationErrors[field.name] = "Invalid email format.";
        }
      }
    });
  
    if ((title === "Add Item" || title === "Edit Item" || title === "View Item") && data.itemUOMs && data.itemUOMs.length > 0) {
      data.itemUOMs.forEach((uom, index) => {
        if (!uom.uom) validationErrors[`itemUOMs.${index}.uom`] = "UOM is required.";
        if (!uom.unitPrice) validationErrors[`itemUOMs.${index}.unitPrice`] = "Unit Price is required.";
      });
    }
  
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave(data);
    } else {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };

  const handleAddUOM = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Item/NewDetail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
  
      const apiData = await response.json();
  
      if (!response.ok || !apiData.success) {
        throw new Error(apiData.errorMessage || "Failed to create new UOM.");
      }
  
      const newUOM = {
        itemUOMId: apiData.data.itemUOMId, 
        uom: apiData.data.uom || "",
        unitPrice: apiData.data.unitPrice || 0,
        barCode: apiData.data.barCode || "",
      };
  
      onInputChange({
        target: { name: "itemUOMs", value: [...(data.itemUOMs || []), newUOM] },
      });
  
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Adding UOM", message: error.message });
    }
  };
  
  

  const handleRemoveUOM = (index) => {
    const updatedUOMs = [...data.itemUOMs];
    updatedUOMs.splice(index, 1);
    onInputChange({ target: { name: "itemUOMs", value: updatedUOMs } });
  };


  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{title}</h3>
        <div className="popup-form">
        {fields.map((field) => (
          <div className="form-group" key={field.name}>
            <label>{field.label}</label>
            {field.type === "select" ? (
                <Select
                  name={field.name}
                  value={field.options.find((option) => option.value === data[field.name]) || null}
                  onChange={(selectedOption) =>
                    onInputChange({ target: { name: field.name, value: selectedOption.value } })
                  }
                  options={field.options || []}
                  isDisabled={isViewing}
                  isSearchable={true}
                  placeholder={`Select ${field.label}`}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={(e) => onInputChange(e)}
                  disabled={isViewing || (field.name === "userName" && data.userId)}
                  placeholder={`Enter ${field.label}`}
                />
              )}
              {errors[field.name] && <p className="error-message">{errors[field.name]}</p>}
            </div>
          ))}
        </div>

        {(title === "Add Item" || title === "Edit Item" || title === "View Item") && data.itemUOMs && data.itemUOMs.length > 0 && (
            <div className="uom-container">
              <h4>Unit of Measurement (UOM)</h4>
              {data.itemUOMs.map((uom, index) => (
                <div key={index} className="uom-group">
                  <div className="form-group">
                  <label>UOM</label>
                  <input
                    type="text"
                    name={`itemUOMs.${index}.uom`}
                    value={uom.uom || ""}
                    onChange={(e) => onInputChange(e)}
                    disabled={isViewing}
                    placeholder="UOM"
                  />
                  {errors[`itemUOMs.${index}.uom`] && <p className="error-message">{errors[`itemUOMs.${index}.uom`]}</p>}
                  </div>

                  <div className="form-group">
                  <label>Unit Price</label>
                  <input
                    type="number"
                    name={`itemUOMs.${index}.unitPrice`}
                    value={uom.unitPrice || ""}
                    onChange={(e) => onInputChange(e)}
                    disabled={isViewing}
                    placeholder="Unit Price"
                  />
                  {errors[`itemUOMs.${index}.unitPrice`] && <p className="error-message">{errors[`itemUOMs.${index}.unitPrice`]}</p>}
                  </div>

                  <div className="form-group">
                  <label>Barcode</label>
                  <input
                    type="text"
                    name={`itemUOMs.${index}.barCode`}
                    value={uom.barCode || ""}
                    onChange={(e) => onInputChange(e)}
                    disabled={isViewing}
                    placeholder="Barcode"
                  />
                  {errors[`itemUOMs.${index}.barCode`] && <p className="error-message">{errors[`itemUOMs.${index}.barCode`]}</p>}
                  </div>

                  {!isViewing && (
                    <button className="remove-uom-button" onClick={() => handleRemoveUOM(index)}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {(title === "Add Item" || title === "Edit Item" || title === "View Item") && !isViewing && (
            <button className="add-uom-button" onClick={handleAddUOM}>
              + Add UOM
            </button>
          )}

        <div className="popup-buttons">
          {!isViewing && (
            <>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={onClose}>
                Cancel / Close
              </button>
            </>
          )}
          {isViewing && (
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
    </div>
  );
};

export default CrudModal;
