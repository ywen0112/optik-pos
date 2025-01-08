import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AccessRightCrudModal from "../../components/AccessRightCrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const AccessRightMaintenance = () => {
  const [roles, setRoles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newRole, setNewRole] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/access-rights?page=${currentPage}&itemsPerPage=${itemsPerPage}`);
      if (!response.ok) {
        throw new Error("Failed to fetch roles.");
      }
      const data = await response.json();
      setRoles(data.items || []); // Assuming the API returns `items`
      setTotalPages(data.totalPages || 1); // Assuming the API returns `totalPages`
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (role = {}, title = "", viewing = false) => {
    setNewRole(role);
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  const handleSave = async (updatedRole) => {
    try {
      const method = updatedRole.id ? "PUT" : "POST";
      const endpoint = updatedRole.id ? `/api/access-rights/${updatedRole.id}` : `/api/access-rights`;
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRole),
      });

      if (!response.ok) {
        throw new Error(updatedRole.id ? "Failed to update role." : "Failed to add role.");
      }

      await fetchRoles(); // Refresh the table
      handleCloseModal(); // Close modal after successful operation
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error", message: error.message });
    }
  };

  const handleDelete = async (id) => {
    const action = async () => {
      try {
        const response = await fetch(`/api/access-rights/${id}`, { method: "DELETE" });
        if (!response.ok) {
          throw new Error("Failed to delete role.");
        }
        await fetchRoles(); // Refresh the table after deletion
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error", message: error.message });
      }
    };

    handleOpenConfirmModal(action);
  };

  const handleOpenConfirmModal = (action) => {
    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (confirmAction) await confirmAction();
    setIsConfirmOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const currentRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          onClick={() => handleOpenModal({}, "Add Role")}
        >
          Add Role
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>User Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRoles.map((role, index) => (
              <tr key={role.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{role.role}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(role, "Edit Role")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(role, "View Role", true)}
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
      <AccessRightCrudModal
        isOpen={isPopupOpen}
        title={modalTitle}
        data={newRole}
        onClose={handleCloseModal}
        onSave={handleSave}
        isViewing={isViewing}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        onConfirm={handleConfirmAction}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default AccessRightMaintenance;
