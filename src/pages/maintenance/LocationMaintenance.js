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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mockData = {
          items: [
            { id: 1, locationName: "Warehouse A", locationId: "L001", address: "123 Warehouse St" },
            { id: 2, locationName: "Office B", locationId: "L002", address: "456 Office Ave" },
            { id: 3, locationName: "Store C", locationId: "L003", address: "789 Store Rd" },
            { id: 4, locationName: "Factory D", locationId: "L004", address: "101 Factory Blvd" },
          ],
          totalPages: Math.ceil(5 / itemsPerPage),
        };

        setTimeout(() => {
          setLocations(
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
      { name: "locationName", label: "Location Name", type: "text", required: true },
      { name: "locationId", label: "Location ID", type: "text", required: true },
      { name: "address", label: "Address", type: "text", required: true },
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
    setNewLocation({ ...newLocation, [name]: value });
  };

  const handleOpenModal = (location = {}, title = "", viewing = false) => {
    setNewLocation(location);
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
          const updatedLocations = newLocation.id
            ? locations.map((location) =>
                location.id === newLocation.id
                  ? { ...location, ...newLocation }
                  : location
              )
            : [...locations, { ...newLocation, id: locations.length + 1 }];

          setLocations(updatedLocations);
          setIsPopupOpen(false);
          setSuccessModal({ isOpen: true, title: "Update Successfully!" })
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(
      newLocation.id 
      ? `Do you want to update this item group "${newLocation.locationName}"?`
      : `Do you want to add this item group "${newLocation.locationName}"?`
    );
    setIsConfirmOpen(true);
  };

  const handleDelete = (id) => {
    const locationToDelete = locations.find((location) => location.id === id);
  
    if (!locationToDelete) {
      console.error("Location not found");
      return;
    }

    setConfirmAction(() => () => {
      setLoading(true);
      setTimeout(() => {
        try {
          setLocations((prevLocations) => prevLocations.filter((location) => location.id !== id));
          setSuccessModal({ isOpen: true, title: "Update Successfully!" })
        } catch (error) {
          setErrorModal({ isOpen: true, title: "Error", message: error.message });
        } finally {
          setLoading(false);
        }
      }, 500);
    });

    setConfirmMessage(`Do you want to delete this location "${locationToDelete.locationName}"?`);
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
              <th>Location Name</th>
              <th>Location ID</th>
              <th>Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((location, index) => (
              <tr key={location.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{location.locationName}</td>
                <td>{location.locationId}</td>
                <td>{location.address}</td>
                <td>
                  <button
                    onClick={() => handleOpenModal(location, "Edit Location")}
                    className="action-button edit"
                  >
                    <FaEdit /> 
                  </button>
                  <button
                    onClick={() => handleDelete(location.id)}
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
