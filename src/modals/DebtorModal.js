import React, { useState, useEffect } from "react";
import "../css/DebtorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";

const DebtorModal = ({ isOpen, title, data, onClose, onSave, isViewing, debtorTypeOptions }) => {
  const [sectionData, setSectionData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSectionData({
        ...data,
        medicalIsDiabetes: data.medicalIsDiabetes ?? false,
        medicalIsHypertension: data.medicalIsHypertension ?? false,
        ocularIsSquint: data.ocularIsSquint ?? false,
        ocularIsLazyEye: data.ocularIsLazyEye ?? false,
        ocularHasSurgery: data.ocularHasSurgery ?? false,
      });
      setErrors({});
    }
  }, [isOpen, data]);

  const validateFields = (fields) => {
    const validationErrors = {};
    fields.forEach(({ label, name }) => {
      if (!sectionData[name]) {
        validationErrors[name] = `${label} is required.`;
      }
    });
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSave = () => {
    const fieldsToValidate = [
      { label: "Debtor Code", name: "debtorCode" },
      { label: "Company Name", name: "companyName" },
    ];
  
    const validationErrors = validateFields(fieldsToValidate);
    if (Object.keys(validationErrors).length === 0) {
      onSave({
        ...sectionData,
        medicalIsDiabetes: !!sectionData.medicalIsDiabetes,
        medicalIsHypertension: !!sectionData.medicalIsHypertension,
        ocularIsSquint: !!sectionData.ocularIsSquint,
        ocularIsLazyEye: !!sectionData.ocularIsLazyEye,
        ocularHasSurgery: !!sectionData.ocularHasSurgery,
      });
    } else {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please fill out all required fields highlighted in red.",
      });
    }
  };

  const handleCancelSection = () => {
    const action = () => {
      setSectionData({ ...data });
      setErrors({});
      onClose();
    };
    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setIsConfirmOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="creditor-popup-overlay">
      <div className="creditor-popup-content">
        <h3 className="creditor-modal-title">{title}</h3>
        <div className="creditor-section-content">
          {[
            { label: "Debtor Code", name: "debtorCode" },
            { label: "Company Name", name: "companyName" },
            { label: "Debtor Type Code", name: "debtorTypeId", type: "select", options: debtorTypeOptions },
            { label: "Address 1", name: "address1" },
            { label: "Address 2", name: "address2" },
            { label: "Address 3", name: "address3" },
            { label: "Address 4", name: "address4" },
            { label: "Postcode", name: "postCode" },
            { label: "Phone 1", name: "phone1" },
            { label: "Phone 2", name: "phone2" },
            { label: "Mobile", name: "mobile" },
            { label: "Medical Is Diabetes", name: "medicalIsDiabetes", type: "checkbox" },
            { label: "Medical Is Hypertension", name: "medicalIsHypertension", type: "checkbox" },
            { label: "Ocular Is Squint", name: "ocularIsSquint", type: "checkbox" },
            { label: "Ocular Is Lazy Eye", name: "ocularIsLazyEye", type: "checkbox" },
            { label: "Ocular Has Surgery", name: "ocularHasSurgery", type: "checkbox" },
            { label: "Medical Others", name: "medicalOthers" },
            { label: "Ocular Others", name: "ocularOthers" },
          ].map(({ label, name, type = "text", options }) => (
            <div key={name} className="creditor-form-group">
              <label className="creditor-form-label">{label}</label>
              {type === "select" ? (
                <Select
                  name={name}
                  value={options.find((option) => option.value === sectionData[name]) || ""}
                  onChange={(selectedOption) =>
                    setSectionData({ ...sectionData, [name]: selectedOption.value })
                  }
                  options={options}
                  isDisabled={isViewing}
                  isSearchable={true}
                  placeholder={`Select ${label}`}
                />
              ) : type === "checkbox" ? (
                <input
                  type="checkbox"
                  name={name}
                  checked={!!sectionData[name]}
                  onChange={(e) =>
                    setSectionData({ ...sectionData, [name]: e.target.checked })
                  }
                  disabled={isViewing}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  className="creditor-form-input"
                  value={sectionData[name] || ""}
                  onChange={(e) =>
                    setSectionData({ ...sectionData, [name]: e.target.value })
                  }
                  disabled={isViewing}
                />
              )}
              {errors[name] && <p className="error-message">{errors[name]}</p>}
            </div>
          ))}
        </div>

        <div className="section-buttons">
          {!isViewing && (
            <>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={handleCancelSection}>
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

        {/* Error Modal */}
        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isConfirmOpen}
          title="Confirm Action"
          message="Are you sure you want to cancel and discard unsaved changes?"
          onConfirm={handleConfirmAction}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default DebtorModal;
