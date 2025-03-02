import React, { useState, useEffect } from "react";
import Select from "react-select";
import "../css/SideBar.css";

const Sidebar = ({ onMenuClick }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(
    JSON.parse(localStorage.getItem("selectedCompany")) || {}
  );

  useEffect(() => {
    const storedCompanies = JSON.parse(localStorage.getItem("companies")) || [];
    setCompanies(storedCompanies);
  }, []);

  useEffect(() => {
    if (selectedCompany && selectedCompany.userId) {
      const storedCompany = JSON.parse(localStorage.getItem("selectedCompany")) || {};
      if (storedCompany.customerId !== selectedCompany.customerId) {
        localStorage.setItem("userId", selectedCompany.userId);
        localStorage.setItem("customerId", selectedCompany.customerId);
        localStorage.setItem("accessRights", JSON.stringify(selectedCompany.accessRight));
        localStorage.setItem("selectedCompany", JSON.stringify(selectedCompany));
        window.location.reload();
      }
    }
  }, [selectedCompany]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleExpandSidebar = () => {
    if (collapsed) setCollapsed(false);
  };

  const accessRights = JSON.parse(localStorage.getItem("accessRights")) || [];

   const isAllowed = (module, alwaysVisible = false) => {
    if (alwaysVisible) return true;
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
        { name: "Company Profile", icon: "fal fa-building", path: "/main/company-profile", alwaysVisible: true },
      ].filter((item) => isAllowed(item.name, item.alwaysVisible)), 
    },
  ];  

  const handleMenuClick = (menuName, path) => {
    setActiveMenu(menuName);
    onMenuClick(menuName, path);
    handleExpandSidebar();
  };

  const handleCompanyChange = (selectedOption) => {
    const selected = companies.find(company => company.customerId.toString() === selectedOption.value);
    setSelectedCompany(selected);
  };

  const companyOptions = companies.map(company => ({
    value: company.customerId.toString(),
    label: company.companyName
  }));

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="toggle-button" onClick={toggleSidebar}>
        {collapsed ? ">>" : "<<"}
      </button>

      {!collapsed && (
        <div className="company-selection">
          <label htmlFor="company-select" className="company-label">Select Company:</label>
          <Select
            id="company-select"
            className="company-dropdown"
            classNamePrefix="company-select"
            value={companyOptions.find(option => option.value === (selectedCompany.customerId?.toString() || ""))}
            onChange={handleCompanyChange}
            options={companyOptions}
            placeholder="Select or type company..."
            isSearchable
            noOptionsMessage={() => "No companies available"}
          />
        </div>
      )}

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
                className={`menu-item ${activeMenu === item.name ? 'active' : ''}`} 
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
