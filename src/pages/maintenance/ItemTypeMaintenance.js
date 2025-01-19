import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const ItemTypeMaintenance = () => {
  const [itemTypes, setItemTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newItemType, setNewItemType] = useState({});
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
              itemTypeName: "Electronics",
              itemTypeId: "IT001",
              itemTypeDescription: "Electronics category",
              locationId: "L001",
              commissionPoint: 5.0,
            },
            {
              id: 2,
              itemTypeName: "Furniture",
              itemTypeId: "IT002",
              itemTypeDescription: "Furniture category",
              locationId: "L002",
              commissionPoint: 7.5,
            },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setItemTypes(
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
      { name: "itemTypeName", label: "Item Type Name", type: "text", required: true },
      { name: "itemTypeId", label: "Item Type ID", type: "text", required: true },
      { name: "itemTypeDescription", label: "Item Type Description", type: "textarea", required: true },
      {
        name: "locationId",
        label: "Location ID",
        type: "select",
        options: [
          { label: "L001", value: "L001" },
          { label: "L002", value: "L002" },
          { label: "L003", value: "L003" },
        ],
        required: true,
      },
      { name: "commissionPoint", label: "Commission Point", type: "number", required: true },
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
    setNewItemType({ ...newItemType, [name]: value });
  };

  const handleOpenModal = (itemType = {}, title = "", viewing = false) => {
    setNewItemType(itemType);
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
          const updatedItemTypes = newItemType.id
            ? itemTypes.map((type) =>
                type.id === newItemType.id ? { ...type, ...newItemType } : type
              )
            : [...itemTypes, { ...newItemType, id: itemTypes.length + 1 }];

          setItemTypes(updatedItemTypes);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(newItemType.id ? "Do you want to update this item type?" : "Do you want to add this item type?");
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setItemTypes((prevTypes) => prevTypes.filter((type) => type.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage("Do you want to delete this item type?");
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
          onClick={() => handleOpenModal({}, "Add Item Type")}
        >
          Add Item Type
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item Type Name</th>
              <th>Item Type ID</th>
              <th>Item Type Description</th>
              <th>Location ID</th>
              <th>Commission Point</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemTypes.map((type, index) => (
              <tr key={type.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{type.itemTypeName}</td>
                <td>{type.itemTypeId}</td>
                <td>{type.itemTypeDescription}</td>
                <td>{type.locationId}</td>
                <td>{type.commissionPoint}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(type, "Edit Item Type")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(type, "View Item Type", true)}
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
        data={newItemType}
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

export default ItemTypeMaintenance;
