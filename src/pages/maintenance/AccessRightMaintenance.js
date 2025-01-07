import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AccessRightCrudModal from "../../components/AccessRightCrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/access-rights");
        const data = await response.json();

        // Ensure each role has an id
        const rolesWithIds = data.map((role, index) => ({
          ...role,
          id: role.id || index + 1,
        }));

        setRoles(rolesWithIds);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (error) {
        console.error("Error fetching access rights:", error);
      }
    };

    fetchData();
  }, [itemsPerPage]);

  const currentRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const handleSave = (updatedRole) => {
    const action = () => {
      if (updatedRole.id) {
        // Edit existing role
        setRoles((prevRoles) =>
          prevRoles.map((role) =>
            role.id === updatedRole.id ? updatedRole : role
          )
        );
      } else {
        // Add new role
        setRoles((prevRoles) => [
          ...prevRoles,
          { ...updatedRole, id: prevRoles.length + 1 },
        ]);
      }
      handleCloseModal();
    };

    handleOpenConfirmModal(action);
  };

  const handleDelete = (id) => {
    const action = () => {
      setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
    };

    handleOpenConfirmModal(action);
  };

  const handleOpenConfirmModal = (action) => {
    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setIsConfirmOpen(false);
  };

  return (
    <div className="maintenance-container">
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
