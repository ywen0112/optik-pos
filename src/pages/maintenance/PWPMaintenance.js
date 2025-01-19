import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const PWPMaintenance = () => {
  const [pwps, setPWPs] = useState([]);
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newPWP, setNewPWP] = useState({});
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
        // Mock item data
        const mockItems = [
          { itemCode: "A001", itemName: "Item A1", price: 50 },
          { itemCode: "A002", itemName: "Item A2", price: 70 },
          { itemCode: "B001", itemName: "Item B1", price: 30 },
          { itemCode: "B002", itemName: "Item B2", price: 40 },
        ];

        // Mock PWP data
        const mockPWPs = [
          {
            id: 1,
            itemACode: "A001",
            itemBCode: "B001",
            totalPrice: 80,
          },
          {
            id: 2,
            itemACode: "A002",
            itemBCode: "B002",
            totalPrice: 110,
          },
        ];

        setTimeout(() => {
          setItems(mockItems);
          setPWPs(mockPWPs);
          setTotalPages(Math.ceil(mockPWPs.length / itemsPerPage));
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
      {
        name: "itemACode",
        label: "Item A Code",
        type: "select",
        options: [],
        required: true,
      },
      {
        name: "itemBCode",
        label: "Item B Code",
        type: "select",
        options: [],
        required: true,
      },
      {
        name: "totalPrice",
        label: "PWP Total Price",
        type: "number",
        readOnly: true,
      },
    ]);
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        ["itemACode", "itemBCode"].includes(field.name)
          ? {
              ...field,
              options: items.map((item) => ({
                label: `${item.itemName} (${item.itemCode})`,
                value: item.itemCode,
              })),
            }
          : field
      )
    );
  }, [items]);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const calculateTotalPrice = (itemACode, itemBCode) => {
    const itemA = items.find((item) => item.itemCode === itemACode);
    const itemB = items.find((item) => item.itemCode === itemBCode);
    return (itemA?.price || 0) + (itemB?.price || 0);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedPWP = { ...newPWP, [name]: value };

    if (name === "itemACode" || name === "itemBCode") {
      updatedPWP.totalPrice = calculateTotalPrice(
        updatedPWP.itemACode,
        updatedPWP.itemBCode
      );
    }

    setNewPWP(updatedPWP);
  };

  const handleOpenModal = (pwp = {}, title = "", viewing = false) => {
    setNewPWP(pwp);
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
          const updatedPWPs = newPWP.id
            ? pwps.map((pwp) =>
                pwp.id === newPWP.id ? { ...pwp, ...newPWP } : pwp
              )
            : [...pwps, { ...newPWP, id: pwps.length + 1 }];

          setPWPs(updatedPWPs);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(newPWP.id ? "Do you want to update this PWP?" : "Do you want to add this PWP?");
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setPWPs((prevPWPs) => prevPWPs.filter((pwp) => pwp.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage("Do you want to delete this PWP?");
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
          onClick={() => handleOpenModal({}, "Add PWP")}
        >
          Add PWP
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item A Code</th>
              <th>Item B Code</th>
              <th>PWP Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pwps.map((pwp, index) => (
              <tr key={pwp.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{pwp.itemACode}</td>
                <td>{pwp.itemBCode}</td>
                <td>{pwp.totalPrice}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(pwp, "Edit PWP")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pwp.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(pwp, "View PWP", true)}
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
        data={newPWP}
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

export default PWPMaintenance;
