import React, { useState, useEffect } from "react";
import "../css/DebtorModal.css";
import ErrorModal from "./ErrorModal";
import ConfirmationModal from "./ConfirmationModal";
import Select from "react-select";
import GlassesEyePowerTable from "../layouts/GlassesEyePowerTable";
import LensEyePowerTable from "../layouts/LensEyePowerTable";
import NewEyePowerModal from "./NewEyePowerModal";

const DebtorModal = ({ isOpen, title, data, onClose, onSave, isViewing, debtorTypeOptions }) => {
  const [sectionData, setSectionData] = useState({});
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const [serviceRecords, setServiceRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [activeTab, setActiveTab] = useState("serviceRecord");
  const [eyePowerRecords, setEyePowerRecords] = useState([]);
  const [selectedEyeRecordIndex, setSelectedEyeRecordIndex] = useState(0);

  const [showNewEyeModal, setShowNewEyeModal] = useState(false);
  const [newEyeData, setNewEyeData] = useState(null);

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

      if (isViewing && data.debtorId) {
        fetchServiceRecords(data.debtorId);
      }
    }
  }, [isOpen, data, isViewing]);

  useEffect(() => {
    if (serviceRecords.length > 0) {
      setSelectedRecord(serviceRecords[0]);
    } else {
      setSelectedRecord(null);
    }
  }, [serviceRecords]);

  // Function to fetch service records from the API
  const fetchServiceRecords = async (debtorId) => {
    try {
      const res = await fetch("https://optikposbackend.absplt.com/Sales/GetDebtorServiceRecords", {
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
      });
      const result = await res.json();
      if (res.ok && result.success) {
        const sortedRecords = result.data.sort((a, b) => new Date(b.docDate) - new Date(a.docDate));
        setServiceRecords(sortedRecords);
      } else {
        throw new Error(result.errorMessage || "Failed to fetch service records.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  useEffect(() => {
    if (activeTab === "eyePowerRecords" && isViewing && data.debtorId) {
      fetchEyePowerRecords(data.debtorId);
    }
  }, [activeTab, isViewing, data.debtorId]);

  useEffect(() => {
    if (eyePowerRecords.length > 0) {
      setSelectedEyeRecordIndex(0);
    }
  }, [eyePowerRecords]);
  
  
  const fetchEyePowerRecords = async (debtorId) => {
    try {
      const res = await fetch("https://optikposbackend.absplt.com/EyePower/GetDebtorEyePowerRecords", {
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
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setEyePowerRecords(result.data);
      } else {
        throw new Error(result.errorMessage || "Failed to fetch eye power records.");
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
      const res = await fetch("https://optikposbackend.absplt.com/EyePower/New", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "text/plain",
        },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          userId: localStorage.getItem("userId"),
          id: data.debtorId  // or use another appropriate id value
        }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        // Set new eye power data and open the modal for input form
        setNewEyeData(result.data);
        setShowNewEyeModal(true);
      } else {
        throw new Error(result.errorMessage || "Failed to add new eye power record.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleNewEyeSave = (newData) => {
    setShowNewEyeModal(false);
    if (data.debtorId) {
      fetchEyePowerRecords(data.debtorId);
    }
  };

  const handleExportTemplate = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/EyePower/GetExcelImportTemplate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          userId: localStorage.getItem("userId"),
          id: data.debtorId, // debtor id
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to export template");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "EyePowerExcelTemplate.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Export Error", message: error.message });
    }
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
            { label: "Medical Others", name: "medicalOthers" },
            { label: "Ocular Others", name: "ocularOthers" },
            { label: "Medical Is Diabetes", name: "medicalIsDiabetes", type: "checkbox" },
            { label: "Medical Is Hypertension", name: "medicalIsHypertension", type: "checkbox" },
            { label: "Ocular Is Squint", name: "ocularIsSquint", type: "checkbox" },
            { label: "Ocular Is Lazy Eye", name: "ocularIsLazyEye", type: "checkbox" },
            { label: "Ocular Has Surgery", name: "ocularHasSurgery", type: "checkbox" },
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

        {isViewing && (
          <>
          {/* Tab Navigation */}
          <div className="inquiry-tabs">
            <button 
              className={`tab-button ${activeTab === "serviceRecord" ? "active" : ""}`}
              onClick={() => setActiveTab("serviceRecord")}
            >
              Service Record
            </button>
            <button 
              className={`tab-button ${activeTab === "eyePowerRecords" ? "active" : ""}`}
              onClick={() => setActiveTab("eyePowerRecords")}
            >
              Eye Power Records
            </button>
          </div>

          {activeTab === "serviceRecord" && (
          <div className="service-records-wrapper">
            <div className="service-records-list">
              <h4>Service Records</h4>
              <div className="record-header">
                <span className="record-col date-col">DocDate</span>
                <span className="record-col docno-col">Doc No</span>
                <span className="record-col amount-col">Amount</span>
              </div>
              {serviceRecords.length > 0 ? (
                serviceRecords.map((record) => (
                  <div
                    key={record.salesId}
                    className={`record-row ${selectedRecord && selectedRecord.salesId === record.salesId ? "active" : ""}`}
                    onClick={() => setSelectedRecord(record)}
                  >
                    <span className="record-col date-col">
                      {new Date(record.docDate).toLocaleDateString()}
                    </span>
                    <span className="record-col docno-col">{record.docNo}</span>
                    <span className="record-col amount-col">{record.total}</span>
                  </div>
                ))
              ) : (
                <p>No records found.</p>
              )}
            </div>

            {/* Right side: Selected record details */}
            <div className="service-record-details">
              {selectedRecord ? (
                <>
                  <h4>Record Details</h4>
                  <table className="record-details-table">
                    <tbody>
                      <tr>
                        <td>Optical Height:  </td>
                        <td>{selectedRecord.opticalHeight ?? "-"}</td>
                      </tr>
                      <tr>
                        <td>Segment Height:  </td>
                        <td>{selectedRecord.segmentHeight ?? "-"}</td>
                      </tr>
                    </tbody>
                  </table>

                  <GlassesEyePowerTable
                    title="Previous Glass Eye Power"
                    eyeRecord={selectedRecord.previousGlassEyePower}
                  />

                  <GlassesEyePowerTable
                    title="Latest Glass Eye Power"
                    eyeRecord={selectedRecord.latestGlassEyePower}
                  />

                  <GlassesEyePowerTable
                    title="Actual Glass Eye Power"
                    eyeRecord={selectedRecord.actualGlassEyePower}
                  />

                  <LensEyePowerTable
                    title="Lens Eye Power"
                    eyeRecord={selectedRecord.lensEyePower}
                  />

                  <h5>Item Details</h5>
                  {selectedRecord.details && selectedRecord.details.length > 0 ? (
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
                            <td>{detail.itemCode != null ? detail.itemCode : "-"}</td>
                            <td>{detail.description != null ? detail.description : "-"}</td>
                            <td>{detail.desc2 != null ? detail.decs2 : "-"}</td>
                            <td>{detail.uom != null ? detail.uom : "-"}</td>
                            <td>{detail.qty !== null ? detail.qty : "-"}</td>
                            <td>{detail.unitPrice !== null ? detail.unitPrice : "-"}</td>
                            <td>{detail.discount != null ? detail.discount : "-"}</td>
                            <td>{detail.discountAmount !== null ? detail.discountAmount : "-"}</td>
                            <td>{detail.subTotal !== null ? detail.subTotal : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No detail records available.</p>
                  )}

                  <h5>Payment History</h5>
                  {selectedRecord.paymentHistory && selectedRecord.paymentHistory.length > 0 ? (
                    <table className="eye-record-table">
                      <thead>
                        <tr>
                          <th>Doc No</th>
                          <th>Payment Date</th>
                          <th>Remark</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.paymentHistory.map((payment) => (
                          <tr key={payment.salesPaymentId}>
                            <td>{payment.docNo != null ? payment.docNo : "-"}</td>
                            <td>{new Date(payment.paymentDate).toLocaleDateString() != null ? new Date(payment.paymentDate).toLocaleDateString() : "-"}</td>
                            <td>{payment.remark != null ? payment.remark : "-"}</td>
                            <td>{payment.amount !== null ? payment.amount : "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payment history available.</p>
                  )}
                </>
              ) : (
                <p>Select a service record to view its details.</p>
              )}
            </div>
          </div>
        )}

            {activeTab === "eyePowerRecords" && (
              <div className="service-records-wrapper">
                <div className="service-records-list">
                  <h4>Eye Power Records</h4>
                  <div className="record-header">
                    <span className="record-col date-col">Recorded Date</span>
                    <span className="record-col time-col">Time</span>
                    <span className="record-col amount-col">Recorded By</span>
                  </div>
                  {eyePowerRecords.length > 0 ? (
                    eyePowerRecords.map((record, index) => (
                      <div 
                        key={index}
                        className={`record-row ${selectedEyeRecordIndex === index ? "active" : ""}`}
                        onClick={() => setSelectedEyeRecordIndex(index)}
                      >
                        <span className="record-col date-col">
                          {new Date(record.recordedDate).toLocaleDateString()}
                        </span>
                        <span className="record-col time-col">
                          {new Date(record.recordedDate).toLocaleTimeString()}
                        </span>
                        <span className="record-col amount-col">
                          {record.recordedBy}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p>No eye power records available.</p>
                  )}
                </div>
                <div className="service-record-details">
                  {eyePowerRecords.length > 0 && (
                    <>
                      <h4>Record Details</h4>
                      <div className="button-row">
                        <button className="add-eye-button" onClick={handleAddEyePowerRecord}>
                          Add New Eye Power
                        </button>
                        
                        <button className="add-eye-button" onClick={handleExportTemplate}>
                          Export Eye Power Excel Template
                        </button>
                      </div>

                      <table className="record-details-table">
                        <tbody>
                          <tr>
                            <td>Optical Height:  </td>
                            <td>{eyePowerRecords[selectedEyeRecordIndex].opticalHeight ?? "-"}</td>
                          </tr>
                          <tr>
                            <td>Segment Height:  </td>
                            <td>{eyePowerRecords[selectedEyeRecordIndex].segmentHeight ?? "-"}</td>
                          </tr>
                        </tbody>
                      </table>

                      <GlassesEyePowerTable
                        title="Latest Glass Eye Power"
                        eyeRecord={eyePowerRecords[selectedEyeRecordIndex].latestRecords}
                      />
                      <GlassesEyePowerTable
                        title="Actual Glass Eye Power"
                        eyeRecord={eyePowerRecords[selectedEyeRecordIndex].actualRecords}
                      />
                      <LensEyePowerTable
                        title="Lens Eye Power"
                        eyeRecord={eyePowerRecords[selectedEyeRecordIndex].lensRecords}
                      />
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

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

        <ErrorModal
          isOpen={errorModal.isOpen}
          title={errorModal.title}
          message={errorModal.message}
          onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
        />

        <ConfirmationModal
          isOpen={isConfirmOpen}
          title="Confirm Action"
          message="Are you sure you want to cancel and discard unsaved changes?"
          onConfirm={handleConfirmAction}
          onCancel={() => setIsConfirmOpen(false)}
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
