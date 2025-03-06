import { useState, useEffect } from "react";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";

const NewEyePowerModal = ({ isOpen, data, onClose, onSave, debtorId }) => {
    const [formData, setFormData] = useState(data);
    const [successModal, setSuccessModal] = useState({ isOpen: false, title: "", message: "" });
    const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    setFormData(data);
  }, [data]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getDefaultDateTimeLocal = () => {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 19);
  };

  const now = getDefaultDateTimeLocal();

  const handleSave = async () => {
    const requestData = {
      actionData: {
        customerId: Number(localStorage.getItem("customerId")),
        userId: localStorage.getItem("userId"),
        id: debtorId,
      },
      eyePowerId: formData.eyePowerId,
      debtorId: debtorId,
      salesId: formData.salesId,
      opticalHeight: formData.opticalHeight,
      segmentHeight: formData.segmentHeight,
      userDefinedTime: formData.recordedDate || now,
      lensProfile: {
        lens_R_SPH: formData.lensProfile?.lens_R_SPH ,
        lens_R_CYL: formData.lensProfile?.lens_R_CYL ,
        lens_R_AXIS: formData.lensProfile?.lens_R_AXIS ,
        lens_R_BC: formData.lensProfile?.lens_R_BC ,
        lens_R_DIA: formData.lensProfile?.lens_R_DIA ,
        lens_R_K_READING: formData.lensProfile?.lens_R_K_READING ,
        lens_L_SPH: formData.lensProfile?.lens_L_SPH ,
        lens_L_CYL: formData.lensProfile?.lens_L_CYL ,
        lens_L_AXIS: formData.lensProfile?.lens_L_AXIS ,
        lens_L_BC: formData.lensProfile?.lens_L_BC ,
        lens_L_DIA: formData.lensProfile?.lens_L_DIA ,
        lens_L_K_READING: formData.lensProfile?.lens_L_K_READING ,
      },

      latestGlassProfile: {
        latest_Glass_R_SPH: formData.latestGlassProfile?.latest_Glass_R_SPH ,
        latest_Glass_R_CYL: formData.latestGlassProfile?.latest_Glass_R_CYL ,
        latest_Glass_R_AXIS: formData.latestGlassProfile?.latest_Glass_R_AXIS ,
        latest_Glass_R_PRISM: formData.latestGlassProfile?.latest_Glass_R_PRISM ,
        latest_Glass_R_VA: formData.latestGlassProfile?.latest_Glass_R_VA ,
        latest_Glass_R_ADD: formData.latestGlassProfile?.latest_Glass_R_ADD ,
        latest_Glass_R_PD: formData.latestGlassProfile?.latest_Glass_R_PD ,
        latest_Glass_L_SPH: formData.latestGlassProfile?.latest_Glass_L_SPH ,
        latest_Glass_L_CYL: formData.latestGlassProfile?.latest_Glass_L_CYL ,
        latest_Glass_L_AXIS: formData.latestGlassProfile?.latest_Glass_L_AXIS ,
        latest_Glass_L_PRISM: formData.latestGlassProfile?.latest_Glass_L_PRISM ,
        latest_Glass_L_VA: formData.latestGlassProfile?.latest_Glass_L_VA ,
        latest_Glass_L_ADD: formData.latestGlassProfile?.latest_Glass_L_ADD ,
        latest_Glass_L_PD: formData.latestGlassProfile?.latest_Glass_L_PD ,
      },

      actualGlassProfile: {
        actual_Glass_R_SPH: formData.actualGlassProfile?.actual_Glass_R_SPH ,
        actual_Glass_R_CYL: formData.actualGlassProfile?.actual_Glass_R_CYL ,
        actual_Glass_R_AXIS: formData.actualGlassProfile?.actual_Glass_R_AXIS ,
        actual_Glass_R_PRISM: formData.actualGlassProfile?.actual_Glass_R_PRISM ,
        actual_Glass_R_VA: formData.actualGlassProfile?.actual_Glass_R_VA ,
        actual_Glass_R_ADD: formData.actualGlassProfile?.actual_Glass_R_ADD ,
        actual_Glass_R_PD: formData.actualGlassProfile?.actual_Glass_R_PD ,
        actual_Glass_L_SPH: formData.actualGlassProfile?.actual_Glass_L_SPH ,
        actual_Glass_L_CYL: formData.actualGlassProfile?.actual_Glass_L_CYL ,
        actual_Glass_L_AXIS: formData.actualGlassProfile?.actual_Glass_L_AXIS ,
        actual_Glass_L_PRISM: formData.actualGlassProfile?.actual_Glass_L_PRISM ,
        actual_Glass_L_VA: formData.actualGlassProfile?.actual_Glass_L_VA ,
        actual_Glass_L_ADD: formData.actualGlassProfile?.actual_Glass_L_ADD ,
        actual_Glass_L_PD: formData.actualGlassProfile?.actual_Glass_L_PD ,
      },
    };

    try {
      const res = await fetch("https://optikposwebsiteapi.absplt.com/EyePower/Save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify(requestData),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        onSave(result.data);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch new eye power data.");
    }
    } catch (err) {
    setErrorModal({
        isOpen: true,
        title: "Error Saving Sales Invoice",
        message: err.message,
        });
    }
  };

  const handleSuccessModalClose = () => {
    setSuccessModal({ isOpen: false });
    onClose();
  };

  if (!isOpen) return null;


  return (
    <div className="creditor-popup-overlay">
      <div className="creditor-popup-content">
        <h3 className="creditor-modal-title">New Eye Power Record</h3>

        <div className="eyepower-section-content">
        <div className="creditor-form-group">
          <label className="creditor-form-label">Recorded Date-Time</label>
          <input
            type="datetime-local"
            className="creditor-form-input"
            value={formData.recordedDate || ""}
            onChange={(e) => handleInputChange("recordedDate", e.target.value)}
          />
        </div>
        
        <div className="creditor-form-group">
          <label className="creditor-form-label">Optical Height</label>
          <input
            type="number"
            className="creditor-form-input"
            value={formData.opticalHeight || ""}
            onChange={(e) => handleInputChange("opticalHeight", e.target.value)}
          />
        </div>
        <div className="creditor-form-group">
          <label className="creditor-form-label">Segment Height</label>
          <input
            type="number"
            className="creditor-form-input"
            value={formData.segmentHeight || ""}
            onChange={(e) => handleInputChange("segmentHeight", e.target.value)}
          />
        </div>
        </div>

        <h5 className="creditor-modal-title">Lens Profile</h5>
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
                          value={formData.lensProfile[fieldName]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              lensProfile: {
                                ...formData.lensProfile,
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

        <h5 className="creditor-modal-title">Latest Glass Profile</h5>
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
                          value={formData.latestGlassProfile[fieldName]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              latestGlassProfile: {
                                ...formData.latestGlassProfile,
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

        <h5 className="creditor-modal-title">Actual Glass Profile</h5>
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
                          value={formData.actualGlassProfile[fieldName]}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              actualGlassProfile: {
                                ...formData.actualGlassProfile,
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

        <div className="section-buttons">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>

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

export default NewEyePowerModal;
