import React, { useState, useEffect } from "react";
import "../css/EyePowerModal.css";

const EyePowerModal = ({ isOpen, onClose, eyePowerType, data, onSave, onDelete }) => {
  const [eyePowerData, setEyePowerData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setEyePowerData(data || {});
    }
  }, [isOpen, data]);

  const eyePowerFields = [
    { label: "Right Eye SPH", name: "r_SPH" },
    { label: "Right Eye CYL", name: "r_CYL" },
    { label: "Right Eye AXIS", name: "r_AXIS" },
    { label: "Right Eye PRISM", name: "r_PRISM" },
    { label: "Right Eye BASE", name: "r_BASE" },
    { label: "Right Eye ADD", name: "r_ADD" },
    { label: "Right Eye PD", name: "r_PD" },
    { label: "Left Eye SPH", name: "l_SPH" },
    { label: "Left Eye CYL", name: "l_CYL" },
    { label: "Left Eye AXIS", name: "l_AXIS" },
    { label: "Left Eye PRISM", name: "l_PRISM" },
    { label: "Left Eye BASE", name: "l_BASE" },
    { label: "Left Eye ADD", name: "l_ADD" },
    { label: "Left Eye PD", name: "l_PD" },
  ];

  const handleChange = (e) => {
    setEyePowerData({ ...eyePowerData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(eyePowerData);
  };

  if (!isOpen) return null;

  return (
    <div className="eye-power-modal-overlay">
      <div className="eye-power-modal-content">
        <h3>{eyePowerType} Eye Power</h3>

        <div className="eye-power-fields">
          {eyePowerFields.map(({ label, name }) => (
            <div key={name} className="eye-power-form-group">
              <label className="eye-power-label">{label}</label>
              <input
                className="eye-power-input"
                type="text"
                name={name}
                value={eyePowerData[name] || ""}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>

        <div className="popup-buttons">
          <button className="save-button" onClick={handleSave}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel / Close
          </button>
        </div>

    
      </div>
    </div>
  );
};

export default EyePowerModal;
