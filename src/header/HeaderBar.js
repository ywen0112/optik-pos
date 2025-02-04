import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/HeaderBar.css";

const HeaderBar = () => {
  const location = useLocation();
  const [activeIcon, setActiveIcon] = useState(location.pathname); // Track the active path

  const handleIconClick = (path) => {
    setActiveIcon(path); // Update active icon
  };
  
  return (
    <div className="header-bar">
      <div className="header-left">
        <div className="logo-header"></div>
        <h1 className="header-title">OPTIK POS</h1>
      </div>
      <div className="header-right">
      <Link
          to="/maintenance"
          title="Tools"
          onClick={() => handleIconClick("/maintenance")}
          className={`header-icon ${activeIcon === "/maintenance" ? "active" : ""}`}
        >
          <i className="fal fa-tools"></i>
        </Link> 
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
          className={`header-icon ${activeIcon === "/report" ? "active" : ""}`}
        >
          <i className="fal fa-user-circle"></i>
        </Link>        
      </div>
    </div>
  );
};

export default HeaderBar;
