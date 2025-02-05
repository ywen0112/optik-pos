import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../modals/CrudModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";

const ItemMaintenance = () => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newItem, setNewItem] = useState({});
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
              itemCode: "I001",
              itemName: "Widget A",
              batchNo: "0001436",
              itemTypeId: "IT001",
              itemGroupId: "IG001",
              itemDescription: "A high-quality widget",
              stockQuantity: 100,
              sellingPrice: 50.0,
              purchasePrice: 30.0,
              commissionType: "Rate",
              commissionValue: 5.0,
              locationId: "L001",
            },
            {
              id: 2,
              itemCode: "I002",
              itemName: "Gadget B",
              batchNo: "0001437",
              itemTypeId: "IT002",
              itemGroupId: "IG002",
              itemDescription: "A premium gadget",
              stockQuantity: 200,
              sellingPrice: 75.0,
              purchasePrice: 55.0,
              commissionType: "Amount",
              commissionValue: 20,
              locationId: "L002",
            },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setItems(
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
      { name: "itemCode", label: "Item Code", type: "text", required: true },
      { name: "itemName", label: "Item Name", type: "text", required: true },
      { name: "batchNo", label: "Batch No", type: "text", required: false },
      {
        name: "itemGroupId",
        label: "Item Group ID",
        type: "select",
        options: [
          { label: "IG001", value: "IG001" },
          { label: "IG002", value: "IG002" },
          { label: "IG003", value: "IG003" },
        ],
        required: true,
      },
      {
        name: "itemTypeId",
        label: "Item Type ID",
        type: "select",
        options: [
          { label: "IT001", value: "IT001" },
          { label: "IT002", value: "IT002" },
          { label: "IT003", value: "IT003" },
        ],
        required: true,
      },
      { name: "itemDescription", label: "Item Description", type: "textarea", required: true },
      { name: "stockQuantity", label: "Stock Quantity", type: "number", required: true },
      { name: "sellingPrice", label: "Selling Price", type: "number", required: true },
      { name: "purchasePrice", label: "Purchase Price", type: "number", required: true },
      {
        name: "commissionType",
        label: "Commission Type",
        type: "select",
        options: [
          { label: "Rate", value: "Rate" },
          { label: "Amount", value: "Amount" },
        ],
        required: true,
      },
      { name: "commissionValue", label: "Commission Value", type: "number", required: true },
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
    setNewItem({ ...newItem, [name]: value });
  };

  const handleOpenModal = (item = {}, title = "", viewing = false) => {
    setNewItem(item);
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
          const updatedItems = newItem.id
            ? items.map((item) =>
                item.id === newItem.id ? { ...item, ...newItem } : item
              )
            : [...items, { ...newItem, id: items.length + 1 }];

          setItems(updatedItems);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newItem.id
        ? `Do you want to update this item "${newItem.itemName}"?`
        : `Do you want to add this item "${newItem.itemName}"?`
    );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const itemToDelete = items.find((item) => item.id === id);

    if (!itemToDelete) {
      console.error("Item not found");
      return;
    }

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(`Do you want to delete this item "${itemToDelete.itemName}"?`);
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
        <span> / Item Maintenance/Batch No</span>
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
          onClick={() => handleOpenModal({}, "Add Item")}
        >
          Add Item
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Batch No</th>
              <th>Item Group ID</th>
              <th>Item Type ID</th>
              <th>Item Description</th>
              <th>Stock Quantity</th>
              <th>Selling Price</th>
              <th>Purchase Price</th>
              <th>Commission Type</th>
              <th>Commission Value</th>
              <th>Location ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{item.itemCode || "-"}</td>
                <td>{item.itemName || "-"}</td>
                <td>{item.batchNo || "-"}</td>
                <td>{item.itemGroupId || "-"}</td>
                <td>{item.itemTypeId || "-"}</td>
                <td>{item.itemDescription || "-"}</td>
                <td>{item.stockQuantity || "-"}</td>
                <td>{item.sellingPrice || "-"}</td>
                <td>{item.purchasePrice || "-"}</td>
                <td>{item.commissionType || "-"}</td>
                <td>{item.commissionValue || "-"}</td>
                <td>{item.locationId || "-"}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(item, "Edit Item")}
                    className="action-button edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="action-button delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleOpenModal(item, "View Item", true)}
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
        data={newItem}
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

export default ItemMaintenance;
