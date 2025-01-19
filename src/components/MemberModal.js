import React, { useState, useEffect } from "react";
import "../css/CrudModal.css";
import ErrorModal from "./ErrorModal";

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

  // Mock member points data
  const mockPoints = {
    Alice: { MT001: 500, MT002: 300, MT003: 100 },
    Bob: { MT001: 700, MT002: 400, MT003: 200 },
    John: { MT001: 600, MT002: 350, MT003: 150 },
  };

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

  const fetchMemberPoints = () => {
    const { memberName, memberTypeId } = data;

    if (!memberName || !memberTypeId) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        memberName: !memberName ? "Member Name is required." : "",
        memberTypeId: !memberTypeId ? "Member Type ID is required." : "",
      }));
      return;
    }

    const points = mockPoints[memberName]?.[memberTypeId] || 0;

    onInputChange({
      target: {
        name: "memberPoint",
        value: points,
      },
    });
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
            .filter((field) => field.name !== "memberPoint") // Exclude memberPoint from regular fields
            .map((field) => (
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

          {/* Single Member Point Field */}
          <div className="form-group">
            <label>
              Member Point <span className="required">*</span>
            </label>
            <div className="member-point-container">
              <input
                type="text"
                name="memberPoint"
                value={data.memberPoint || ""}
                readOnly
              />
              {!isViewing && (
                <button
                  type="button"
                  className="fetch-points-button"
                  onClick={fetchMemberPoints}
                >
                  Fetch Points
                </button>
              )}
            </div>
            {errors.memberPoint && (
              <p className="error-message">{errors.memberPoint}</p>
            )}
          </div>
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
