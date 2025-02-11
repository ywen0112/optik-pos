import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye, FaSearch } from "react-icons/fa";
import CrudModal from "../../modals/CrudModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";

const UserMaintenance = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [locationMap, setLocationMap] = useState({}); 
  const [accessRights, setAccessRights] = useState([]); 
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
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");

  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
  //       });

  //       const data = await response.json();
  //       if (response.ok && data.success) {
  //         const locationMapping = {};
  //         data.data.forEach(location => {
  //           locationMapping[location.locationId] = location.locationCode;
  //         });
  //         setLocationMap(locationMapping);
  //       } else {
  //         throw new Error(data.errorMessage || "Failed to fetch locations.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching locations:", error);
  //     }
  //   };

  //   fetchLocations();
  // }, [customerId]);

  // /** 🔹 Fetch Access Rights */
  // useEffect(() => {
  //   const fetchAccessRights = async () => {
  //     try {
  //       const response = await fetch("https://optikposbackend.absplt.com/AccessRight/GetRecords", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
  //       });

  //       const data = await response.json();
  //       if (response.ok && data.success) {
  //         // ✅ Format access rights as dropdown options
  //         const accessRightsList = data.data.map(accessRight => ({
  //           value: accessRight.accessRightId, // Store AccessRightId as Value
  //           label: accessRight.description, // Show Description in Dropdown
  //         }));
  //         setAccessRights(accessRightsList);
  //       } else {
  //         throw new Error(data.errorMessage || "Failed to fetch access rights.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching access rights:", error);
  //     }
  //   };

  //   fetchAccessRights();
  // }, [customerId]);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("https://optikposbackend.absplt.com/Users/GetUsers", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({
  //           customerId: Number(customerId),
  //           keyword: "",
  //           offset: (currentPage - 1) * itemsPerPage,
  //           limit: itemsPerPage,
  //         }),
  //       });

  //       const data = await response.json();
  //       if (response.ok && data.success) {
  //         setUsers(data.data);
  //         setTotalPages(Math.ceil(data.data.length / itemsPerPage));
  //       } else {
  //         throw new Error(data.errorMessage || "Failed to fetch users.");
  //       }
  //     } catch (error) {
  //       setErrorModal({ isOpen: true, title: "Error Fetching Users", message: error.message });
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUsers();

  //   setFields([
  //     { name: "userName", label: "Username", type: "text", required: true },
  //     { name: "userEmail", label: "Email", type: "email", required: true },
  //     {
  //       name: "accessRightId",
  //       label: "User Role",
  //       type: "select",
  //       options: accessRights, // ✅ Use mapped access rights
  //       required: true,
  //     },
  //     {
  //       name: "locationId",
  //       label: "Location",
  //       type: "select",
  //       options: Object.keys(locationMap).map(locationId => ({
  //         label: locationMap[locationId], // Show locationCode
  //         value: locationId, // Store locationId
  //       })),
  //       required: true,
  //     },
  //   ]);
  // }, [currentPage, itemsPerPage, locationMap, accessRights]);

  useEffect(() => {
    fetchLocations();
    fetchAccessRights();
  }, [customerId]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage, searchKeyword]);

  const fetchLocations = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const locationMapping = {};
        data.data.forEach((location) => {
          locationMapping[location.locationId] = location.locationCode;
        });
        setLocationMap(locationMapping);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch locations.");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchAccessRights = async () => {
    try {
      const response = await fetch("https://optikposbackend.absplt.com/AccessRight/GetRecords", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        const accessRightsList = data.data.map((accessRight) => ({
          value: accessRight.accessRightId,
          label: accessRight.description,
        }));
        setAccessRights(accessRightsList);
      } else {
        throw new Error(data.errorMessage || "Failed to fetch access rights.");
      }
    } catch (error) {
      console.error("Error fetching access rights:", error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Users/GetUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: Number(customerId),
          keyword: searchKeyword,
          offset: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.data);
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch users.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching Users", message: error.message });
    } finally {
      setLoading(false);
    }
  };

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
  
    // Dynamically set fields based on Add/Edit mode
    const updatedFields = [
      { name: "userName", label: "Username", type: "text", required: true },
      { name: "userEmail", label: "Email", type: "email", required: true },
    ];
  
    // If editing, add additional fields
    if (user.userId) {
      updatedFields.push(
        {
          name: "accessRightId",
          label: "User Role",
          type: "select",
          options: accessRights, // ✅ Use mapped access rights
          required: true,
        },
        {
          name: "locationId",
          label: "Location Code",
          type: "select",
          options: Object.keys(locationMap).map(locationId => ({
            label: locationMap[locationId],
            value: locationId,
          })),
          required: true,
        }
      );
    }
  
    setFields(updatedFields);
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

  const handleSave = async () => {
    setConfirmAction(() => async () => {
      setLoading(true);
  
      try {
        if (!newUser.userId) {
          // 🔹 Register New User API Call
          const response = await fetch("https://optikposbackend.absplt.com/Users/RegisterUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: Number(customerId),
              userName: newUser.userName,
              userEmail: newUser.userEmail,
              editorUserId: userId, // 
            }),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
            setSuccessModal({ isOpen: true, title: "User added successfully!" });
  
            setUsers((prevUsers) => [...prevUsers, data.data]);
            setIsPopupOpen(false);
          } else {
            throw new Error(data.errorMessage || "Failed to register user.");
          }
        } else {
          // 🔹 Update Existing User API Call
          const response = await fetch("https://optikposbackend.absplt.com/Users/UpdateUser", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerId: Number(customerId),
              userId: newUser.userId,
              accessRightId: newUser.accessRightId,
              locationId: newUser.locationId,
            }),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
            setSuccessModal({ isOpen: true, title: "User updated successfully!" });
  
            // 🔹 Update user list with modified user details
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.userId === newUser.userId ? { ...user, ...newUser } : user
              )
            );
            setIsPopupOpen(false);
          } else {
            throw new Error(data.errorMessage || "Failed to update user.");
          }
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving User", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setConfirmMessage(newUser.userId ? `Do you want to update this user?` : `Do you want to add this user?`);
    setIsConfirmOpen(true);
  };  

  const handleDelete = (userId) => {
    const userToDelete = users.find((user) => user.userId === userId);
  
    if (!userToDelete) {
      console.error("User not found");
      return;
    }
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Users/DeleteUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            id: userToDelete.userId,
            userId: userId, 
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "User deleted successfully!" });
  
          setUsers((prevUsers) => prevUsers.filter((user) => user.userId !== userId));
        } else {
          throw new Error(data.errorMessage || "Failed to delete user.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting User", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setConfirmMessage(`Do you want to delete this user "${userToDelete.userName}"?`);
    setIsConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (confirmAction) confirmAction();
    setIsConfirmOpen(false);
  };

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  const closeSuccessModal = () => {
    setSuccessModal({ isOpen: false, title: "" });
  };

  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span className="back-link" onClick={() => navigate("/maintenance")}>
          Maintenance
        </span>
        <span> / User Maintenance</span>
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
      <div className="search-container">
          <input
            type="text"
            placeholder="Search by username or email"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
          />
        </div>

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
              <th>Username</th>
              <th>User Role</th>
              <th>Email</th>
              <th>Location Code</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.userId}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{user.userName}</td>
                <td>
                    {accessRights.find(ar => ar.value === user.accessRightId)?.label || "-"}
                  </td>                
                <td>{user.userEmail}</td>
                <td>{locationMap[user.locationId] || "-"}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(user, "Edit User")}
                    className="action-button edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.userId)}
                    className="action-button delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleOpenModal(user, "View User", true)}
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
