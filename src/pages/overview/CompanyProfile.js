import React, { useState, useEffect } from "react";
import "../../css/Profile.css";
import ErrorModal from "../../modals/ErrorModal";
import { FaRegEdit, FaRegSave } from "react-icons/fa";

const CompanyProfile = () => {
  const [companyData, setCompanyData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  const customerId = Number(localStorage.getItem("customerId"));
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCompanyData();
  }, []);

  const fetchCompanyData = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Company/GetCompany", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, userId, id: localStorage.getItem("customerId") }),
      });

      const data = await response.json();
      if (response.ok && data.success && data.data) {
        setCompanyData(data.data);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch company data.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Company Data", message: error.message });
    }
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Company/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId, userId, id: localStorage.getItem("customerId") }),
        });
        const data = await response.json();
        if (response.ok && data.success && data.data) {
          setCompanyData((prev) => ({ ...data.data, companyName: prev.companyName }));
          setIsEditing(true);
        } else {
          throw new Error(data.errorMessage || "Failed to enter edit mode.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Editing Company Data", message: error.message });
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Company/Save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionData: { customerId, userId, id: localStorage.getItem("customerId") },
          ...companyData,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsEditing(false);
        fetchCompanyData();
      } else {
        throw new Error(data.errorMessage || "Failed to save company data.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Saving Company Data", message: error.message });
    }
  };

  const renderInputField = (label, fieldName, readOnly = false) => (
    <div className="profile-info">
      <label>{label}:</label>
      <div className="profile-info-input">
        {isEditing ? (
          <input
            type="text"
            name={fieldName}
            value={companyData[fieldName] || ""}
            onChange={handleInputChange}
            readOnly={readOnly}
          />
        ) : (
          <p>{companyData[fieldName] || "-"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-card">
      <div className="profile-header">
        <h3>Company Profile</h3>
      </div>

      <div className="profile-details">
        {renderInputField("Company Name", "companyName", true)}
        {renderInputField("Registration No", "registrationNo")}
        {renderInputField("Phone 1", "phone1")}
        {renderInputField("Phone 2", "phone2")}
        {renderInputField("Fax", "fax")}
        {renderInputField("Address", "address")}
        {renderInputField("Postcode", "postcode")}
        {renderInputField("City", "city")}
        {renderInputField("State", "state")}
        {renderInputField("Country", "country")}
      </div>

      <div className="profile-actions">
        {isEditing ? (
          <button className="save-btn" onClick={handleSave}>
            <FaRegSave /> Save
          </button>
        ) : (
          <button className="edit-btn" onClick={handleEditToggle}>
            <FaRegEdit /> Edit
          </button>
        )}
      </div>

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ isOpen: false, title: "", message: "" })}
      />
    </div>
  );
};

export default CompanyProfile;
