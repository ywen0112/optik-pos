import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CreditorModal from "../../modals/CreditorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";

const CreditorMaintenance = () => {
  const [creditors, setCreditors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newCreditor, setNewCreditor] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "" });
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");
  const [creditorTypeOptions, setCreditorTypeOptions] = useState([]);

    useEffect(() => {
      fetchCreditors();
    }, [currentPage, itemsPerPage]); 

    useEffect(() => {
      if (creditors.length > 0) {
        setTotalPages(Math.ceil(creditors.length / itemsPerPage)); // ✅ Correct calculation
      }
    }, [creditors, itemsPerPage]);

  useEffect(() => {
    const fetchCreditorTypes = async () => {
      try {
        const response = await fetch("https://optikposbackend.absplt.com/CreditorType/GetRecords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          const options = data.data.map(type => ({
            value: type.creditorTypeId,
            label: type.creditorTypeCode,
          }));
          setCreditorTypeOptions(options);
        } else {
          throw new Error(data.errorMessage || "Failed to fetch creditor types.");
        }
      } catch (error) {
        console.error("Error fetching creditor types:", error);
      }
    };

    fetchCreditorTypes();
  }, [customerId]);

  const fetchCreditors = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Creditor/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          keyword: "",
          offset: 0,
          limit: 9999,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setCreditors(data.data);
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch creditors.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Data", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = async (creditor = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Creditor") {
        const response = await fetch("https://optikposbackend.absplt.com/Creditor/New", {
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
          creditor = {
            creditorId: data.data.creditorId,
            creditorCode: data.data.creditorCode || "",
            companyName: data.data.companyName || "",
            creditorTypeId: data.data.creditorTypeId || "",
            address1: data.data.address1 || "",
            address2: data.data.address2 || "",
            address3: data.data.address3 || "",
            address4: data.data.address4 || "",
            postCode: data.data.postCode || "",
            phone1: data.data.phone1 || "",
            phone2: data.data.phone2 || "",
            mobile: data.data.mobile || "",
          };
        } else {
          throw new Error(data.errorMessage || "Failed to create new creditor.");
        }
      }
      
      else if ((title === "Edit Creditor" || title === "View Creditor") && creditor.creditorId) {
        const response = await fetch("https://optikposbackend.absplt.com/Creditor/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: creditor.creditorId, 
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          creditor = {
            creditorId: data.data.creditorId,
            creditorCode: data.data.creditorCode || "",
            companyName: data.data.companyName || "",
            creditorTypeId: data.data.creditorTypeId || "",
            address1: data.data.address1 || "",
            address2: data.data.address2 || "",
            address3: data.data.address3 || "",
            address4: data.data.address4 || "",
            postCode: data.data.postCode || "",
            phone1: data.data.phone1 || "",
            phone2: data.data.phone2 || "",
            mobile: data.data.mobile || "",
          };
        } else {
          throw new Error(data.errorMessage || "Failed to fetch creditor data.");
        }
      }

      setNewCreditor(creditor);
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
    setNewCreditor({});
    setIsPopupOpen(false);
  };

  const handleSave = (updatedCreditor) => {
    setConfirmMessage(`Do you want to save this creditor?`);
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Creditor/Save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId: userId,
              id: updatedCreditor.creditorId || updatedCreditor.id, 
            },
            creditorId: updatedCreditor.creditorId || updatedCreditor.id, 
            creditorCode: updatedCreditor.creditorCode,
            companyName: updatedCreditor.companyName,
            creditorTypeId: updatedCreditor.creditorTypeId,
            address1: updatedCreditor.address1,
            address2: updatedCreditor.address2,
            address3: updatedCreditor.address3,
            address4: updatedCreditor.address4,
            postCode: updatedCreditor.postCode,
            phone1: updatedCreditor.phone1,
            phone2: updatedCreditor.phone2,
            mobile: updatedCreditor.mobile,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Creditor saved successfully!" });
  
          await fetchCreditors(); 
          setIsPopupOpen(false); 
        } else {
          throw new Error(data.errorMessage || "Failed to save Creditor.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving Creditor", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setIsConfirmOpen(true); 
  };

  const handleDelete = (creditorId) => {
    const confirmMessage = `Are you sure you want to delete the creditor?`;
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Creditor/Delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            id: creditorId, 
            userId: userId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Creditor deleted successfully!" });
  
          await fetchCreditors(); 
        } else {
          throw new Error(data.errorMessage || "Failed to delete creditor.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting Creditor", message: error.message });
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
    setSuccessModal({ isOpen: false, title: "" });
  };

  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span className="back-link" onClick={() => navigate("/maintenance")}>
          Maintenance
        </span>
        <span> / Creditor Maintenance</span>
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
        <button
          className="add-button"
          onClick={() => handleOpenModal({}, "Add Creditor")}
        >
          Add Creditor
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Creditor Code</th>
              <th>Creditor Type Code</th>
              <th>Company Name</th>
              <th>Mobile</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {creditors.map((creditor, index) => (
              <tr key={creditor.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{creditor.creditorCode || "-"}</td>
                <td>{creditorTypeOptions.find(type => type.value === creditor.creditorTypeId)?.label || "-"}</td>
                <td>{creditor.companyName || "-"}</td>
                <td>{creditor.mobile || "-"}</td>
                 <td>
                  <button
                    onClick={() => handleOpenModal(creditor, "Edit Creditor")}
                    className="action-button edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(creditor.creditorId)}
                    className="action-button delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() =>
                      handleOpenModal(creditor, "View Creditor", true)
                    }
                    className="action-button view"
                  >
                    <FaEye />
                  </button>
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
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
      <CreditorModal isOpen={isPopupOpen} title={modalTitle} data={newCreditor} onClose={handleCloseModal} onSave={handleSave} isViewing={isViewing} creditorTypeOptions={creditorTypeOptions} />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Action"
        message={confirmMessage}
        onConfirm={handleConfirmAction}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default CreditorMaintenance;
