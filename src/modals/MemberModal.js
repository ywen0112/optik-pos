import React, { useState, useEffect } from "react";
import "../css/CrudModal.css";
import ErrorModal from "./ErrorModal";

const MemberModal = ({
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
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });

  const mockPoints = {
    USD: {
      Alice: { MT001: 500, MT002: 300, MT003: 100 },
      Bob: { MT001: 700, MT002: 400, MT003: 200 },
      John: { MT001: 600, MT002: 350, MT003: 150 },
    },
    EUR: {
      Alice: { MT001: 250, MT002: 150, MT003: 75 },
      Bob: { MT001: 350, MT002: 200, MT003: 100 },
      John: { MT001: 300, MT002: 175, MT003: 90 },
    },
  };

  useEffect(() => {
    setErrors({});
    calculateMemberPoints();
  }, [isOpen, data.memberName, data.memberTypeId, data.currencyCode]);

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

  const calculateMemberPoints = () => {
    const { memberName, memberTypeId, currencyCode } = data;

    if (memberName && memberTypeId && currencyCode) {
      const points =
        mockPoints[currencyCode]?.[memberName]?.[memberTypeId] || 0;
      onInputChange({
        target: {
          name: "memberPoint",
          value: points,
        },
      });
    } else {
      onInputChange({
        target: {
          name: "memberPoint",
          value: "",
        },
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
          {fields
            .map((field) => (
              <div className="form-group" key={field.name}>
                <label>
                  {field.label} 
                </label>
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

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
    </div>
  );
};

export default MemberModal;
