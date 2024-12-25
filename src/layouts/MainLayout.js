import React, { useState } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/SideBar";
import "../css/MainLayout.css";

import Dashboard from "../pages/main/Dashboard";
import AuditLogs from "../pages/main/AuditLogs";
import InquiryScreen from "../pages/main/InquiryScreen";
import Transaction from "../pages/main/Transaction";

import UserMaintenance from "../pages/maintenance/UserMaintenance";
import AccessRightMaintenance from "../pages/maintenance/AccessRightMaintenance";
import DebtorMaintenance from "../pages/maintenance/DebtorMaintenance";
import DebtorTypeMaintenance from "../pages/maintenance/DebtorTypeMaintenance";
import CreditorMaintenance from "../pages/maintenance/CreditorMaintenance";
import CreditorTypeMaintenance from "../pages/maintenance/CreditorTypeMaintenance";
import ItemMaintenance from "../pages/maintenance/ItemMaintenance";
import ItemGroupMaintenance from "../pages/maintenance/ItemGroupMaintenance";
import ItemTypeMaintenance from "../pages/maintenance/ItemTypeMaintenance";
import MemberMaintenance from "../pages/maintenance/MamberMaintenance";
import MemberTypeMaintenance from "../pages/maintenance/MemberTypeMaintenance";
import LocationMaintenance from "../pages/maintenance/LocationMaintenance";
import PWPMaintenance from "../pages/maintenance/PWPMaintenance";

import DebtorReport from "../pages/report/DebtorReport";
import CreditorReport from "../pages/report/CreditorReport";
import ItemReport from "../pages/report/ItemReport";
import MemberReport from "../pages/report/MemberReport";

const MainLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const navigate = useNavigate();

  const handleMenuClick = (menuName, routePath) => {
    setSelectedMenu(menuName);
    navigate(routePath);
  };

  return (
    <div className="main-layout-container">
      <HeaderBar />
      <div className="main-container">
        <Sidebar onMenuClick={handleMenuClick} />
        <div className="content-area">
          <div className="main-layout-header">
            <h2>{selectedMenu}</h2>
            <button className="sync-button">Sync Data</button>
          </div>
          <div className="main-layout-content">
          <Routes>
              <Route path="/main/dashboard" element={<Dashboard />} />
              <Route path="/main/audit-logs" element={<AuditLogs />} />
              <Route path="/main/inquiry-screen" element={<InquiryScreen />} />
              <Route path="/main/transaction" element={<Transaction />} />
              {/* Maintenance Routes */}
              <Route path="/maintenance/user-maintenance" element={<UserMaintenance />} /> 
              <Route path="/maintenance/access-right-maintenance" element={<AccessRightMaintenance />} />
              <Route path="/maintenance/debtor-maintenance" element={<DebtorMaintenance />} />
              <Route path="/maintenance/debtor-type-maintenance" element={<DebtorTypeMaintenance />} />
              <Route path="/maintenance/creditor-maintenance" element={<CreditorMaintenance />} />
              <Route path="/maintenance/creditor-type-maintenance" element={<CreditorTypeMaintenance />} />
              <Route path="/maintenance/item-maintenance-batch-no" element={<ItemMaintenance />} />
              <Route path="/maintenance/item-group-maintenance" element={<ItemGroupMaintenance />} />
              <Route path="/maintenance/item-type-maintenance" element={<ItemTypeMaintenance />} />
              <Route path="/maintenance/member-maintenance" element={<MemberMaintenance />} />
              <Route path="/maintenance/member-type-maintenance" element={<MemberTypeMaintenance />} />
              <Route path="/maintenance/location-maintenance" element={<LocationMaintenance />} />
              <Route path="/maintenance/pwp-maintenance" element={<PWPMaintenance />} />
              {/* Report Routes */}
              <Route path="/report/debtor-report" element={<DebtorReport />} />
              <Route path="/report/creditor-report" element={<CreditorReport />} />
              <Route path="/report/item-report" element={<ItemReport />} />
              <Route path="/report/member-report" element={<MemberReport />} />
              {/* Catch-All Redirect */}
              <Route path="*" element={<Dashboard />} />
              </Routes>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
