import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const MemberTypeMaintenance = () => {
  const [memberTypes, setMemberTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newMemberType, setNewMemberType] = useState({});
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
            {
              id: 1,
              memberType: "Gold",
              memberTypeId: "MT001",
              currencyCode: "USD",
              memberPointSetting: 1,
            },
            {
              id: 2,
              memberType: "Silver",
              memberTypeId: "MT002",
              currencyCode: "EUR",
              memberPointSetting: 2,
            },
            {
              id: 3,
              memberType: "Broze",
              memberTypeId: "MT003",
              currencyCode: "MYR",
              memberPointSetting: 0.5,
            },
          ],
          totalPages: Math.ceil(2 / itemsPerPage),
        };

        setTimeout(() => {
          setMemberTypes(
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
      { name: "memberType", label: "Member Type", type: "text", required: true },
      { name: "memberTypeId", label: "Member Type ID", type: "text", required: true },
      { 
        label: "Currency Code", 
        name: "currencyCode",
        type: "select",
        options: [
          {label: "USD", value: "USD"},
          {label: "EUR", value: "EUR"},
          {label: "MYR", value: "MYR"},
        ],
        required: true
      }, 
      { name: "memberPointSetting", label: "Member Point Setting (RM 1 = ? points)", type: "number", required: true },
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
    setNewMemberType({ ...newMemberType, [name]: value });
  };

  const handleOpenModal = (memberType = {}, title = "", viewing = false) => {
    setNewMemberType(memberType);
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    if (isViewing) {
      setIsPopupOpen(false); // Directly close the modal in isViewing mode
      return;
    }

    setConfirmAction(() => () => {
      setIsPopupOpen(false); // Close the modal after confirmation
    });

    setConfirmMessage("Are you sure you want to cancel and discard unsaved changes?");
    setIsConfirmOpen(true);
  };

  const handleSave = () => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedMemberTypes = newMemberType.id
            ? memberTypes.map((memberType) =>
                memberType.id === newMemberType.id ? { ...memberType, ...newMemberType } : memberType
              )
            : [...memberTypes, { ...newMemberType, id: memberTypes.length + 1 }];

          setMemberTypes(updatedMemberTypes);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newMemberType.id 
      ? `Do you want to update this member type "${newMemberType.memberType}"?`
      : `Do you want to add this member type "${newMemberType.memberType}"?`
    );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const memberTypeToDelete = memberTypes.find((memberType) => memberType.id === id);
  
    if (!memberTypeToDelete) {
      console.error("Member Type not found");
      return;
    }

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setMemberTypes((prev) => prev.filter((memberType) => memberType.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(`Do you want to delete this member type "${memberTypeToDelete.memberType}"?`);
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
          onClick={() => handleOpenModal({}, "Add Member Type")}
        >
          Add Member Type
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Member Type</th>
              <th>Member Type ID</th>
              <th>Currency Code</th>
              <th>Member Point Setting</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {memberTypes.map((memberType, index) => (
              <tr key={memberType.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{memberType.memberType}</td>
                <td>{memberType.memberTypeId}</td>
                <td>{memberType.currencyCode}</td>
                <td>{memberType.memberPointSetting}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(memberType, "Edit Member Type")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(memberType.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() =>
                      handleOpenModal(memberType, "View Member Type", true)
                    }
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
        data={newMemberType}
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

export default MemberTypeMaintenance;
