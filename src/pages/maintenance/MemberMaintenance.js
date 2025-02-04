import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import MemberModal from "../../modals/MemberModal";

const MemberMaintenance = () => {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newMember, setNewMember] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
            {
              id: 1,
              memberCode: "M001",
              memberName: "John",
              memberTypeId: "MT001",
              mobile: "1234567890",
              emailAddress: "john.doe@example.com",
              address: "123 Main St",
              postcode: "12345",
              currencyCode: "USD",
              memberPoint: 150,
            },
            {
              id: 2,
              memberCode: "M002",
              memberName: "Jane",
              memberTypeId: "MT002",
              mobile: "0987654321",
              emailAddress: "jane.smith@example.com",
              address: "456 Elm St",
              postcode: "54321",
              currencyCode: "EUR",
              memberPoint: 200,
            },
          ],
          totalPages: Math.ceil(2 / itemsPerPage),
        };

        setTimeout(() => {
          setMembers(
            mockData.items.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )
          );
          setTotalPages(mockData.totalPages);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching members:", error);
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
      { name: "memberCode", label: "Member Code", type: "text", required: true },
      { name: "memberName", label: "Member Name", type: "text", required: true },
      {
        name: "memberTypeId",
        label: "Member Type ID",
        type: "select",
        options: [
          { label: "MT001", value: "MT001" },
          { label: "MT002", value: "MT002" },
          { label: "MT003", value: "MT003" },
        ],
        required: true,
      },
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
      { name: "mobile", label: "Mobile", type: "text", required: true },
      { name: "emailAddress", label: "Email Address", type: "email", required: true },
      { name: "address", label: "Address", type: "text", required: true },
      { name: "postcode", label: "Postcode", type: "text", required: true },
      { name: "memberPoint", label: "Member Point", type: "number", required: true },
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
    setNewMember({ ...newMember, [name]: value });
  };

  const handleOpenModal = (member = {}, title = "", viewing = false) => {
    setNewMember(member);
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

  const handleSave = () => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          const updatedMembers = newMember.id
            ? members.map((member) =>
                member.id === newMember.id ? { ...member, ...newMember } : member
              )
            : [...members, { ...newMember, id: members.length + 1 }];

          setMembers(updatedMembers);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newMember.id
        ? `Do you want to update this member "${newMember.memberName}"?`
      : `Do you want to add this member "${newMember.memberName}"?`
    );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const memberToDelete = members.find((member) => member.id === id);
  
    if (!memberToDelete) {
      console.error("Member not found");
      return;
    }

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setMembers((prevMembers) => prevMembers.filter((member) => member.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(`Do you want to delete this member "${memberToDelete.memberName}"?`);
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
      <div className="breadcrumb">
        <span className="back-link" onClick={() => navigate("/maintenance")}>
          Maintenance
        </span>
        <span> / Member Maintenance</span>
      </div>
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
          onClick={() => handleOpenModal({}, "Add Member")}
        >
          Add Member
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Member Code</th>
              <th>Member Name</th>
              <th>Member Type ID</th>
              <th>Mobile</th>
              <th>Email Address</th>
              <th>Currency Code</th>
              <th>Member Point</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{member.memberCode}</td>
                <td>{member.memberName}</td>
                <td>{member.memberTypeId}</td>
                <td>{member.mobile}</td>
                <td>{member.emailAddress}</td>
                <td>{member.currencyCode}</td>
                <td>{member.memberPoint}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(member, "Edit Member")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(member, "View Member", true)}
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
      <MemberModal
        isOpen={isPopupOpen}
        title={modalTitle}
        fields={fields}
        data={newMember}
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

export default MemberMaintenance;
