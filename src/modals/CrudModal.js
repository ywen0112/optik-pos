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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data[field.name] || "")) {
          validationErrors[field.name] = "Invalid email format.";
        }
      }
    });
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSave = () => {
    if (validateFields()) {
      onSave();
    } else {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
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
                  value={field.options.find((option) => option.value === data[field.name]) || ""}
                  onChange={(selectedOption) =>
                    onInputChange({ target: { name: field.name, value: selectedOption.value } })
                  }
                  options={field.options}
                  isDisabled={isViewing}
                  isSearchable={true} 
                  placeholder={`Select ${field.label}`}
                />
              ) : (
                <input
                  type={field.type || "text"}
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={onInputChange}
                  disabled={isViewing}
                />
              )}
              {errors[field.name] && (
                <p className="error-message">{errors[field.name]}</p>
              )}
            </div>
          ))}
        </div>
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
