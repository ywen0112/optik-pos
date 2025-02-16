import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye, FaGlasses } from "react-icons/fa";
import { MdVisibility } from "react-icons/md"; 
import DebtorModal from "../../modals/DebtorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";
import EyePowerModal from "../../modals/EyePowerModal";

const DebtorMaintenance = () => {
  const [debtors, setDebtors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalRecords, setTotalRecords] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newDebtor, setNewDebtor] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");
  const [debtorTypeOptions, setDebtorTypesOptions] = useState([]);
  const [isEyePowerOpen, setIsEyePowerOpen] = useState(false);
  const [selectedEyePower, setSelectedEyePower] = useState({});
  const [eyePowerType, setEyePowerType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const debtorMaintenanceRights = JSON.parse(localStorage.getItem("accessRights"))?.find(
    (item) => item.module === "Debtor Maintenance"
  ) || {};


  
  useEffect(() => {
    fetchDebtors();
  }, [currentPage, itemsPerPage, searchKeyword]);

  
    useEffect(() => {
      const fetchDebtorTypes = async () => {
        try {
          const response = await fetch("https://optikposbackend.absplt.com/DebtorType/GetRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
            const options = data.data.map(type => ({
              value: type.debtorTypeId,
              label: type.debtorTypeCode,
            }));
            setDebtorTypesOptions(options);
          } else {
            throw new Error(data.errorMessage || "Failed to fetch debtor types.");
          }
        } catch (error) {
          console.error("Error fetching debtor types:", error);
        }
      };
  
      fetchDebtorTypes();
    }, [customerId]);

    const fetchDebtors = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Debtor/GetRecords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            keyword: "", 
            offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          }),
        });
    
        const data = await response.json();
        if (response.ok && data.success) {
          const filteredDebtors = data.data.filter(debtor =>
            debtor.companyName?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            debtor.debtorCode?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            debtor.mobile?.includes(searchKeyword) 
          );
    
          setDebtors(filteredDebtors);
          setTotalRecords(Math.ceil(filteredDebtors.length / itemsPerPage));
        } else {
          throw new Error(data.errorMessage || "Failed to fetch debtors.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Fetching Data", message: error.message });
      } finally {
        setLoading(false);
      }
    };

    const handleItemsPerPageChange = (event) => {
      const newItemsPerPage = Number(event.target.value);
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); 
    };
    
    const handlePageChange = (page) => {
      if (page >= 1) {
        setCurrentPage(page);
      }
    };

  const handleOpenModal = async (debtor = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Debtor") {
        const response = await fetch("https://optikposbackend.absplt.com/Debtor/New", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: "",
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          debtor = {
            debtorId: data.data.debtorId,
            debtorCode: data.data.debtorCode || "",
            companyName: data.data.companyName || "",
            debtorTypeId: data.data.debtorTypeId || "",
            address1: data.data.address1 || "",
            address2: data.data.address2 || "",
            address3: data.data.address3 || "",
            address4: data.data.address4 || "",
            postCode: data.data.postCode || "",
            phone1: data.data.phone1 || "",
            phone2: data.data.phone2 || "",
            mobile: data.data.mobile || "",
            medicalIsDiabetes: data.data.medicalIsDiabetes,
            medicalIsHypertension: data.data.medicalIsHypertension,
            medicalOthers: data.data.medicalOthers || "",
            ocularIsSquint: data.data.ocularIsSquint,
            ocularIsLazyEye: data.data.ocularIsLazyEye,
            ocularHasSurgery: data.data.ocularHasSurgery,
            ocularOthers: data.data.ocularOthers || "",
          };
        } else {
          throw new Error(data.errorMessage || "Failed to create new debtor.");
        }
      }
      
      else if ((title === "Edit Debtor" || title === "View Debtor") && debtor.debtorId) {
        const response = await fetch("https://optikposbackend.absplt.com/Debtor/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: debtor.debtorId, 
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          debtor = {
            debtorId: data.data.debtorId,
            debtorCode: data.data.debtorCode || "",
            companyName: data.data.companyName || "",
            debtorTypeId: data.data.debtorTypeId || "",
            address1: data.data.address1 || "",
            address2: data.data.address2 || "",
            address3: data.data.address3 || "",
            address4: data.data.address4 || "",
            postCode: data.data.postCode || "",
            phone1: data.data.phone1 || "",
            phone2: data.data.phone2 || "",
            mobile: data.data.mobile || "",
            medicalIsDiabetes: data.data.medicalIsDiabetes,
            medicalIsHypertension: data.data.medicalIsHypertension,
            medicalOthers: data.data.medicalOthers || "",
            ocularIsSquint: data.data.ocularIsSquint,
            ocularIsLazyEye: data.data.ocularIsLazyEye,
            ocularHasSurgery: data.data.ocularHasSurgery,
            ocularOthers: data.data.ocularOthers || "",
          };
        } else {
          throw new Error(data.errorMessage || "Failed to fetch debtor data.");
        }
      }

      setNewDebtor(debtor);
      setModalTitle(title);
      setIsViewing(viewing);
      setIsPopupOpen(true);
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Opening Modal", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setNewDebtor({});
    setIsPopupOpen(false);
  };

  const handleSave = (updatedDebtor) => {
    setConfirmMessage(`Do you want to save this debtor?`);
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Debtor/Save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId: userId,
              id: updatedDebtor.debtorId || updatedDebtor.id, 
            },
            debtorId: updatedDebtor.debtorId || updatedDebtor.id, 
            debtorCode: updatedDebtor.debtorCode,
            companyName: updatedDebtor.companyName,
            debtorTypeId: updatedDebtor.debtorTypeId,
            address1: updatedDebtor.address1,
            address2: updatedDebtor.address2,
            address3: updatedDebtor.address3,
            address4: updatedDebtor.address4,
            postCode: updatedDebtor.postCode,
            phone1: updatedDebtor.phone1,
            phone2: updatedDebtor.phone2,
            mobile: updatedDebtor.mobile,
            medicalIsDiabetes: updatedDebtor.medicalIsDiabetes,
            medicalIsHypertension: updatedDebtor.medicalIsHypertension,
            medicalOthers: updatedDebtor.medicalOthers,
            ocularIsSquint: updatedDebtor.ocularIsSquint,
            ocularIsLazyEye: updatedDebtor.ocularIsLazyEye,
            ocularHasSurgery: updatedDebtor.ocularHasSurgery,
            ocularOthers:updatedDebtor.ocularOthers,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Debtor saved successfully!" });
  
          await fetchDebtors(); 
          setIsPopupOpen(false); 
        } else {
          throw new Error(data.errorMessage || "Failed to save debtor.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving debtor", message: error.message });
      } finally {
        setLoading(false);
      }
    });
    setIsConfirmOpen(true);
  };
  
  const handleDelete = (debtorId) => {
    const confirmMessage = `Are you sure you want to delete the debtor?`;
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Debtor/Delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            id: debtorId, 
            userId: userId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Debtor deleted successfully!" });
  
          await fetchDebtors(); 
        } else {
          throw new Error(data.errorMessage || "Failed to delete debtor.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting debtor", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setConfirmMessage(confirmMessage);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setIsConfirmOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: ""});
  };

  const handleOpenEyePowerModal = async (debtor, type) => {
    try {
        const getApiUrl =
            type === "Glass"
                ? "https://optikposbackend.absplt.com/EyePower/GetGlasss"
                : "https://optikposbackend.absplt.com/EyePower/GetContactLenss";

        const newApiUrl =
            type === "Glass"
                ? "https://optikposbackend.absplt.com/EyePower/NewGlass"
                : "https://optikposbackend.absplt.com/EyePower/NewContactLens";

        const searchResponse = await fetch(getApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId: Number(customerId),
                keyword: debtor.eyePowerId || "",  
                offset: 0,
                limit: 10
            }),
        });

        const searchData = await searchResponse.json();
        if (searchData.success && searchData.data.length > 0) {
            const foundEyePower = searchData.data[0];

            const editResponse = await fetch("https://optikposbackend.absplt.com/EyePower/Edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerId: Number(customerId),
                    userId: userId,
                    id: foundEyePower.eyePowerId,  
                }),
            });

            const editData = await editResponse.json();
            if (editData.success) {
                setSelectedEyePower(editData.data);
                setEyePowerType(type);
                setIsEyePowerOpen(true);
                return;
            }
        }

        const newResponse = await fetch(newApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customerId: Number(customerId),
                userId: userId,
                id: "",  
            }),
        });

        const newData = await newResponse.json();
        if (newData.success) {
            setSelectedEyePower({ ...newData.data, debtorId: debtor.debtorId });
            setEyePowerType(type);
            setIsEyePowerOpen(true);
        } else {
            throw new Error(newData.errorMessage || "Failed to create new Eye Power record.");
        }
    } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Fetching Eye Power", message: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleSaveEyePower = async (updatedEyePower) => {
    try {
      setLoading(true);
      const response = await fetch("https://optikposbackend.absplt.com/EyePower/Save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          actionData: {
            customerId: customerId,
            userId: userId,
            id: updatedEyePower.eyePowerId,
          },
          ...updatedEyePower,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccessModal({ isOpen: true, title: "Eye Power saved successfully!" });
        setIsEyePowerOpen(false);
      } else {
        throw new Error(result.errorMessage || "Failed to save Eye Power.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Saving Eye Power", message: error.message });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span className="back-link" onClick={() => navigate("/maintenance")}>
          Maintenance
        </span>
        <span> / Debtor Maintenance</span>
      </div>
      
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        onClose={closeSuccessModal}
      />
       <div className="search-container">
        <input
          type="text"
          placeholder="Search by Company Name, Debtor Code, or Mobile"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="search-input"
        />
        </div>

        <div className="maintenance-header">
          <div className="pagination-controls">
            <label>
              Show:
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              items per page
            </label>
          </div>
          {debtorMaintenanceRights.add && (
          <button className="add-button" onClick={() => handleOpenModal({}, "Add Debtor")}>
            Add Debtor
          </button>
        )}
        </div>
        {loading ? (
        <p>Loading...</p>
      ) : (
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Company Name</th>
                <th>Debtor Code</th>
                <th>Debtor Type Code</th>
                <th>Mobile</th>
                {debtorMaintenanceRights.edit && (
                  <th>Contact Lens Eye Power</th>
                )}
                {debtorMaintenanceRights.edit && (
                <th>Glasses Eye Power</th>
                )}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {debtors.map((debtor, index) => (
                <tr key={debtor.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{debtor.companyName || "-"}</td>
                  <td>{debtor.debtorCode || "-"}</td>
                  <td>{debtorTypeOptions.find(type => type.value === debtor.debtorTypeId)?.label || "-"}</td>
                  <td>{debtor.mobile || "-"}</td>
                  {debtorMaintenanceRights.edit && (
                  <td className="eye-power">
                    <button className="eye-power-button" onClick={() => handleOpenEyePowerModal(debtor, "Contact Lens")}>
                      <MdVisibility  /> 
                    </button>
                  </td>
                  )}
                  {debtorMaintenanceRights.edit && (
                  <td className="eye-power">
                    <button className="eye-power-button" onClick={() => handleOpenEyePowerModal(debtor, "Glass")}>
                      <FaGlasses /> 
                    </button>
                  </td>
                  )}
                  <td>
                  {debtorMaintenanceRights.edit && (
                      <button onClick={() => handleOpenModal(debtor, "Edit Debtor")} className="action-button edit">
                        <FaEdit />
                      </button>
                    )}
                    {debtorMaintenanceRights.delete && (
                      <button onClick={() => handleDelete(debtor.debtorId)} className="action-button delete">
                        <FaTrash />
                      </button>
                    )}
                    {debtorMaintenanceRights.view && (
                      <button onClick={() => handleOpenModal(debtor, "View Debtor", true)} className="action-button view">
                        <FaEye />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage}
            </span>
            <button
              disabled={!totalRecords} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
          <DebtorModal
            isOpen={isPopupOpen}
            title={modalTitle}
            data={newDebtor}
            onClose={handleCloseModal}
            onSave={handleSave}
            isViewing={isViewing}
            debtorTypeOptions={debtorTypeOptions} 
          />
          <ConfirmationModal
            isOpen={isConfirmOpen}
            title="Confirm Action"
            message={confirmMessage}
            onConfirm={handleConfirmAction}
            onCancel={() => setIsConfirmOpen(false)}
          />
          <EyePowerModal
            isOpen={isEyePowerOpen}
            onClose={() => setIsEyePowerOpen(false)}
            eyePowerType={eyePowerType}
            data={selectedEyePower}
            onSave={handleSaveEyePower}
          />    
          </div>
  );
};

export default DebtorMaintenance;
