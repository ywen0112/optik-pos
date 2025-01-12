import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AccessRightCrudModal from "../../components/AccessRightCrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const AccessRightMaintenance = () => {
  const [roles, setRoles] = useState([]); // Local state for roles
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

  const mockRoles = [
    {
      id: 1,
      role: "Admin",
      accessRights: [
        { module: "Dashboard", permissions: ["Allow"] },
        { module: "User Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      ],
    },
    {
      id: 2,
      role: "User",
      accessRights: [
        { module: "Dashboard", permissions: ["Allow"] },
        { module: "User Maintenance", permissions: ["View"] },
      ],
    },
  ];

  // Initialize roles on component load
  useEffect(() => {
    setRoles(mockRoles);
    setTotalPages(Math.ceil(mockRoles.length / itemsPerPage));
  }, [itemsPerPage]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (role = {}, title = "", viewing = false) => {
    setNewRole({
      ...role,
      accessRights: role.accessRights || [],
    });
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  const handleSave = (updatedRole) => {
    setConfirmAction(() => async () => {
      setLoading(true);
      setTimeout(() => {
        try {
          if (updatedRole.id) {
            // Update existing role
            setRoles((prevRoles) =>
              prevRoles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
            );
          } else {
            // Add new role
            const newId = roles.length ? Math.max(...roles.map((role) => role.id)) + 1 : 1;
            setRoles((prevRoles) => [...prevRoles, { ...updatedRole, id: newId }]);
          }
          handleCloseModal();
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => async () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });
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
          onClick={() => handleOpenModal({ accessRights: [] }, "Add Role")}
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
