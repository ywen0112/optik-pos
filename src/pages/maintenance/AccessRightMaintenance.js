import React, { useEffect, useState, useMemo } from "react";
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
    fetchRoles();
  }, [currentPage, itemsPerPage]); // 🟢 Ensure this runs when page changes

  useEffect(() => {
    if (roles.length > 0) {
      setTotalPages(Math.ceil(roles.length / itemsPerPage)); // ✅ Correct calculation
    }
  }, [roles, itemsPerPage]);
  
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/AccessRight/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(localStorage.getItem("customerId")),
          keyword: "",
          offset: 0, 
          limit: 9999, 
        }),
      });
  
      const data = await response.json();
  
      if (response.ok && data.success) {
        setRoles(data.data); 
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch roles.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Fetching Data",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleOpenModal = async (role = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Role") {
        // ✅ Call "New" API when adding a new role
        const response = await fetch("https://optikposbackend.absplt.com/AccessRight/New", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(localStorage.getItem("customerId")),
            userId: localStorage.getItem("userId"),
            id: "",
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          role = {
            id: data.data.accessRightId,
            accessRightId: data.data.accessRightId,
            role: "", 
            accessRights: [],
          };
        } else {
          throw new Error(data.errorMessage || "Failed to create new access right.");
        }
      } 
      
      else if ((title === "Edit Role" || title === "View Role") && role.accessRightId) {
        const response = await fetch("https://optikposbackend.absplt.com/AccessRight/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(localStorage.getItem("customerId")),
            userId: localStorage.getItem("userId"),
            id: role.accessRightId, 
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          role = {
            id: data.data.accessRightId,
            accessRightId: data.data.accessRightId,
            role: data.data.description, 
            accessRights: data.data.accessRightActions.map((right) => ({
              module: right.module,
              permissions: [
                right.allow && "Allow",
                right.add && "Add",
                right.view && "View",
                right.edit && "Edit",
                right.delete && "Delete",
              ].filter(Boolean),
            })),
          };
        } else {
          throw new Error(data.errorMessage || "Failed to fetch role data.");
        }
      }
  
      setNewRole(role);
      setModalTitle(title);
      setIsViewing(viewing); 
      setIsPopupOpen(true);
      
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Opening Modal",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
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
    setConfirmMessage(`Do you want to save this role?`);
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/AccessRight/Save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(localStorage.getItem("customerId")),
              userId: localStorage.getItem("userId"),
              id: updatedRole.accessRightId || updatedRole.id, // ✅ Ensure correct ID
            },
            accessRightId: updatedRole.accessRightId || updatedRole.id, // ✅ Ensure the correct ID is passed
            description: updatedRole.role, 
            accessRightActions: updatedRole.accessRights.map((right) => ({
              module: right.module, 
              allow: right.permissions.includes("Allow"),
              add: right.permissions.includes("Add"),
              view: right.permissions.includes("View"),
              edit: right.permissions.includes("Edit"),
              delete: right.permissions.includes("Delete"),
            })),
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Access Right saved successfully!" });
  
          await fetchRoles(); 
          setIsPopupOpen(false); 
        } else {
          throw new Error(data.errorMessage || "Failed to save access right.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving Role", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setIsConfirmOpen(true); 
  };

  const handleDelete = (accessRightId) => {
    const roleToDelete = roles.find((role) => role.accessRightId === accessRightId);
    const confirmMessage = `Are you sure you want to delete the role "${roleToDelete?.description}"?`;
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/AccessRight/Delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(localStorage.getItem("customerId")),
            id: accessRightId, 
            userId: localStorage.getItem("userId"),
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Access Right deleted successfully!" });
  
          await fetchRoles(); 
        } else {
          throw new Error(data.errorMessage || "Failed to delete access right.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting Role", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setConfirmMessage(confirmMessage);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (confirmAction) {
      await confirmAction(); 
    }
    setIsConfirmOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: ""});
  };

  
  const currentRoles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return roles.slice(startIndex, endIndex); 
  }, [roles, currentPage, itemsPerPage]);

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
              <td>{role.description || "-"}</td> 
              <td>
                <button onClick={() => handleOpenModal(role, "Edit Role")} className="action-button edit">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(role.accessRightId)} className="action-button delete">
                  <FaTrash />
                </button>
                <button onClick={() => handleOpenModal(role, "View Role", true)} className="action-button view">
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
