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

  const handleGroupChange = (group, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const getDefaultDateTimeLocal = () => {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 19);
  };

  const now = getDefaultDateTimeLocal();

  const handleSave = async () => {
    // Construct the payload for the API request
    const requestData = {
      actionData: {
        customerId: Number(localStorage.getItem("customerId")),
        userId: localStorage.getItem("userId"),
        id: debtorId || "",
      },
      eyePowerId: formData.eyePowerId || "",
      debtorId: debtorId || "",
      salesId: formData.salesId || "",
      opticalHeight: formData.opticalHeight,
      segmentHeight: formData.segmentHeight,
      userDefinedTime: formData.recordedDate || now,
      lensProfile: {
        lensEyePowerProfileId: formData.lensProfile.lensEyePowerProfileId,
        r_SPH: formData.lensProfile.r_SPH,
        r_CYL: formData.lensProfile.r_CYL,
        r_AXIS: formData.lensProfile.r_AXIS,
        r_BC: formData.lensProfile.r_BC,
        r_DIA: formData.lensProfile.r_DIA ,
        r_K_READING: formData.lensProfile.r_K_READING ,
        l_SPH: formData.lensProfile.l_SPH  ,
        l_CYL: formData.lensProfile.l_CYL  ,
        l_AXIS: formData.lensProfile.l_AXIS  ,
        l_BC: formData.lensProfile.l_BC  ,
        l_DIA: formData.lensProfile.l_DIA  ,
        l_K_READING: formData.lensProfile.l_K_READING  ,
      },
      latestGlassProfie: {
        glassEyePowerProfileId: formData.latestGlassProfie.glassEyePowerProfileId,
        isActual: false,
        r_SPH: formData.latestGlassProfie.r_SPH  ,
        r_CYL: formData.latestGlassProfie.r_CYL  ,
        r_AXIS: formData.latestGlassProfie.r_AXIS  ,
        r_PRISM: formData.latestGlassProfie.r_PRISM  ,
        r_VA: formData.latestGlassProfie.r_VA  ,
        r_ADD: formData.latestGlassProfie.r_ADD  ,
        r_PD: formData.latestGlassProfie.r_PD  ,
        l_SPH: formData.latestGlassProfie.l_SPH  ,
        l_CYL: formData.latestGlassProfie.l_CYL  ,
        l_AXIS: formData.latestGlassProfie.l_AXIS  ,
        l_PRISM: formData.latestGlassProfie.l_PRISM  ,
        l_VA: formData.latestGlassProfie.l_VA  ,
        l_ADD: formData.latestGlassProfie.l_ADD  ,
        l_PD: formData.latestGlassProfie.l_PD  ,
      },
      actualGlassProfile: {
        glassEyePowerProfileId: formData.actualGlassProfile.glassEyePowerProfileId,
        isActual: true,
        r_SPH: formData.actualGlassProfile.r_SPH  ,
        r_CYL: formData.actualGlassProfile.r_CYL  ,
        r_AXIS: formData.actualGlassProfile.r_AXIS  ,
        r_PRISM: formData.actualGlassProfile.r_PRISM  ,
        r_VA: formData.actualGlassProfile.r_VA  ,
        r_ADD: formData.actualGlassProfile.r_ADD  ,
        r_PD: formData.actualGlassProfile.r_PD  ,
        l_SPH: formData.actualGlassProfile.l_SPH  ,
        l_CYL: formData.actualGlassProfile.l_CYL  ,
        l_AXIS: formData.actualGlassProfile.l_AXIS  ,
        l_PRISM: formData.actualGlassProfile.l_PRISM  ,
        l_VA: formData.actualGlassProfile.l_VA  ,
        l_ADD: formData.actualGlassProfile.l_ADD  ,
        l_PD: formData.actualGlassProfile.l_PD  ,
      }
    };

    try {
      const res = await fetch("https://optikposbackend.absplt.com/EyePower/Save", {
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

        {/* Lens Profile */}
        <h5 className="creditor-modal-title">Lens Profile</h5>
        <div className="eyepower-section-content">
        {["r_SPH", "r_CYL", "r_AXIS", "r_BC", "r_DIA", "r_K_READING", "l_SPH", "l_CYL", "l_AXIS", "l_BC", "l_DIA", "l_K_READING"].map(
          (field) => (
            <div className="creditor-form-group" key={`lensProfile-${field}`}>
              <label className="creditor-form-label">{field}</label>
              <input
                type="number"
                className="creditor-form-input"
                value={formData.lensProfile?.[field] || ""}
                onChange={(e) =>
                  handleGroupChange("lensProfile", field, e.target.value)
                }
              />
            </div>
          )
        )}
        </div>

        {/* Latest Glass Profile */}
        <h5 className="creditor-modal-title">Latest Glass Profile</h5>
        <div className="eyepower-section-content">
        {["r_SPH", "r_CYL", "r_AXIS", "r_PRISM", "r_VA", "r_ADD", "r_PD", "l_SPH", "l_CYL", "l_AXIS", "l_PRISM", "l_VA", "l_ADD", "l_PD"].map(
          (field) => (
            <div className="creditor-form-group" key={`latestGlassProfile-${field}`}>
              <label className="creditor-form-label">{field}</label>
              <input
                type="number"
                className="creditor-form-input"
                value={formData.latestGlassProfie?.[field] || ""}
                onChange={(e) =>
                  handleGroupChange("latestGlassProfie", field, e.target.value)
                }
              />
            </div>
          )
        )}
        </div>

        {/* Actual Glass Profile */}
        <h5 className="creditor-modal-title">Actual Glass Profile</h5>
        <div className="eyepower-section-content">
        {["r_SPH", "r_CYL", "r_AXIS", "r_PRISM", "r_VA", "r_ADD", "r_PD", "l_SPH", "l_CYL", "l_AXIS", "l_PRISM", "l_VA", "l_ADD", "l_PD"].map(
          (field) => (
            <div className="creditor-form-group" key={`actualGlassProfile-${field}`}>
              <label className="creditor-form-label">{field}</label>
              <input
                type="number"
                className="creditor-form-input"
                value={formData.actualGlassProfile?.[field] || ""}
                onChange={(e) =>
                  handleGroupChange("actualGlassProfile", field, e.target.value)
                }
              />
            </div>
          )
        )}
        </div>

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
