import React, { useState, useEffect } from "react";
import "../css/EyePowerModal.css";

const EyePowerModal = ({ isOpen, onClose, data, onSave }) => {
  const [eyePowerData, setEyePowerData] = useState({});

  useEffect(() => {
    if (isOpen) {
      setEyePowerData(data || {});
    }
  }, [isOpen, data]);

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
        <h3>Eye Power</h3>
        <div className="lens-power-fields">
            {["opticalHeight", "segmentHeight"].map(
              (field, index) => (
                <div key={field} className="eye-power-form-group">
                  <label className="eye-power-label">{index === 0 ? "Optical Height" : "Segment Height"}</label>
                  <input
                    className="eye-power-input"
                    type="text"
                    name={`${field}`}
                    value={eyePowerData?.[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>

        <div className="eye-power-section">
          <h4>Lens Profile</h4>
          <div className="lens-power-fields">
            {["r_SPH", "r_CYL", "r_AXIS", "r_BC", "r_DIA", "r_K_READING", "l_SPH", "l_CYL", "l_AXIS", "l_BC", "l_DIA", "l_K_READING"].map(
              (field) => (
                <div key={field} className="eye-power-form-group">
                  <label className="eye-power-label">{field.replace("_", " ")}</label>
                  <input
                    className="eye-power-input"
                    type="text"
                    name={`lensProfile.${field}`}
                    value={eyePowerData.lensProfile?.[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="eye-power-section">
          <h4>Latest Glass Profile</h4>
          <div className="glasses-power-fields">
            {["r_SPH", "r_CYL", "r_AXIS", "r_PRISM", "r_VA", "r_ADD", "r_PD", "l_SPH", "l_CYL", "l_AXIS", "l_PRISM", "l_VA", "l_ADD", "l_PD"].map(
              (field) => (
                <div key={field} className="eye-power-form-group">
                  <label className="eye-power-label">{field.replace("_", " ")}</label>
                  <input
                    className="eye-power-input"
                    type="text"
                    name={`latestGlassProfie.${field}`}
                    value={eyePowerData.latestGlassProfie?.[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="eye-power-section">
          <h4>Actual Glass Profile</h4>
          <div className="glasses-power-fields">
            {["r_SPH", "r_CYL", "r_AXIS", "r_PRISM", "r_VA", "r_ADD", "r_PD", "l_SPH", "l_CYL", "l_AXIS", "l_PRISM", "l_VA", "l_ADD", "l_PD"].map(
              (field) => (
                <div key={field} className="eye-power-form-group">
                  <label className="eye-power-label">{field.replace("_", " ")}</label>
                  <input
                    className="eye-power-input"
                    type="text"
                    name={`actualGlassProfile.${field}`}
                    value={eyePowerData.actualGlassProfile?.[field] || ""}
                    onChange={handleChange}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="popup-buttons">
          <button className="save-button" onClick={handleSave}>Save Changes</button>
          <button className="cancel-button" onClick={onClose}>Cancel / Close</button>
        </div>
      </div>
    </div>
  );
};

export default EyePowerModal;
