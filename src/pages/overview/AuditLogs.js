import React, { useEffect, useState } from "react";
import "../../css/AuditLogs.css";
import ErrorModal from "../../modals/ErrorModal"; // Assuming ErrorModal is in the components folder

const AuditLogs = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data to simulate API response
        const mockData = {
          items: [
            { id: 1, dateTime: "2025-01-01 10:00:00", actionType: "Login", name: "John Doe", role: "Admin" },
            { id: 2, dateTime: "2025-01-01 10:05:00", actionType: "Logout", name: "Jane Smith", role: "User" },
            { id: 3, dateTime: "2025-01-01 10:10:00", actionType: "Debtor Update", name: "Alice Johnson", role: "Admin" },
            { id: 4, dateTime: "2025-01-01 10:15:00", actionType: "Debtor Type Delete", name: "Bob Brown", role: "Admin" },
            { id: 5, dateTime: "2025-01-01 10:20:00", actionType: "User Create", name: "Charlie White", role: "Super Admin" },
            { id: 6, dateTime: "2025-01-01 10:25:00", actionType: "Transaction", name: "David Black", role: "Admin" },
            { id: 7, dateTime: "2025-01-01 10:30:00", actionType: "Transaction", name: "Ella Green", role: "Admin" },
          ],
          totalPages: 2,
        };

        // Simulate fetching data
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
        console.error("Error fetching audit logs:", error);
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

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Close the error modal
  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  return (
    <div className="audit-maintenance-container">
      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />

      {/* <div className="audit-header">
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

      <div className="audit-table-container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="audit-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Date Time</th>
                <th>Action Type</th>
                <th>Name</th>
                <th>User Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{user.dateTime}</td>
                  <td>{user.actionType}</td>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
      </div> */}

      <label>In Mantenance</label>
    </div>
  );
};

export default AuditLogs;
