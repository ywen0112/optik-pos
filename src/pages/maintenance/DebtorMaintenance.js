import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import DebtorModal from "../../components/DebtorModal";
import ConfirmationModal from "../../components/ConfirmationModal";

const DebtorMaintenance = () => {
  const [debtors, setDebtors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newDebtor, setNewDebtor] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    const mockData = [
      {
        id: 1,
        name: "Yiwei Lee",
        debtorCode: "C001",
        debtorTypeId: "DT001",
        email: "yw@gmail.com",
        phoneNumber: "123456789",
        tin: "TIN12345",
        debtorInfo: {
          address1: "123 Main St",
          address2: "",
          address3: "",
          address4: "",
          postCode: "12345",
        },
        taxEntity: {
          ic: "IC001",
          nameOnIC: "Yiwei Lee",
        },
        latestRx: {
          spectacles: "SPH -2.5, CYL -1.0, AXIS 90",
          contactLens: "SPH -2.5, DIA 14.2",
          kReading: "Hm 7.5, Vm 7.2",
        },
      },
    ];
    setDebtors(mockData);
    setTotalPages(Math.ceil(mockData.length / itemsPerPage));
  }, [itemsPerPage]);

  const currentDebtors = debtors.slice(
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewDebtor({ ...newDebtor, [name]: value });
  };

  const handleOpenModal = (debtor = {}, title = "", viewing = false) => {
    setNewDebtor(debtor);
    setModalTitle(title);
    setIsViewing(viewing);
    setIsPopupOpen(true);
  };

  const handleCloseModal = () => {
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    const action = () => {
      if (newDebtor.id) {
        setDebtors(
          debtors.map((debtor) => (debtor.id === newDebtor.id ? newDebtor : debtor))
        );
      } else {
        setDebtors([...debtors, { ...newDebtor, id: debtors.length + 1 }]);
      }
      handleCloseModal();
    };

    handleOpenConfirmModal(action);
  };

  const handleDelete = (id) => {
    const action = () => {
      setDebtors(debtors.filter((debtor) => debtor.id !== id));
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
          onClick={() => handleOpenModal({}, "Add Debtor")}
        >
          Add Debtor
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Debtor Code</th>
            <th>Debtor Type ID</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>TIN</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDebtors.map((debtor, index) => (
            <tr key={debtor.id}>
              <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
              <td>{debtor.name}</td>
              <td>{debtor.debtorCode}</td>
              <td>{debtor.debtorTypeId}</td>
              <td>{debtor.email}</td>
              <td>{debtor.phoneNumber}</td>
              <td>{debtor.tin}</td>
              <td>
                <button
                  onClick={() => handleOpenModal(debtor, "Edit Debtor")}
                  className="action-button edit"
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(debtor.id)}
                  className="action-button delete"
                >
                  <FaTrash /> Delete
                </button>
                <button
                  onClick={() => handleOpenModal(debtor, "View Debtor", true)}
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
      <DebtorModal
        isOpen={isPopupOpen}
        title={modalTitle}
        data={newDebtor}
        onClose={handleCloseModal}
        onSave={handleSave}
        onInputChange={handleInputChange}
        isViewing={isViewing}
        onOpenConfirmModal={(callback) => {
          handleOpenConfirmModal(callback);
        }}
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

export default DebtorMaintenance;
