import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const CreditTypeMaintenance = () => {
  const [creditTypes, setCreditTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newCreditType, setNewCreditType] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
            { id: 1, type: "Credit A", typeId: "CT001", description: "Credit Description A" },
            { id: 2, type: "Credit B", typeId: "CT002", description: "Credit Description B" },
            { id: 3, type: "Credit C", typeId: "CT003", description: "Credit Description C" },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setCreditTypes(
            mockData.items.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
          setTotalPages(mockData.totalPages);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching credit types:", error);
        setErrorModal({
          isOpen: true,
          title: "Error Fetching Data",
          message: error.message,
        });
        setLoading(false);
      }
    };

    fetchData();

    setFields([
      { name: "type", label: "Credit Type", type: "text", required: true },
      { name: "typeId", label: "Credit Type ID", type: "text", required: true },
      { name: "description", label: "Description", type: "text", required: true },
    ]);
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewCreditType({ ...newCreditType, [name]: value });
  };

  const handleOpenModal = (creditType = {}, title = "", viewing = false) => {
    setNewCreditType(creditType);
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    if (isViewing) {
      setIsPopupOpen(false); // Close modal directly in viewing mode
      return;
    }

    setConfirmAction(() => () => {
      setIsPopupOpen(false); // Close the modal
    });

    setConfirmMessage("Are you sure you want to cancel and discard unsaved changes?");
    setIsConfirmOpen(true);
  };

  const handleSave = () => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedCreditTypes = newCreditType.id
            ? creditTypes.map((creditType) =>
                creditType.id === newCreditType.id ? { ...creditType, ...newCreditType } : creditType
              )
            : [...creditTypes, { ...newCreditType, id: creditTypes.length + 1 }];

          setCreditTypes(updatedCreditTypes);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newCreditType.id
        ? "Do you want to update this credit type?"
        : "Do you want to add this credit type?"
    );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setCreditTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage("Do you want to delete this credit type?");
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
          onClick={() => handleOpenModal({}, "Add Credit Type")}
        >
          Add Credit Type
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Credit Type</th>
              <th>Credit Type ID</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {creditTypes.map((type, index) => (
              <tr key={type.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{type.type}</td>
                <td>{type.typeId}</td>
                <td>{type.description}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(type, "Edit Credit Type")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(type, "View Credit Type", true)}
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
      <CrudModal
        isOpen={isPopupOpen}
        title={modalTitle}
        fields={fields}
        data={newCreditType}
        onClose={handleCloseModal}
        onSave={handleSave}
        onInputChange={handleInputChange}
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

export default CreditTypeMaintenance;
