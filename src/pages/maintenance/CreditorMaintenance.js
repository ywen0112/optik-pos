import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CreditorModal from "../../modals/CreditorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";

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
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
            {
              id: 1,
              creditorCode: "C001",
              creditorTypeId: "CT001",
              companyName: "ABC Corp",
              registerNo: "202005123456",
              isGroupCompany: true,
              mobile: "1234567890",
              emailAddress: "abc@corporate.com",
              fax1: "123456789",
              address1: "1 FerSelim Ltd",
              postcode: "46300",
              locationId: "L001",
              attention: "ABC",
              natureOfBusiness: "Corporation",
              purchaseAgent: "Lily",
              currencyCode: "USD",
              displayTerm: "glasses",
              tin: "C208305702101",
            },
            {
              id: 2,
              creditorCode: "C002",
              creditorTypeId: "CT002",
              companyName: "XYZ Ltd",
              registerNo: "202105123456",
              isGroupCompany: false,
              mobile: "0987654321",
              emailAddress: "xyz@corporate.com",
              fax1: "0987654321",
              address1: "25 Wilayah KL",
              postcode: "46300",
              locationId: "L002",
              attention: "XYZ",
              natureOfBusiness: "Corporation",
              purchaseAgent: "Lauren",
              currencyCode: "EUR",
              displayTerm: "glasses",
              tin: "C238305702102",
            },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setCreditors(
            mockData.items.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
          setTotalPages(mockData.totalPages);
          setLoading(false);
        }, 500);
      } catch (error) {
        setErrorModal({
          isOpen: true,
          title: "Error Fetching Data",
          message: error.message,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (creditor = {}, title = "", viewing = false) => {
    setNewCreditor({ ...creditor });
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  const handleSave = (updatedCreditor) => {
    const confirmMessage = updatedCreditor.id
      ? `Do you want to update the creditor "${updatedCreditor.companyName}"?`
      : `Do you want to add the creditor "${updatedCreditor.companyName}"?`;

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedCreditors = updatedCreditor.id
            ? creditors.map((creditor) =>
                creditor.id === updatedCreditor.id
                  ? { ...creditor, ...updatedCreditor }
                  : creditor
              )
            : [...creditors, { ...updatedCreditor, id: creditors.length + 1 }];

          setCreditors(updatedCreditors);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(confirmMessage);
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const creditorToDelete = creditors.find((creditor) => creditor.id === id);
    const confirmMessage = `Do you want to delete the creditor "${creditorToDelete?.companyName}"?`;

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setCreditors((prev) => prev.filter((creditor) => creditor.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
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
              <th>Creditor Type ID</th>
              <th>Company Name</th>
              <th>Mobile</th>
              <th>Email Address</th>
              <th>Location ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {creditors.map((creditor, index) => (
              <tr key={creditor.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{creditor.creditorCode || "-"}</td>
                <td>{creditor.creditorTypeId || "-"}</td>
                <td>{creditor.companyName || "-"}</td>
                <td>{creditor.mobile || "-"}</td>
                <td>{creditor.emailAddress || "-"}</td>
                <td>{creditor.locationId || "-"}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(creditor, "Edit Creditor")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(creditor.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() =>
                      handleOpenModal(creditor, "View Creditor", true)
                    }
                    className="action-button view"
                  >
                    <FaEye /> View
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
      <CreditorModal
        isOpen={isPopupOpen}
        title={modalTitle}
        data={newCreditor}
        onClose={handleCloseModal}
        onSave={handleSave}
        isViewing={isViewing}
      />
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
