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

  const sections = [
    {
      title: null,
      items: [
        { name: "Dashboard", icon: "🏠", path: "/main/dashboard/" },
        { name: "Audit Logs", icon: "📜", path: "/main/audit-logs" },
        { name: "Inquiry Screen", icon: "🔍", path: "/main/inquiry-screen" },
        {
          name: "Transaction",
          icon: "💼",
          path: "/main/transaction",
          submenus: [
            { name: "Sales Invoice", icon: "🧾", path: "/main/transaction/sales-invoice" },
            { name: "Purchase Invoice", icon: "🧾", path: "/main/transaction/purchase-invoice" },
            { name: "Credit Note", icon: "🧾", path: "/main/transaction/credit-note" },
          ],
        },
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
        { name: "Debtor Report", icon: "📄", path: "/report/debtor-report" },
        { name: "Creditor Report", icon: "📄", path: "/report/creditor-report" },
        { name: "Item Report", icon: "📄", path: "/report/item-report" },
        { name: "Member Report", icon: "📄", path: "/report/member-report" },
        { name: "Transaction Report", icon: "📄", path: "/report/transaction-report" },
        { name: "Location Report", icon: "📄", path: "/report/location-report" },
        { name: "PWP Report", icon: "📄", path: "/report/pwp-report" },
      ],
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
            {section.title && (
              <li className="menu-section-title">
                {!collapsed && section.title}
              </li>
            )}
            {section.items.map((item, idx) => (
              <React.Fragment key={idx}>
                <li
                  className={`menu-item ${
                    activeMenu === item.name ? "active" : ""
                  }`}
                  onClick={() =>
                    item.path
                      ? handleMenuClick(item.name, item.path)
                      : null
                  }
                >
                  <span className="menu-icon">{item.icon}</span>
                  {!collapsed && <span className="menu-text">{item.name}</span>}
                </li>
                {item.submenus && !collapsed && (
                  <ul className="submenu-list">
                    {item.submenus.map((submenu, subIdx) => (
                      <li
                        key={subIdx}
                        className={`submenu-item ${
                          activeMenu === submenu.name ? "active" : ""
                        }`}
                        onClick={() =>
                          handleMenuClick(submenu.name, submenu.path)
                        }
                      >
                        <span>{submenu.icon}</span>
                        <span className="submenu-text">{submenu.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
