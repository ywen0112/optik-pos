import React, { useState, useEffect } from "react";
import "../css/DebtorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";
import GlassesEyePowerTable from "../layouts/GlassesEyePowerTable";
import LensEyePowerTable from "../layouts/LensEyePowerTable";
import NewEyePowerModal from "./NewEyePowerModal";
import { FaTrash } from "react-icons/fa";
import SuccessModal from "./SuccessModal";

const DebtorModal = ({
  isOpen,
  title,
  data,
  onClose,
  onSave,
  isViewing,
  debtorTypeOptions,
}) => {
  const [sectionData, setSectionData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showNewEyeModal, setShowNewEyeModal] = useState(false);
  const [newEyeData, setNewEyeData] = useState(null);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});

  const getDefaultDateTimeLocal = () => {
    const date = new Date();
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - tzOffset).toISOString().slice(0, 19);
  };

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

      if (data.debtorId) {
        fetchEyePowerRecords(data.debtorId);
      }
    }
  }, [isOpen, data, isViewing]);

  useEffect(() => {
    if (serviceRecords?.length > 0) {
      setSelectedRecord(serviceRecords[0]);
    } else {
      setSelectedRecord(null);
    }
  }, [serviceRecords]);

  const fetchEyePowerRecords = async (debtorId) => {
    try {
      const res = await fetch(
        "https://optikposbackend.absplt.com/EyePower/GetDebtorEyePowerRecords",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify({
            customerId: Number(localStorage.getItem("customerId")),
            userId: localStorage.getItem("userId"),
            id: debtorId,
          }),
        }
      );
      const result = await res.json();
      if (res.ok && result.success) {
        const sortedRecords = result.data.sort(
          (a, b) => new Date(b.docDate) - new Date(a.docDate)
        );
        setServiceRecords(sortedRecords);
      } else {
        throw new Error(
          result.errorMessage || "Failed to fetch service records."
        );
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

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

  const handleAddEyePowerRecord = async () => {
    try {
      const res = await fetch(
        "https://optikposbackend.absplt.com/EyePower/New",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            accept: "text/plain",
          },
          body: JSON.stringify({
            customerId: Number(localStorage.getItem("customerId")),
            userId: localStorage.getItem("userId"),
            id: data.debtorId, 
          }),
        }
      );
      const result = await res.json();
      if (res.ok && result.success) {
        setNewEyeData(result.data);
        setShowNewEyeModal(true);
      } else {
        throw new Error(
          result.errorMessage || "Failed to add new eye power record."
        );
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleNewEyeSave = () => {
    setShowNewEyeModal(false);
    if (data.debtorId) {
      fetchEyePowerRecords(data.debtorId);
    }
  };

  const handleRecordChange = (field, value) => {
    setSelectedRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const mapRecordToSaveFormat = (record) => {
    return {
      actionData: {
        customerId: Number(localStorage.getItem("customerId")),
        userId: localStorage.getItem("userId"),
        id: record.eyeProfileId, 
      },
      eyePowerId: record.eyeProfileId,
      debtorId: data.debtorId || "", 
      salesId: record.salesId || "", 
      opticalHeight: record.opticalHeight ?? null,
      segmentHeight: record.segmentHeight ?? null,
      userDefinedTime: getDefaultDateTimeLocal,
  
      // Map Lens Profile
      lensProfile: {
        lens_R_SPH: record.lensRecords.r_SPH ?? null,
        lens_R_CYL: record.lensRecords.r_CYL ?? null,
        lens_R_AXIS: record.lensRecords.r_AXIS ?? null,
        lens_R_BC: record.lensRecords.r_BC ?? null,
        lens_R_DIA: record.lensRecords.r_DIA ?? null,
        lens_R_K_READING: record.lensRecords.r_K_READING ?? null,
        lens_L_SPH: record.lensRecords.l_SPH ?? null,
        lens_L_CYL: record.lensRecords.l_CYL ?? null,
        lens_L_AXIS: record.lensRecords.l_AXIS ?? null,
        lens_L_BC: record.lensRecords.l_BC ?? null,
        lens_L_DIA: record.lensRecords.l_DIA ?? null,
        lens_L_K_READING: record.lensRecords.l_K_READING ?? null,
      },
  
      // Map Latest Glass Profile
      latestGlassProfile: {
        latest_Glass_R_SPH: record.latestRecords.r_SPH ?? null,
        latest_Glass_R_CYL: record.latestRecords.r_CYL ?? null,
        latest_Glass_R_AXIS: record.latestRecords.r_AXIS ?? null,
        latest_Glass_R_PRISM: record.latestRecords.r_PRISM ?? null,
        latest_Glass_R_VA: record.latestRecords.r_VA ?? null,
        latest_Glass_R_ADD: record.latestRecords.r_ADD ?? null,
        latest_Glass_R_PD: record.latestRecords.r_PD ?? null,
        latest_Glass_L_SPH: record.latestRecords.l_SPH ?? null,
        latest_Glass_L_CYL: record.latestRecords.l_CYL ?? null,
        latest_Glass_L_AXIS: record.latestRecords.l_AXIS ?? null,
        latest_Glass_L_PRISM: record.latestRecords.l_PRISM ?? null,
        latest_Glass_L_VA: record.latestRecords.l_VA ?? null,
        latest_Glass_L_ADD: record.latestRecords.l_ADD ?? null,
        latest_Glass_L_PD: record.latestRecords.l_PD ?? null,
      },
  
      // Map Actual Glass Profile
      actualGlassProfile: {
        actual_Glass_R_SPH: record.actualRecords.r_SPH ?? null,
        actual_Glass_R_CYL: record.actualRecords.r_CYL ?? null,
        actual_Glass_R_AXIS: record.actualRecords.r_AXIS ?? null,
        actual_Glass_R_PRISM: record.actualRecords.r_PRISM ?? null,
        actual_Glass_R_VA: record.actualRecords.r_VA ?? null,
        actual_Glass_R_ADD: record.actualRecords.r_ADD ?? null,
        actual_Glass_R_PD: record.actualRecords.r_PD ?? null,
        actual_Glass_L_SPH: record.actualRecords.l_SPH ?? null,
        actual_Glass_L_CYL: record.actualRecords.l_CYL ?? null,
        actual_Glass_L_AXIS: record.actualRecords.l_AXIS ?? null,
        actual_Glass_L_PRISM: record.actualRecords.l_PRISM ?? null,
        actual_Glass_L_VA: record.actualRecords.l_VA ?? null,
        actual_Glass_L_ADD: record.actualRecords.l_ADD ?? null,
        actual_Glass_L_PD: record.actualRecords.l_PD ?? null,
      },
    };
  };
  

  const handleSaveRecord = async () => {
    if (!selectedRecord) {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "No record selected for saving.",
      });
      return;
    }
  
    const requestData = mapRecordToSaveFormat(selectedRecord);
  
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
        setServiceRecords(result.data);
        setSuccessModal({
          isOpen: true,
          title: "Saved successfully",
        });
        fetchEyePowerRecords(data.debtorId);
      } else {
        throw new Error(result.errorMessage || "Failed to save record.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleDeleteRecord = async (eyePowerId) => {
    if (!eyePowerId) {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "No record selected for deletion.",
      });
      return;
    }
  
    const requestData = {
      customerId: Number(localStorage.getItem("customerId")),
      id: eyePowerId, 
      userId: localStorage.getItem("userId"),
    };
  
    try {
      const res = await fetch("https://optikposbackend.absplt.com/EyePower/Delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify(requestData),
      });
  
      const result = await res.json();
  
      if (res.ok && result.success) {
        fetchEyePowerRecords(data.debtorId);
        setSuccessModal({
          isOpen: true,
          title: "Delete successfully",
        });
      } else {
        throw new Error(result.errorMessage || "Failed to delete record.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: ""});
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
            {
              label: "Debtor Type Code",
              name: "debtorTypeId",
              type: "select",
              options: debtorTypeOptions,
            },
            { label: "Address 1", name: "address1" },
            { label: "Address 2", name: "address2" },
            { label: "Address 3", name: "address3" },
            { label: "Address 4", name: "address4" },
            { label: "Postcode", name: "postCode" },
            { label: "Phone 1", name: "phone1" },
            { label: "Phone 2", name: "phone2" },
            { label: "Mobile", name: "mobile" },
            { label: "Medical Others", name: "medicalOthers" },
            { label: "Ocular Others", name: "ocularOthers" },
            {
              label: "Medical Is Diabetes",
              name: "medicalIsDiabetes",
              type: "checkbox",
            },
            {
              label: "Medical Is Hypertension",
              name: "medicalIsHypertension",
              type: "checkbox",
            },
            {
              label: "Ocular Is Squint",
              name: "ocularIsSquint",
              type: "checkbox",
            },
            {
              label: "Ocular Is Lazy Eye",
              name: "ocularIsLazyEye",
              type: "checkbox",
            },
            {
              label: "Ocular Has Surgery",
              name: "ocularHasSurgery",
              type: "checkbox",
            },
          ].map(({ label, name, type = "text", options }) => (
            <div key={name} className="creditor-form-group">
              <label className="creditor-form-label">{label}</label>
              {type === "select" ? (
                <Select
                  name={name}
                  value={
                    options.find(
                      (option) => option.value === sectionData[name]
                    ) || ""
                  }
                  onChange={(selectedOption) =>
                    setSectionData({
                      ...sectionData,
                      [name]: selectedOption.value,
                    })
                  }
                  options={options}
                  isDisabled={isViewing}
                  isSearchable={true}
                  placeholder={`Select ${label}`}
                />
              ) : type === "checkbox" ? (
                <input
                  className="creditor-checkbox-form"
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
        </div>

        <>
          <div className="service-records-wrapper">
            <div className="service-records-list">
              <h3>Service Records</h3>
            { !isViewing && (
              <button
                  className="add-eye-button"
                  onClick={handleAddEyePowerRecord}
                >
                  Add New Eye Power
                </button>
            )}
              <div className="record-header">
                <span className="record-col date-col">DocDate</span>
                <span className="record-col docno-col">Doc No</span>
                <span className="record-col recordedby-col">Recorded By</span>
                <span className="record-col amount-col">Amount</span>
                {!isViewing && <span className="record-col action-col">Actions</span>} 
              </div>
              {serviceRecords?.length > 0 ? (
                serviceRecords.map((record) => (
                  <div
                    key={record.eyeProfileId}
                    className={`record-row ${
                      selectedRecord &&
                      selectedRecord.eyeProfileId === record.eyeProfileId
                        ? "active"
                        : ""
                    }`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <span className="record-col date-col">
                      {record.recordedDate ? new Date(record.recordedDate).toLocaleDateString() : "-"}
                    </span>
                    <span className="record-col docno-col">
                      {record.docNo != null ? record.docNo : "-"} 
                    </span>
                    <span className="record-col recordedby-col">
                      {record.recordedBy != null ? record.recordedBy : "-"}
                    </span>
                    <span className="record-col amount-col">
                      {record.total != null ? record.total : "-"}
                    </span>
                    {!isViewing && (
                      <span className="record-col action-col">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecord(record.eyeProfileId);
                          }}
                          className="action-button delete"
                        >
                          <FaTrash />
                        </button>
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p>No records found.</p>
              )}
            </div>

            <div className="service-record-details">
              {selectedRecord ? (
                <>
                <h4>Record Details</h4>
                <table className="record-details-table">
                <tbody>
                  <tr>
                    <td>Optical Height:</td>
                      <td>
                        {isViewing ? (
                          selectedRecord.opticalHeight ?? "-"
                        ) : (
                          <input
                            type="number"
                            value={selectedRecord.opticalHeight}
                            onChange={(e) => handleRecordChange("opticalHeight", e.target.value)}
                          />
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>Segment Height:</td>
                      <td>
                        {isViewing ? (
                          selectedRecord.segmentHeight ?? "-"
                        ) : (
                          <input
                            type="number"
                            value={selectedRecord.segmentHeight}
                            onChange={(e) => handleRecordChange("segmentHeight", e.target.value)}
                          />
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <GlassesEyePowerTable
                  title="Latest Glass Eye Power"
                  eyeRecord={selectedRecord.latestRecords}
                  editable={!isViewing}
                  onChange={(updatedRecords) => handleRecordChange("latestRecords", updatedRecords)}
                />
                <GlassesEyePowerTable
                  title="Actual Glass Eye Power"
                  eyeRecord={selectedRecord.actualRecords}
                  editable={!isViewing}
                  onChange={(updatedRecords) => handleRecordChange("actualRecords", updatedRecords)}
                />
                <LensEyePowerTable
                  title="Lens Eye Power"
                  eyeRecord={selectedRecord.lensRecords}
                  editable={!isViewing}
                  onChange={(updatedRecords) => handleRecordChange("lensRecords", updatedRecords)}
                />

                {!isViewing && <button className="add-eye-button" onClick={handleSaveRecord}>Save Changes</button>}

                  <h5>Item Details</h5>
                  { selectedRecord?.details?.length > 0 ? (
                    <table className="eye-record-table">
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Description</th>
                          <th>Desc 2</th>
                          <th>UOM</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Discount</th>
                          <th>Discount Amount</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.details.map((detail) => (
                          <tr key={detail.salesDetailId}>
                            <td>
                              {detail.itemCode != null
                                ? detail.itemCode
                                : "-"}
                            </td>
                            <td>
                              {detail.description != null
                                ? detail.description
                                : "-"}
                            </td>
                            <td>
                              {detail.desc2 || "-"}
                            </td>
                            <td>{detail.uom != null ? detail.uom : "-"}</td>
                            <td>
                              {detail.qty !== null ? detail.qty : "-"}
                            </td>
                            <td>
                              {detail.unitPrice !== null
                                ? detail.unitPrice
                                : "-"}
                            </td>
                            <td>
                              {detail.discount != null
                                ? detail.discount
                                : "-"}
                            </td>
                            <td>
                              {detail.discountAmount !== null
                                ? detail.discountAmount
                                : "-"}
                            </td>
                            <td>
                              {detail.subTotal !== null
                                ? detail.subTotal
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No detail records available.</p>
                  )}

                  <h5>Payment History</h5>
                  {selectedRecord?.paymentHistory?.length > 0 ? (
                    <table className="eye-record-table">
                      <thead>
                        <tr>
                          <th>Doc No</th>
                          <th>Payment Date</th>
                          <th>Remark</th>
                          <th>Reference</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.paymentHistory.map((payment) => (
                          <tr key={payment.salesPaymentId}>
                            <td>
                              {payment.docNo != null ? payment.docNo : "-"}
                            </td>
                            <td>
                              {new Date(
                                payment.paymentDate
                              ).toLocaleDateString() != null
                                ? new Date(
                                    payment.paymentDate
                                  ).toLocaleDateString()
                                : "-"}
                            </td>
                            <td>
                              {payment.remark != null
                                ? payment.remark
                                : "-"}
                            </td>
                            <td>
                              {payment.reference || "-"}
                            </td>
                            <td>
                              {payment.amount !== null
                                ? payment.amount
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payment history available.</p>
                  )}
                </>
              ) : (
                <p>Select a record to view its details.</p>
              )}
            </div>
          </div>
          </>

        <div className="section-buttons">
          {isViewing && (
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>

        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={() =>
            setErrorModal({ isOpen: false, title: "", message: "" })
          }
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          title="Confirm Action"
          message="Are you sure you want to cancel and discard unsaved changes?"
          onConfirm={handleConfirmAction}
          onCancel={() => setIsConfirmOpen(false)}
        />

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        onClose={closeSuccessModal}
      />

        {showNewEyeModal && (
          <NewEyePowerModal
            isOpen={showNewEyeModal}
            data={newEyeData}
            onClose={() => setShowNewEyeModal(false)}
            onSave={handleNewEyeSave}
            debtorId={data.debtorId}
          />
        )}
      </div>
    </div>
  );
};

export default DebtorModal;
