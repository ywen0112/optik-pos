import React, { useState, useEffect } from "react";
import "../css/CrudModal.css";

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
    }
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
                <select
                  name={field.name}
                  value={data[field.name] || ""}
                  onChange={onInputChange}
                  disabled={isViewing}
                >
                  <option value="" disabled>
                    Select {field.label}
                  </option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
    </div>
  );
};

export default CrudModal;
