import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/HeaderBar.css";

const HeaderBar = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    // Retrieve access rights from local storage
    const accessRights = JSON.parse(localStorage.getItem("accessRights")) || [];

    // List of maintenance-related modules
    const maintenanceModules = [
      "User Maintenance",
      "Access Right Maintenance",
      "Debtor Maintenance",
      "Creditor Maintenance",
      "Item Maintenance",
      "Member Maintenance",
      "Location Maintenance",
      "PWP Maintenance"
    ];

    // Check if at least one maintenance module has allow: true
    const hasMaintenanceAccess = accessRights.some(
      (right) => maintenanceModules.includes(right.module) && right.allow
    );

    setShowMaintenance(hasMaintenanceAccess);
  }, []);

  const handleIconClick = (path) => {
    setActiveIcon(path);
  };

  return (
    <div className="header-bar">
      <div className="header-left">
        <div className="logo-header"></div>
        <h1 className="header-title">OPTIK POS</h1>
      </div>
      <div className="header-right">
        {showMaintenance && ( 
          <Link
            to="/maintenance"
            title="Tools"
            onClick={() => handleIconClick("/maintenance")}
            className={`header-icon ${activeIcon === "/maintenance" ? "active" : ""}`}
          >
            <i className="fal fa-tools"></i>
          </Link>
        )}
        <Link
          to="/report"
          title="Reports"
          onClick={() => handleIconClick("/report")}
          className={`header-icon ${activeIcon === "/report" ? "active" : ""}`}
        >
          <i className="fal fa-file-alt"></i>
        </Link>
        <Link
          to="/profile"
          title="Profile"
          onClick={() => handleIconClick("/profile")}
          className={`header-icon ${activeIcon === "/profile" ? "active" : ""}`}
        >
          <i className="fal fa-user-circle"></i>
        </Link>
      </div>
    </div>
  );
};

export default HeaderBar;
