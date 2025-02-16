import React from "react";
import { useNavigate } from "react-router-dom";
import "../../css/Maintenance.css";

const maintenanceSections = [
  [
    { name: "User Maintenance", module: "User Maintenance", icon: "fal fa-user", path: "/maintenance/user-maintenance" },
    { name: "Access Right Maintenance", module: "Access Right Maintenance", icon: "fal fa-lock", path: "/maintenance/access-right-maintenance" },
  ],
  [
    { name: "Debtor Maintenance", module: "Debtor Maintenance", icon: "fal fa-credit-card", path: "/maintenance/debtor-maintenance" },
    { name: "Creditor Maintenance", module: "Creditor Maintenance", icon: "fal fa-university", path: "/maintenance/creditor-maintenance" },
    { name: "Member Maintenance", module: "Member Maintenance", icon: "fal fa-users", path: "/maintenance/member-maintenance" },
  ],
  [
    { name: "Item Maintenance/Batch No", module: "Item Maintenance", icon: "fal fa-box", path: "/maintenance/item-maintenance-batch-no" },
    { name: "Location Maintenance", module: "Location Maintenance", icon: "fal fa-map-marker-alt", path: "/maintenance/location-maintenance" },
    { name: "PWP Maintenance", module: "PWP Maintenance", icon: "fal fa-shopping-cart", path: "/maintenance/pwp-maintenance" },
  ],
];

const Maintenance = () => {
  const navigate = useNavigate();

  const accessRights = JSON.parse(localStorage.getItem("accessRights")) || [];

  const isAllowed = (module) => {
    const access = accessRights.find((item) => item.module === module);
    return access ? access.allow : false; 
  };

  return (
    <div className="maintenance-container">
      <div className="breadcrumb">
        <span>Maintenance</span>
      </div>

      <div className="maintenance-sections">
        {maintenanceSections.map((section, sectionIndex) => {
          const filteredSection = section.filter((option) => isAllowed(option.module));

          return filteredSection.length > 0 ? ( 
            <div className="maintenance-section" key={sectionIndex}>
              <ul className="maintenance-list">
                {filteredSection.map((option, index) => (
                  <li
                    key={index}
                    className="maintenance-item"
                    onClick={() => navigate(option.path)}
                  >
                    <i className={option.icon}></i>
                    <span>{option.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default Maintenance;
