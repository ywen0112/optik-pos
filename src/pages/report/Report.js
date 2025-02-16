import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/Report.css";

const reportSections = [
    [
        { name: "Transaction Report", icon: "fal fa-file-alt", path: "/report/transaction-report" },
    ],
    [
        { name: "Debtor Report", icon: "fal fa-file-alt", path: "/report/debtor-report" },
        { name: "Creditor Report", icon: "fal fa-file-alt", path: "/report/creditor-report" },
        { name: "Member Report", icon: "fal fa-file-alt", path: "/report/member-report" },  
    ],
    [
        { name: "Item Report", icon: "fal fa-file-alt", path: "/report/item-report" },
        { name: "Location Report", icon: "fal fa-file-alt", path: "/report/location-report" },
        { name: "PWP Report", icon: "fal fa-file-alt", path: "/report/pwp-report" },
    ],
];

const Report = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleNavigation = (path) => {
    navigate(path);
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPath = pathSegments.length > 1 ? pathSegments.join(" / ") : "Report";

  return (
    <div className="report-container">
      <div className="breadcrumb">
        {pathSegments.length > 1 ? (
          <span className="back-link" onClick={() => navigate("/report")}>
            Report
          </span>
        ) : (
          <span>Report</span>
        )}
        {pathSegments.length > 1 && ` / ${pathSegments[pathSegments.length - 1]}`}
      </div>

      {/* <div className="report-sections">
        {reportSections.map((section, sectionIndex) => (
          <div className="report-section" key={sectionIndex}>
            <ul className="report-list">
              {section.map((option, index) => (
                <li
                  key={index}
                  className="report-item"
                  onClick={() => handleNavigation(option.path)}
                >
                  <i className={option.icon}></i>
                  <span>{option.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
    <label>In Maintenance</label>
    </div>
  );
};

export default Report;
