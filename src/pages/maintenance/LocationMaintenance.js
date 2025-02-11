import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "../../css/Maintenance.css";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import CrudModal from "../../modals/CrudModal";
import ConfirmationModal from "../../modals/ConfirmationModal";
import ErrorModal from "../../modals/ErrorModal";
import SuccessModal from "../../modals/SuccessModal";

const LocationMaintenance = () => {
  const [locations, setLocations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [newLocation, setNewLocation] = useState({});
  const [modalTitle, setModalTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: ""});
  const navigate = useNavigate();
  const customerId = localStorage.getItem("customerId"); 
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchLocations();
    setFields([
      { name: "locationCode", label: "Location Code", type: "text", required: true },
      { name: "description", label: "Description", type: "text", required: true },
    ])
  }, [currentPage, itemsPerPage]); 

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://optikposbackend.absplt.com/Location/GetRecords", {
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
        setLocations(data.data);
        setTotalPages(Math.ceil(data.data.length / itemsPerPage));
      } else {
        throw new Error(data.errorMessage || "Failed to fetch location.");
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: "Error Fetching Data",
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (locations.length > 0) {
      setTotalPages(Math.ceil(locations.length / itemsPerPage)); 
    }
  }, [locations, itemsPerPage]);

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
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleOpenModal = async (location = {}, title = "", viewing = false) => {
    try {
      if (title === "Add Location") {
        const response = await fetch("https://optikposbackend.absplt.com/Location/New", {
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
          location = {
            id: data.data.locationId,
            locationCode: "",
            description: "", 
          };
        } else {
          throw new Error(data.errorMessage || "Failed to create new location.");
        }
      } 

      else if ((title === "Edit Location" || title === "View Location") && location.locationId) {
        const response = await fetch("https://optikposbackend.absplt.com/Location/Edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            userId: userId,
            id: location.locationId, 
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          location = {
            id: data.data.locationId,
            locationCode: data.data.locationCode,
            description: data.data.description, 
          };
        } else {
          throw new Error(data.errorMessage || "Failed to fetch role data.");
        }
      }

      setNewLocation(location);
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


  const handleSave = (updatedLocation) => {
    setConfirmMessage(`Do you want to save this location?`);
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Location/Save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            actionData: {
              customerId: Number(customerId),
              userId: userId,
              id: updatedLocation.locationId || updatedLocation.id,
            },
            locationId: updatedLocation.locationId || updatedLocation.id,
            locationCode: updatedLocation.locationCode, 
            description: updatedLocation.description,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Location saved successfully!" });
  
          await fetchLocations();
          setIsPopupOpen(false);
        } else {
          throw new Error(data.errorMessage || "Failed to save location.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Saving Location", message: error.message });
      } finally {
        setLoading(false);
      }
    });
  
    setIsConfirmOpen(true);
  };


  const handleDelete = (locationId) => {
    const confirmMessage = `Are you sure you want to delete the location?`;
  
    setConfirmAction(() => async () => {
      setLoading(true);
      try {
        const response = await fetch("https://optikposbackend.absplt.com/Location/Delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerId: Number(customerId),
            id: locationId, 
            userId: userId,
          }),
        });
  
        const data = await response.json();
  
        if (response.ok && data.success) {
          setSuccessModal({ isOpen: true, title: "Location deleted successfully!" });
  
          await fetchLocations(); 
        } else {
          throw new Error(data.errorMessage || "Failed to delete location.");
        }
      } catch (error) {
        setErrorModal({ isOpen: true, title: "Error Deleting Location", message: error.message });
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
        <span> / Location Maintenance</span>
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
          onClick={() => handleOpenModal({}, "Add Location")}
        >
          Add Location
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>No</th>
              <th>Location Code</th>
              <th>Decription</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => (
              <tr key={location.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{location.locationCode}</td>
                <td>{location.description}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(location, "Edit Location")}
                    className="action-button edit"
                  >
                    <FaEdit /> 
                  </button>
                  <button
                    onClick={() => handleDelete(location.locationId)}
                    className="action-button delete"
                  >
                    <FaTrash />
                  </button>
                  <button
                    onClick={() => handleOpenModal(location, "View Location", true)}
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
        data={newLocation}
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

export default LocationMaintenance;
