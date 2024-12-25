import React, { useState } from "react";
import "../css/SideBar.css";

const Sidebar = ({ onMenuClick }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const sections = [
    {
      title: null,
      items: [
        { name: "Dashboard", icon: "🏠", path: "/main/dashboard/" },
        { name: "Audit Logs", icon: "📜", path: "/main/audit-logs" },
        { name: "Inquiry Screen", icon: "🔍", path: "/main/inquiry-screen" },
        { name: "Transaction", icon: "💼", path: "/main/transaction" },
      ],
    },
    {
      title: "MAINTENANCE",
      items: [
        { name: "User Maintenance", icon: "👤", path: "/maintenance/user-maintenance" },
        { name: "Access Right Maintenance", icon: "🔐", path: "/maintenance/access-right-maintenance" },
        { name: "Debtor Maintenance", icon: "💳", path: "/maintenance/debtor-maintenance" },
        { name: "Debtor Type Maintenance", icon: "📊", path: "/maintenance/debtor-type-maintenance" },
        { name: "Creditor Maintenance", icon: "🏦", path: "/maintenance/creditor-maintenance" },
        { name: "Creditor Type Maintenance", icon: "📝", path: "/maintenance/creditor-type-maintenance" },
        { name: "Item Maintenance/Batch No", icon: "📦", path: "/maintenance/item-maintenance-batch-no" },
        { name: "Item Group Maintenance", icon: "📂", path: "/maintenance/item-group-maintenance" },
        { name: "Item Type Maintenance", icon: "🔖", path: "/maintenance/item-type-maintenance" },
        { name: "Member Maintenance", icon: "👥", path: "/maintenance/member-maintenance" },
        { name: "Member Type Maintenance", icon: "🛠️", path: "/maintenance/member-type-maintenance" },
        { name: "Location Maintenance", icon: "📍", path: "/maintenance/location-maintenance" },
        { name: "PWP Maintenance", icon: "🛒", path: "/maintenance/pwp-maintenance" },
      ],
    },
    {
      title: "REPORT",
      items: [
        { name: "Debtor Report", icon: "📑", path: "/report/debtor-report" },
        { name: "Creditor Report", icon: "📄", path: "/report/creditor-report" },
        { name: "Item Report", icon: "📋", path: "/report/item-report" },
        { name: "Member Report", icon: "📃", path: "/report/member-report" },
      ],
    },
  ];

  const handleMenuClick = (menuName, path) => {
    setActiveMenu(menuName);
    onMenuClick(menuName, path); 
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {collapsed ? ">>" : "<<"}
      </button>
      <ul className="menu-list">
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {section.title && (
              <li className="menu-section-title">
                {!collapsed && section.title}
              </li>
            )}
            {section.items.map((item, idx) => (
              <li
                key={idx}
                className={`menu-item ${
                  activeMenu === item.name ? "active" : ""
                }`}
                onClick={() => handleMenuClick(item.name, item.path)}
              >
                <span className="menu-icon">{item.icon}</span>
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
