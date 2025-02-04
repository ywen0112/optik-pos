import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Maintenance.css";

const maintenanceSections = [
  [
    { name: "User Maintenance", icon: "fal fa-user", path: "/maintenance/user-maintenance" },
    { name: "Access Right Maintenance", icon: "fal fa-lock", path: "/maintenance/access-right-maintenance" },
  ],
  [
    { name: "Debtor Maintenance", icon: "fal fa-credit-card", path: "/maintenance/debtor-maintenance" },
    { name: "Creditor Maintenance", icon: "fal fa-university", path: "/maintenance/creditor-maintenance" },
    { name: "Member Maintenance", icon: "fal fa-users", path: "/maintenance/member-maintenance" },
  ],
  [
    { name: "Item Maintenance/Batch No", icon: "fal fa-box", path: "/maintenance/item-maintenance-batch-no" },
    { name: "Location Maintenance", icon: "fal fa-map-marker-alt", path: "/maintenance/location-maintenance" },
    { name: "PWP Maintenance", icon: "fal fa-shopping-cart", path: "/maintenance/pwp-maintenance" },
  ],
];

const Maintenance = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span>Maintenance</span>
      </div>

      <div className="maintenance-sections">
        {maintenanceSections.map((section, sectionIndex) => (
          <div className="maintenance-section" key={sectionIndex}>
            <ul className="maintenance-list">
              {section.map((option, index) => (
                <li
                  key={index}
                  className="maintenance-item"
                  onClick={() => handleNavigation(option.path)}
                >
                  <i className={option.icon}></i>
                  <span>{option.name}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
