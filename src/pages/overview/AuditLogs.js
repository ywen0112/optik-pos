import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import axios from 'axios';
import '../../css/AuditLogs.css'
import ErrorModal from "../../modals/ErrorModal";

const AuditLogs = () => {
  const [users, setUsers] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [filters, setFilters] = useState({
    userId: '',
    eventType: '',
    fromDate: null,
    toDate: null,
  });
  const [pagination, setPagination] = useState({ offset: 0, limit: 10, page: 1 });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });
  const customerId = Number(localStorage.getItem('customerId'));

  useEffect(() => {
    fetchUsers();
    fetchEventTypes();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.post(
        'https://optikposwebsiteapi.absplt.com/Users/GetUsers',
        {
          customerId: customerId,
          keyword: '',
          offset: 0,
          limit: 9999,
        }
      );
      if (response.data.success) {
        setUsers(response.data.data.map(user => ({
          value: user.userId,
          label: user.userName,
        })));
      } else {
        throw new Error(response.data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching", message: error.message });
    }
  };

  const fetchEventTypes = async () => {
    try {
      const response = await axios.get(
        `https://optikposwebsiteapi.absplt.com/AuditLog/GetAllAuditChangeType?customerId=${customerId}`
      );
      if (response.data.success) {
        setEventTypes(response.data.data.map(type => ({ value: type, label: type })));
      } else {
        throw new Error(response.data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching", message: error.message });
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const response = await axios.post(
        'https://optikposwebsiteapi.absplt.com/AuditLog/GetRecords',
        {
          customerId: customerId,
          ...filters,
          offset: pagination.offset,
          limit: pagination.limit,
        }
      );
      if (response.data.success) {
        setAuditLogs(response.data.data);
      } else {
        throw new Error(response.data.errorMessage || "Failed to open counter.");
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: "Error Fetching", message: error.message });
    }
  };

  const handleInputChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    setPagination({ ...pagination, offset: 0, page: 1 });
    fetchAuditLogs();
  };

  const handlePageChange = (page) => {
    setPagination({
      ...pagination,
      page,
      offset: pagination.limit * (page - 1),
    });
    fetchAuditLogs();
  };

  return (
    <div className="audit-logs-container">
      <div className="audit-logs-search-container">
        <div className="audit-logs-header">
            <h3 className="audit-logs-title">Audit Logs</h3>
            <button onClick={handleSearch} className="audit-logs-search-btn">
              Search
            </button>
          </div>
        <div className="audit-logs-grid">
          <Select
            placeholder="Select User"
            options={users}
            onChange={(option) => handleInputChange('userId', option?.value || '')}
          />
          <Select
            placeholder="Select Event Type"
            options={eventTypes}
            onChange={(option) => handleInputChange('eventType', option?.value || '')}
          />
          <input
            type="date"
            placeholder="From Date"
            className="audit-logs-date-input"
            onChange={(e) => handleInputChange('fromDate', e.target.value || null)}
            onInput={(e) => handleInputChange('fromDate', e.target.value || null)}
          />
          <input
            type="date"
            placeholder="To Date"
            className="audit-logs-date-input"
            onChange={(e) => handleInputChange('toDate', e.target.value || null)}
            onInput={(e) => handleInputChange('toDate', e.target.value || null)}
          />
        </div>
      </div>

      {auditLogs.length > 0 && (
        <div className="audit-logs-results timeline-container">
        {auditLogs.map((log) => (
          <div key={log.auditLogId} className="timeline-item">
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <p className="timeline-time">{new Date(log.auditChangeTime).toLocaleString()}</p>
              <p className="timeline-content-text">{log.auditContent}</p>
              {log.auditContentDetails && (
                <p className="timeline-content-details">{log.auditContentDetails}</p>
              )}
            </div>
          </div>
        ))}
        <div className="audit-logs-pagination">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span>Page {pagination.page}</span>
          <button onClick={() => handlePageChange(pagination.page + 1)}>
            Next
          </button>
        </div>
      </div>
      )}
      <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={()=> setErrorModal({ isOpen: false, title: "", message: "" })}/>
    </div>
  );
};

export default AuditLogs;
