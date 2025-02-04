import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import DebtorModal from "../../modals/DebtorModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";

const DebtorMaintenance = () => {
  const [debtors, setDebtors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newDebtor, setNewDebtor] = useState({});
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
              emailAddress: "john.doe@example.com",
              mobile: "1234567890",
              debtorCode: "D001",
              debtorName: "John Doe",
              debtorTypeId: "DT001",
              address1: "123 Main St",
              postCode: "12345",
              deliverAddr1: "123 Main St",
              deliverPostCode: "12345",
              locationId: "L001",
              salesAgent: "Agent1",
              currencyCode: "USD",
              ic: "123456789",
              nameOnIC: "John Doe",
              tin: "TIN123456",
            },
            {
              id: 2,
              emailAddress: "jane.smith@example.com",
              mobile: "0987654321",
              debtorCode: "D002",
              debtorName: "Jane Smith",
              debtorTypeId: "DT002",
              address1: "456 Elm St",
              postCode: "54321",
              deliverAddr1: "456 Elm St",
              deliverPostCode: "54321",
              locationId: "L002",
              salesAgent: "Agent2",
              currencyCode: "EUR",
              ic: "987654321",
              nameOnIC: "Alice Smith",
              tin: "TIN987654",
            },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };
  
        // Simulate fetching data
        setTimeout(() => {
          setDebtors(
            mockData.items.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
          setTotalPages(mockData.totalPages);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching debtors:", error);
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

  const handleOpenModal = (debtor = {}, title = "", viewing = false) => {
    setNewDebtor({ ...debtor });
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setNewDebtor({});
    setIsPopupOpen(false);
  };

  const handleSave = (updatedDebtor) => {
    const confirmMessage = updatedDebtor.id
      ? `Are you sure you want to update the debtor "${updatedDebtor.debtorName}"?`
      : `Are you sure you want to add the debtor "${updatedDebtor.debtorName}"?`;
  
    setConfirmAction(() => async () => {
      setLoading(true); // Show loading spinner
      setTimeout(() => {
        try {
          const updatedData = {
            ...updatedDebtor,
            id: updatedDebtor.id || new Date().getTime(),
          };
  
          if (updatedDebtor.id) {
            // Update existing debtor
            setDebtors((prev) =>
              prev.map((debtor) =>
                debtor.id === updatedDebtor.id ? updatedData : debtor
              )
            );
          } else {
            // Add new debtor
            setDebtors((prev) => [...prev, updatedData]);
          }
          handleCloseModal(); // Close the modal after saving
        } catch (error) {
          console.error("Error saving debtor:", error);
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false); // Hide loading spinner
        }
      }, 500); // Simulate asynchronous operation
    });
  
    setConfirmMessage(confirmMessage); // Set custom confirmation message
    setIsConfirmOpen(true); // Open confirmation modal
  };
  
  const handleDelete = (id) => {
    const debtorToDelete = debtors.find((debtor) => debtor.id === id);
    const confirmMessage = `Are you sure you want to delete the debtor "${debtorToDelete?.debtorName}"?`;
  
    setConfirmAction(() => async () => {
      setLoading(true); // Show loading spinner
      setTimeout(() => {
        try {
          setDebtors((prev) => prev.filter((debtor) => debtor.id !== id)); // Delete debtor by ID
        } catch (error) {
          console.error("Error deleting debtor:", error);
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false); // Hide loading spinner
        }
      }, 500); // Simulate asynchronous operation
    });
  
    setConfirmMessage(confirmMessage); // Set custom confirmation message
    setIsConfirmOpen(true); // Open confirmation modal
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
        <span> / Debtor Maintenance</span>
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
            onClick={() => handleOpenModal({}, "Add Debtor")}
          >
            Add Debtor
          </button>
        </div>
        {loading ? (
        <p>Loading...</p>
      ) : (
          <table className="table">
            <thead>
              <tr>
                <th>No</th>
                <th>Debtor Name</th>
                <th>Debtor Code</th>
                <th>Debtor Type ID</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>TIN</th>
                <th>Location ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {debtors.map((debtor, index) => (
                <tr key={debtor.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{debtor.debtorName || "-"}</td>
                  <td>{debtor.debtorCode || "-"}</td>
                  <td>{debtor.debtorTypeId || "-"}</td>
                  <td>{debtor.emailAddress || "-"}</td>
                  <td>{debtor.mobile || "-"}</td>
                  <td>{debtor.tin || "-"}</td>
                  <td>{debtor.locationId || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleOpenModal(debtor, "Edit Debtor")}
                      className="action-button edit"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(debtor.id)}
                      className="action-button delete"
                    >
                      <FaTrash /> Delete
                    </button>
                    <button
                      onClick={() =>
                        handleOpenModal(debtor, "View Debtor", true)
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
          <DebtorModal
            isOpen={isPopupOpen}
            title={modalTitle}
            data={newDebtor}
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

export default DebtorMaintenance;
