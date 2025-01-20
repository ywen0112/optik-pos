import React, { useState } from "react";
import "../../css/DebtorReport.css";

const DebtorReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const mockData = [
    {
      emailAddress: "johndoe@example.com",
      mobile: "1234567890",
      debtorCode: "D001",
      debtorName: "John Doe",
      debtorTypeId: "DT001",
      address1: "123 Main Street",
      address2: "Suite 5",
      postCode: "12345",
      deliverAddr1: "Warehouse A",
      deliverPostCode: "54321",
      locationId: "L001",
      salesAgent: "Agent A",
      currencyCode: "USD",
      ic: "A1234567",
      nameOnIC: "Johnathan Doe",
      tin: "TIN123456",
      timestamp: "2025-01-01 12:34:56",
    },
    {
      emailAddress: "janesmith@example.com",
      mobile: "0987654321",
      debtorCode: "D002",
      debtorName: "Jane Smith",
      debtorTypeId: "DT002",
      address1: "456 Elm Street",
      postCode: "67890",
      deliverAddr1: "Warehouse B",
      deliverPostCode: "98765",
      locationId: "L002",
      salesAgent: "Agent B",
      currencyCode: "EUR",
      ic: "B7654321",
      nameOnIC: "Janet Smith",
      tin: "TIN654321",
      timestamp: "2025-01-02 08:15:30",
    },
    {
      emailAddress: "peterparker@example.com",
      mobile: "567891234",
      debtorCode: "D003",
      debtorName: "Peter Parker",
      debtorTypeId: "DT001",
      address1: "789 Broadway",
      postCode: "56789",
      deliverAddr1: "Warehouse C",
      deliverPostCode: "98789",
      locationId: "L003",
      salesAgent: "Agent C",
      currencyCode: "MYR",
      ic: "C4567890",
      nameOnIC: "Spiderman Parker",
      tin: "TIN987654",
      timestamp: "2025-01-03 14:22:45",
    },
  ];

  const filteredData = mockData.filter((debtor) => {
    const debtorDate = new Date(debtor.timestamp);
  
    // Include the entire day for the "toDate" filter
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(new Date(toDate).setHours(23, 59, 59, 999)) : null;
  
    const matchesSearchQuery =
      debtor.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debtor.debtorCode.toLowerCase().includes(searchQuery.toLowerCase());
  
    const withinDateRange =
      (!from || debtorDate >= from) && (!to || debtorDate <= to);
  
    return matchesSearchQuery && withinDateRange;
  });
  

  return (
    <div className="debtor-report-container">
      <div className="debtor-report-search">
        <div className="debtor-search-criteria">
          <div className="form-group">
            <label>From Date:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To Date:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Search (Name or Code):</label>
            <input
              type="text"
              placeholder="Enter Debtor Name or Code"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <table className="debtor-report-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>No</th>
            <th>Debtor Code</th>
            <th>Debtor Name</th>
            <th>Email Address</th>
            <th>Mobile</th>
            <th>Debtor Type ID</th>
            <th>Address 1</th>
            <th>Postcode</th>
            <th>Delivery Address 1</th>
            <th>Delivery Postcode</th>
            <th>Location ID</th>
            <th>Sales Agent</th>
            <th>Currency Code</th>
            <th>IC</th>
            <th>Name on IC</th>
            <th>TIN</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((debtor, index) => (
              <tr key={index}>
                <td>{debtor.timestamp}</td>
                <td>{index + 1}</td>
                <td>{debtor.debtorCode}</td>
                <td>{debtor.debtorName}</td>
                <td>{debtor.emailAddress}</td>
                <td>{debtor.mobile}</td>
                <td>{debtor.debtorTypeId}</td>
                <td>{debtor.address1}</td>
                <td>{debtor.postCode}</td>
                <td>{debtor.deliverAddr1}</td>
                <td>{debtor.deliverPostCode}</td>
                <td>{debtor.locationId}</td>
                <td>{debtor.salesAgent}</td>
                <td>{debtor.currencyCode}</td>
                <td>{debtor.ic}</td>
                <td>{debtor.nameOnIC}</td>
                <td>{debtor.tin}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="17" style={{ textAlign: "center" }}>
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DebtorReport;
