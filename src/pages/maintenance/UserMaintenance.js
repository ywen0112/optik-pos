import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const UserMaintenance = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newUser, setNewUser] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(""); // Message for the modal
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [actionLoading, setActionLoading] = useState(false); // Action-specific loading state

  const mockUsers = [
    { id: 1, name: "John Doe", role: "Admin", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", role: "User", email: "jane.smith@example.com" },
    { id: 3, name: "Alice Johnson", role: "Admin", email: "alice.johnson@example.com" },
    { id: 4, name: "Bob Brown", role: "Admin", email: "bob.brown@example.com" },
    { id: 5, name: "Charlie White", role: "User", email: "charlie.white@example.com" },
    { id: 6, name: "David Black", role: "Admin", email: "david.black@example.com" },
  ];

  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      setTimeout(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedUsers = mockUsers.slice(startIndex, startIndex + itemsPerPage);
        setUsers(paginatedUsers);
        setTotalPages(Math.ceil(mockUsers.length / itemsPerPage));
        setLoading(false);
      }, 500);
    };

    fetchUsers();

    setFields([
      { name: "name", label: "Name", type: "text", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "role",
        label: "User Role",
        type: "select",
        options: [
          { label: "Admin", value: "Admin" },
          { label: "User", value: "User" },
          { label: "Super Admin", value: "Super Admin" },
        ],
        required: true,
      },
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
    setNewUser({ ...newUser, [name]: value });
  };

  const handleOpenModal = (user = {}, title = "", viewing = false) => {
    setNewUser(user);
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    setConfirmAction(() => performSave); // Set save as confirm action
    setConfirmMessage(newUser.id ? "Do you want to update this user?" : "Do you want to add this user?");
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const performSave = () => {
    setActionLoading(true); // Start loading
    setTimeout(() => {
      try {
        if (newUser.id) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === newUser.id ? { ...user, ...newUser } : user
            )
          );
        } else {
          setUsers((prevUsers) => [
            ...prevUsers,
            { ...newUser, id: users.length + 1 },
          ]);
        }
        handleCloseModal();
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error", message: error.message });
      } finally {
        setActionLoading(false); // Stop loading
      }
    }, 1000); // Simulate async action
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => performDelete(id)); // Set delete as confirm action
    setConfirmMessage("Do you want to delete this user?");
    setIsConfirmOpen(true); // Open confirmation modal
  };

  const performDelete = (id) => {
    setActionLoading(true); // Start loading
    setTimeout(() => {
      try {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error", message: error.message });
      } finally {
        setActionLoading(false); // Stop loading
      }
    }, 1000); // Simulate async action
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
          onClick={() => handleOpenModal({}, "Add User")}
        >
          Add User
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>User Role</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(user, "Edit User")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="action-button delete"
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Processing..." : <><FaTrash /> Delete</>}
                  </button>
                  <button
                    onClick={() => handleOpenModal(user, "View User", true)}
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
        data={newUser}
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

export default UserMaintenance;

