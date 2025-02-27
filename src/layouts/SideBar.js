import React, { useState } from "react";
import "../css/SideBar.css";

const Sidebar = ({ onMenuClick }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleExpandSidebar = () => {
    if (collapsed) setCollapsed(false);
  };

  const accessRights = JSON.parse(localStorage.getItem("accessRights")) || [];

  const isAllowed = (module) => {
    const access = accessRights.find((item) => item.module === module);
    return access ? access.allow : false; 
  };

  const sections = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", icon: "fal fa-home", path: "/main/dashboard" },
        { name: "Transaction Cash In/Out", icon: "fal fa-briefcase", path: "/main/transaction" },
        { name: "Transaction Inquiry", icon: "fal fa-search", path: "/main/transaction-inquiry" },
        { name: "Audit Logs", icon: "fal fa-scroll", path: "/main/audit-logs" },
      ].filter((item) => isAllowed(item.name)), 
    },
  ];  

  const handleMenuClick = (menuName, path) => {
    setActiveMenu(menuName);
    onMenuClick(menuName, path);
    handleExpandSidebar();
  };
  
  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {collapsed ? ">>" : "<<"}
      </button>
      <ul className="menu-list">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {section.title && section.items.length > 0 && (
              <li className="menu-section-title">
                {!collapsed && section.title}
              </li>
            )}
            {section.items.map((item, idx) => (
              <li
                key={idx}
                className={`menu-item ${
                  activeMenu === item.name ? 'active' : ''
                }`} 
                onClick={() =>
                  item.path
                    ? handleMenuClick(item.name, item.path)
                    : null
                }
              >
                <span className="menu-icon">
                  <i className={item.icon}></i>
                </span>
                {!collapsed && <span className="menu-text">{item.name}</span>}
              </li>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
