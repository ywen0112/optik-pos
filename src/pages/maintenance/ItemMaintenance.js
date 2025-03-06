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
  const [totalRecords, setTotalRecords] = useState(true);
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
  const [searchKeyword, setSearchKeyword] = useState("");
  const itemMaintenanceRights = JSON.parse(localStorage.getItem("accessRights"))?.find(
    (item) => item.module === "Item Maintenance"
  ) || {};

  useEffect(() => {
    const fetchItemGroups = async () => {
      try {
        const response = await fetch("https://optikposwebsiteapi.absplt.com/ItemGroup/GetRecords", {
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
        const response = await fetch("https://optikposwebsiteapi.absplt.com/ItemType/GetRecords", {
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
      },
      {
        name: "itemTypeId",
        label: "Item Type Code",
        type: "select",
        options: Object.keys(itemTypeMapping).map(itemTypeId => ({
          label: itemTypeMapping[itemTypeId], 
          value: itemTypeId, 
        })),
      },
    ])
    }, [itemGroupMapping, itemTypeMapping]); 

    useEffect(() => {
      fetchItems();
    }, [currentPage, itemsPerPage, searchKeyword]);
  
    const fetchItems = async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposwebsiteapi.absplt.com/Item/GetRecords", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            keyword: searchKeyword.trim(),
            offset: (currentPage - 1) * itemsPerPage, 
            limit: itemsPerPage,
          }),
        });
  
        const data = await response.json();
        if (response.ok && data.success) {
          const filteredItems = data.data.filter(item =>
            item.itemCode?.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchKeyword.toLowerCase())
          );
  
          setItems(filteredItems);
          setTotalRecords(Math.ceil(filteredItems.length / itemsPerPage));
        } else {
          throw new Error(data.errorMessage || "Failed to fetch items.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Fetching Items", message: error.message });
      } finally {
        setLoading(false);
      }
    };
    

    const handleItemsPerPageChange = (event) => {
      const newItemsPerPage = Number(event.target.value);
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); 
    };
    
    const handlePageChange = (page) => {
      if (page >= 1) {
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
          itemUOMs: updatedUOMs, 
        };
      } else {
        return {
          ...prevItem,
          [name]: value,
        };
      }
    });
  
  };
  
  const handleOpenModal = async (item = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Item") {
        const response = await fetch("https://optikposwebsiteapi.absplt.com/Item/New", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: "",
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.errorMessage || "Failed to create new item.");

        let newItemData = {
          id: data.data.itemId,
          itemCode: data.data.itemCode || "",
          description: data.data.description || "",
          desc2: data.data.desc2 || "",
          itemGroupId: data.data.itemGroupId || "",
          itemTypeId: data.data.itemTypeId || "",
          isActive: data.data.isActive ?? true,
          image: data.data.image || "",
          itemUOMs: [], 
        };

        const uomResponse = await fetch("https://optikposwebsiteapi.absplt.com/Item/NewDetail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const uomData = await uomResponse.json();
        if (!uomResponse.ok || !uomData.success) throw new Error(uomData.errorMessage || "Failed to create new UOM.");

        newItemData.itemUOMs.push({
          itemUOMId: uomData.data.itemUOMId,
          uom: uomData.data.uom || "",
          unitPrice: uomData.data.unitPrice || 0,
          barCode: uomData.data.barCode || "",
        });

        setNewItem(newItemData);
      } else {
        setNewItem(item);
      }

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
        const response = await fetch("https://optikposwebsiteapi.absplt.com/Item/Save", {
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
            itemUOMs: updatedItem.itemUOMs ?? [],
          }),
        });

        const data = await response.json();

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
        const response = await fetch("https://optikposwebsiteapi.absplt.com/Item/Delete", {
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

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Item Code or Description"
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
        {itemMaintenanceRights.add && (
          <button className="add-button" onClick={() => handleOpenModal({}, "Add Item")}>
            Add Item
          </button>
        )}
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(items) && items.length > 0 &&
              items.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.itemCode || "-"}</td>
                    <td>{item.description || "-"}</td>
                    <td>{itemGroupMapping[item.itemGroupId] || "-"}</td>
                    <td>{itemTypeMapping[item.itemTypeId] || "-"}</td>
                    <td>
                      {itemMaintenanceRights.edit && (
                        <button onClick={() => handleOpenModal(item, "Edit Item")} className="action-button edit">
                          <FaEdit />
                        </button>
                      )}
                      {itemMaintenanceRights.delete && (
                        <button onClick={() => handleDelete(item.itemId)} className="action-button delete">
                          <FaTrash />
                        </button>
                      )}
                      {itemMaintenanceRights.view && (
                        <button onClick={() => handleOpenModal(item, "View Item", true)} className="action-button view">
                          <FaEye />
                        </button>
                      )}
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
          Page {currentPage}
        </span>
        <button
          disabled={!totalRecords}
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
