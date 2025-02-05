import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import AccessRightCrudModal from "../../modals/AccessRightCrudModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";

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
  const [confirmMessage, setConfirmMessage] = useState("");
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
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
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setRoles(
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
    setNewRole({
      ...role,
      accessRights: role.accessRights || [],
    });
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    if (isViewing) {
      setIsPopupOpen(false); 
      return;
    }

    setConfirmAction(() => () => {
      setIsPopupOpen(false);
    });

    setConfirmMessage("Are you sure you want to cancel and discard unsaved changes?");
    setIsConfirmOpen(true);
  };

  const handleSave = (updatedRole) => {
    const confirmMessage = updatedRole.id
      ? `Are you sure you want to update the role "${updatedRole.role}"?`
      : `Are you sure you want to add the role "${updatedRole.role}"?`;

    setConfirmAction(() => async () => {
      setLoading(true);
      setTimeout(() => {
        try {
          if (updatedRole.id) {
            setRoles((prevRoles) =>
              prevRoles.map((role) => (role.id === updatedRole.id ? updatedRole : role))
            );
          } else {
            const newId = roles.length ? Math.max(...roles.map((role) => role.id)) + 1 : 1;
            setRoles((prevRoles) => [...prevRoles, { ...updatedRole, id: newId }]);
          }
          setSuccessModal({ isOpen: true, title: "Update Successfully! "})
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
    const roleToDelete = roles.find((role) => role.id === id);
    const confirmMessage = `Are you sure you want to delete the role "${roleToDelete?.role}"?`;

    setConfirmAction(() => async () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setRoles((prevRoles) => prevRoles.filter((role) => role.id !== id));
          setSuccessModal({ isOpen: true, title: "Update Successfully! "})
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

  const handleConfirmAction = async () => {
    if (confirmAction) await confirmAction();
    setIsConfirmOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: ""});
  };

  const currentRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span className="back-link" onClick={() => navigate("/maintenance")}>
          Maintenance
        </span>
        <span> / Access Right Maintenance</span>
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
                <td>{role.role || "-"}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(role, "Edit Role")}
                    className="action-button edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(role.id)}
                    className="action-button delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleOpenModal(role, "View Role", true)}
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
        message={confirmMessage}
        onConfirm={handleConfirmAction}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default AccessRightMaintenance;
