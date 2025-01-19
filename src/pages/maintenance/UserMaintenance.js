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
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
            { id: 1, name: "John Doe", role: "Super Admin", email: "john.doe@example.com", locationId: "L001" },
            { id: 2, name: "Jane Smith", role: "User", email: "jane.smith@example.com", locationId: "L002" },
            { id: 3, name: "Alice Johnson", role: "Admin", email: "alice.johnson@example.com", locationId: "L003" },
            { id: 4, name: "Bob Brown", role: "Admin", email: "bob.brown@example.com", locationId: "L004" },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setUsers(
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
      {
        name: "locationId",
        label: "Location ID",
        type: "select",
        options: [
          { label: "L001", value: "L001" },
          { label: "L002", value: "L002" },
          { label: "L003", value: "L003" },
          { label: "L004", value: "L004" },
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
    if (isViewing) {
      setIsPopupOpen(false); // Close modal immediately in viewing mode
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
          const updatedUsers = newUser.id
            ? users.map((user) =>
                user.id === newUser.id ? { ...user, ...newUser } : user
              )
            : [...users, { ...newUser, id: users.length + 1 }];

          setUsers(updatedUsers);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(newUser.id ? "Do you want to update this user?" : "Do you want to add this user?");
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage("Do you want to delete this user?");
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
              <th>Location ID</th>
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
                <td>{user.locationId}</td>
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
                  >
                    <FaTrash /> Delete
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
