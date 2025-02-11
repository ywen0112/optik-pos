import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../modals/CrudModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";

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
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: "" });
  const navigate = useNavigate();
  const [itemGroupMapping, setItemGroupMapping] = useState({}); 
  const [itemTypeMapping, setItemTypeMapping] = useState([]); 
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");

  useEffect(() => {
      const fetchItemGroups = async () => {
        try {
          const response = await fetch("https://optikposbackend.absplt.com/ItemGroup/GetRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
            const itemGroupMapping = {};
            data.data.forEach(itemGroup => {
              itemGroupMapping[itemGroup.itemGroupId] = itemGroup.itemGroupCode;
            });
            setItemGroupMapping(itemGroupMapping);
          } else {
            throw new Error(data.errorMessage || "Failed to fetch item groups.");
          }
        } catch (error) {
          console.error("Error fetching Item Groups:", error);
        }
      };
  
      fetchItemGroups();
    }, [customerId]);

    useEffect(() => {
      const fetchItemTypes = async () => {
        try {
          const response = await fetch("https://optikposbackend.absplt.com/ItemType/GetRecords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId: Number(customerId), keyword: "", offset: 0, limit: 9999 }),
          });
  
          const data = await response.json();
          if (response.ok && data.success) {
            const itemTypeMapping = {};
            data.data.forEach(itemType => {
              itemTypeMapping[itemType.itemTypeId] = itemType.itemTypeCode;
            });
            setItemTypeMapping(itemTypeMapping);
          } else {
            throw new Error(data.errorMessage || "Failed to fetch item types.");
          }
        } catch (error) {
          console.error("Error fetching Item Types:", error);
        }
      };
  
      fetchItemTypes();
    }, [customerId]);

  useEffect(() => {
    fetchItems();
    setFields([
      { name: "itemCode", label: "Item Code", type: "text", required: true },
      { name: "description", label: "Description", type: "text" },
      { name: "desc", label: "Description 2", type: "text" },
      {
        name: "itemGroupId",
        label: "Item Group Code",
        type: "select",
        options: Object.keys(itemGroupMapping).map(itemGroupId => ({
          label: itemGroupMapping[itemGroupId], 
          value: itemGroupId, 
        })),
        required: true,
      },
      {
        name: "itemTypeId",
        label: "Item Type Code",
        type: "select",
        options: Object.keys(itemTypeMapping).map(itemTypeId => ({
          label: itemTypeMapping[itemTypeId], 
          value: itemTypeId, 
        })),
        required: true,
      },
      { name: "itemUOMId", label: "Item UOM Id", type: "text", required: true },
      { name: "uom", label: "UOM", type: "text", required: true },
      { name: "unitPrice", label: "Unit Price", type: "number", required: true },
      { name: "barCode", label: "Barcode", type: "text", required: true },
    ])
    }, [itemGroupMapping, itemTypeMapping]); 
  
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Item/GetRecords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            keyword: "",
            offset: 0,
            limit: 9999,
          }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
          if (Array.isArray(data.data)) { 
            setItems(data.data);
            setTotalPages(Math.ceil(data.data.length / itemsPerPage));
          }
        } else {
          throw new Error(data.errorMessage || "Failed to fetch items.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Fetching Items", message: error.message });
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
        if (items.length > 0) {
          setTotalPages(Math.ceil(items.length / itemsPerPage)); 
        }
      }, [items, itemsPerPage]);
    

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
  
    setNewItem((prevItem) => {
      if (name.startsWith("itemUOMs.")) {
        const [, index, field] = name.split(".");
        const updatedUOMs = [...(prevItem.itemUOMs || [])];
  
        updatedUOMs[index] = {
          ...updatedUOMs[index],
          [field]: value,
        };
  
        return {
          ...prevItem,
          itemUOMs: updatedUOMs, // ✅ Updates UOM correctly
        };
      } else {
        return {
          ...prevItem,
          [name]: value,
        };
      }
    });
  
    console.log("Updated Item State:", newItem); // ✅ Debugging output
  };
  
  const handleOpenModal = async (item = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Item") {
        const response = await fetch("https://optikposbackend.absplt.com/Item/New", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: "",
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.success) {
          item = {
            id: data.data.itemId,
            itemCode: data.data.itemCode || "",
            description: data.data.description || "",
            desc2: data.data.desc2 || "",
            itemGroupId: data.data.itemGroupId || "",
            itemTypeId: data.data.itemTypeId || "",
            isActive: data.data.isActive ?? true,
            image: data.data.image || "",
            itemUOMs: data.data.itemUOMs ?? [], // ✅ Ensure UOM is always an array
          };
        } else {
          throw new Error(data.errorMessage || "Failed to create new item.");
        }
      } 
      
      else if ((title === "Edit Item" || title === "View Item") && item.itemId) {
        const response = await fetch("https://optikposbackend.absplt.com/Item/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: item.itemId, 
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.success) {
          item = {
            id: data.data.itemId,
            itemCode: data.data.itemCode || "",
            description: data.data.description || "",
            desc2: data.data.desc2 || "",
            itemGroupId: data.data.itemGroupId || "",
            itemTypeId: data.data.itemTypeId || "",
            isActive: data.data.isActive ?? true,
            image: data.data.image || "",
            itemUOMs: Array.isArray(data.data.itemUOMs) ? [...data.data.itemUOMs] : [], // ✅ Ensure array format
          };
        } else {
          throw new Error(data.errorMessage || "Failed to fetch item.");
        }
      }
  
      setNewItem(item); // ✅ Ensure UOM data is passed
      setModalTitle(title);
      setIsViewing(viewing);
      setIsPopupOpen(true);
  
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Opening Modal",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
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

  const handleSave = (updatedItem) => {
    setConfirmMessage(`Do you want to save this item?`);
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        console.log("Saving Item Data:", updatedItem); // ✅ Debugging output
  
        const response = await fetch("https://optikposbackend.absplt.com/Item/Save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId: userId,
              id: updatedItem.itemId || updatedItem.id,
            },
            itemId: updatedItem.itemId || updatedItem.id,
            itemCode: updatedItem.itemCode,
            description: updatedItem.description,
            desc2: updatedItem.desc2,
            itemGroupId: updatedItem.itemGroupId,
            itemTypeId: updatedItem.itemTypeId,
            isActive: updatedItem.isActive ?? true,
            image: updatedItem.image,
            itemUOMs: updatedItem.itemUOMs ?? [], // ✅ Ensure UOMs are passed
          }),
        });
  
        const data = await response.json();
        console.log("API Response:", data); // ✅ Debugging output
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Item saved successfully!" });
  
          await fetchItems();
          setIsPopupOpen(false);
        } else {
          throw new Error(data.errorMessage || "Failed to save item.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving Item", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setIsConfirmOpen(true);
  };

  const handleDelete = (itemId) => {
    const confirmMessage = `Are you sure you want to delete the item?`;
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Item/Delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            id: itemId, 
            userId: userId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Item deleted successfully!" });
  
          await fetchItems(); 
        } else {
          throw new Error(data.errorMessage || "Failed to delete item.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting Item", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setConfirmMessage(confirmMessage);
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
        <span> / Item Maintenance/Batch No</span>
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
              <th>Description</th>
              <th>Item Group Code</th>
              <th>Item Type Code</th>
              {/* <th>UOM</th>
              <th>Unit Price</th>
              <th>Barcode</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 &&
              items.map((item, index) => {
                const firstUOM = item.itemUOMs?.[0] || {};
                return (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.itemCode || "-"}</td>
                    <td>{item.description || "-"}</td>
                    <td>{itemGroupMapping[item.itemGroupId] || "-"}</td>
                    <td>{itemTypeMapping[item.itemTypeId] || "-"}</td>
                    {/* <td>{firstUOM.uom || "-"}</td>
                    <td>{firstUOM.unitPrice !== undefined ? firstUOM.unitPrice.toFixed(2) : "-"}</td>
                    <td>{firstUOM.barCode || "-"}</td> */}
                    <td>
                      <button onClick={() => handleOpenModal(item, "Edit Item")} className="action-button edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(item.itemId)} className="action-button delete">
                        <FaTrash />
                      </button>
                      <button onClick={() => handleOpenModal(item, "View Item", true)} className="action-button view">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                );
              })}
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
