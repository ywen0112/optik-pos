import React, { useState } from "react";
import "../../css/DebtorReport.css";

const DebtorReport = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const mockData = [
    {
      emailAddress: "johndoe@example.com",
      mobile: "1234567890",
      debtorCode: "D001",
      debtorName: "John Doe",
      debtorTypeId: "DT001",
      address1: "123 Main Street",
      address2: "Suite 5",
      address3: "",
      address4: "",
      postCode: "12345",
      deliverAddr1: "Warehouse A",
      deliverAddr2: "",
      deliverAddr3: "",
      deliverAddr4: "",
      deliverPostCode: "54321",
      locationId: "L001",
      salesAgent: "Agent A",
      currencyCode: "USD",
      ic: "A1234567",
      nameOnIC: "Johnathan Doe",
      tin: "TIN123456",
    },
    {
      emailAddress: "janesmith@example.com",
      mobile: "0987654321",
      debtorCode: "D002",
      debtorName: "Jane Smith",
      debtorTypeId: "DT002",
      address1: "456 Elm Street",
      address2: "",
      address3: "",
      address4: "",
      postCode: "67890",
      deliverAddr1: "Warehouse B",
      deliverAddr2: "",
      deliverAddr3: "",
      deliverAddr4: "",
      deliverPostCode: "98765",
      locationId: "L002",
      salesAgent: "Agent B",
      currencyCode: "EUR",
      ic: "B7654321",
      nameOnIC: "Janet Smith",
      tin: "TIN654321",
    },
    {
      emailAddress: "peterparker@example.com",
      mobile: "567891234",
      debtorCode: "D003",
      debtorName: "Peter Parker",
      debtorTypeId: "DT001",
      address1: "789 Broadway",
      address2: "Apt 2",
      address3: "",
      address4: "",
      postCode: "56789",
      deliverAddr1: "Warehouse C",
      deliverAddr2: "",
      deliverAddr3: "",
      deliverAddr4: "",
      deliverPostCode: "98789",
      locationId: "L003",
      salesAgent: "Agent C",
      currencyCode: "MYR",
      ic: "C4567890",
      nameOnIC: "Spiderman Parker",
      tin: "TIN987654",
    },
    {
      emailAddress: "tonystark@example.com",
      mobile: "135791357",
      debtorCode: "D004",
      debtorName: "Tony Stark",
      debtorTypeId: "DT003",
      address1: "108 Stark Tower",
      address2: "",
      address3: "",
      address4: "",
      postCode: "11223",
      deliverAddr1: "Warehouse D",
      deliverAddr2: "",
      deliverAddr3: "",
      deliverAddr4: "",
      deliverPostCode: "22111",
      locationId: "L004",
      salesAgent: "Agent D",
      currencyCode: "USD",
      ic: "D1239876",
      nameOnIC: "Iron Man Stark",
      tin: "TIN321456",
    },
    {
      emailAddress: "natasharomanoff@example.com",
      mobile: "246824682",
      debtorCode: "D005",
      debtorName: "Natasha Romanoff",
      debtorTypeId: "DT002",
      address1: "Black Widow Street",
      address2: "",
      address3: "",
      address4: "",
      postCode: "22334",
      deliverAddr1: "Warehouse E",
      deliverAddr2: "",
      deliverAddr3: "",
      deliverAddr4: "",
      deliverPostCode: "33422",
      locationId: "L005",
      salesAgent: "Agent E",
      currencyCode: "EUR",
      ic: "E8765432",
      nameOnIC: "Nat Romanoff",
      tin: "TIN654123",
    },
  ];

  const filteredData = mockData.filter(
    (debtor) =>
      debtor.debtorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      debtor.debtorCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="debtor-report-container">
      <div className="debtor-report-search">
        <input
          type="text"
          placeholder="Search by Debtor Name or Code"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="debtor-report-table">
        <thead>
          <tr>
            <th>Email Address</th>
            <th>Mobile</th>
            <th>Debtor Code</th>
            <th>Debtor Name</th>
            <th>Debtor Type ID</th>
            <th>Address 1</th>
            <th>Address 2</th>
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
                <td>{debtor.emailAddress}</td>
                <td>{debtor.mobile}</td>
                <td>{debtor.debtorCode}</td>
                <td>{debtor.debtorName}</td>
                <td>{debtor.debtorTypeId}</td>
                <td>{debtor.address1}</td>
                <td>{debtor.address2 || "N/A"}</td>
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
              <td colSpan="16" style={{ textAlign: "center" }}>
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
