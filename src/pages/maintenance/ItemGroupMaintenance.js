import React, { useEffect, useState } from "react";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../components/CrudModal";
import ConfirmationModal from "../../components/ConfirmationModal";
import ErrorModal from "../../components/ErrorModal";

const ItemGroupMaintenance = () => {
  const [itemGroups, setItemGroups] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newItemGroup, setNewItemGroup] = useState({});
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
              itemGroupName: "Electronics",
              itemGroupId: "IG001",
              itemTypeId: "IT001",
              itemGroupDescription: "Group for electronic items",
              commissionType: "Rate",
              commissionPoint: 5.0,
              locationId: "L001",
            },
            {
              id: 2,
              itemGroupName: "Furniture",
              itemGroupId: "IG002",
              itemTypeId: "IT002",
              itemGroupDescription: "Group for furniture items",
              commissionType: "Amount",
              commissionPoint: 30,
              locationId: "L002",
            },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setItemGroups(
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
      { name: "itemGroupName", label: "Item Group Name", type: "text", required: true },
      { name: "itemGroupId", label: "Item Group ID", type: "text", required: true },
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
      { name: "itemGroupDescription", label: "Item Group Description", type: "textarea", required: true },
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
    setNewItemGroup({ ...newItemGroup, [name]: value });
  };

  const handleOpenModal = (itemGroup = {}, title = "", viewing = false) => {
    setNewItemGroup(itemGroup);
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
          const updatedItemGroups = newItemGroup.id
            ? itemGroups.map((group) =>
                group.id === newItemGroup.id ? { ...group, ...newItemGroup } : group
              )
            : [...itemGroups, { ...newItemGroup, id: itemGroups.length + 1 }];

          setItemGroups(updatedItemGroups);
          setIsPopupOpen(false);
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newItemGroup.id 
      ? `Do you want to update this item group "${newItemGroup.itemGroupName}"?`
      : `Do you want to add this item group "${newItemGroup.itemGroupName}"?`
  );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const itemGroupToDelete = itemGroups.find((group) => group.id === id);
  
    if (!itemGroupToDelete) {
      console.error("Item group not found");
      return;
    }

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setItemGroups((prevGroups) => prevGroups.filter((group) => group.id !== id));
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(`Do you want to delete this item group "${itemGroupToDelete.itemGroupName}"?`);
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
          onClick={() => handleOpenModal({}, "Add Item Group")}
        >
          Add Item Group
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Item Group Name</th>
              <th>Item Group ID</th>
              <th>Item Type ID</th>
              <th>Item Group Description</th>
              <th>Commission Type</th>
              <th>Commission Point</th>
              <th>Location ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {itemGroups.map((group, index) => (
              <tr key={group.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{group.itemGroupName || "-"}</td>
                <td>{group.itemGroupId || "-"}</td>
                <td>{group.itemTypeId || "-"}</td>
                <td>{group.itemGroupDescription || "-"}</td>
                <td>{group.commissionType || "-"}</td>
                <td>{group.commissionPoint || "-"}</td>
                <td>{group.locationId || "-"}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(group, "Edit Item Group")}
                    className="action-button edit"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group.id)}
                    className="action-button delete"
                  >
                    <FaTrash /> Delete
                  </button>
                  <button
                    onClick={() => handleOpenModal(group, "View Item Group", true)}
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
        data={newItemGroup}
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

export default ItemGroupMaintenance;
