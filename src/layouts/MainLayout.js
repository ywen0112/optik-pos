import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../header/HeaderBar";
import Sidebar from "./SideBar";
import "../css/MainLayout.css";

import Dashboard from "../pages/overview/Dashboard";
import AuditLogs from "../pages/overview/AuditLogs";
import InquiryScreen from "../pages/overview/InquiryScreen";
import Transaction from "../pages/overview/Transaction";

import Maintenance from "../pages/maintenance/Maintenance";
import UserMaintenance from "../pages/maintenance/UserMaintenance";
import AccessRightMaintenance from "../pages/maintenance/AccessRightMaintenance";
import DebtorMaintenance from "../pages/maintenance/DebtorMaintenance";
import CreditorMaintenance from "../pages/maintenance/CreditorMaintenance";
import ItemMaintenance from "../pages/maintenance/ItemMaintenance";
import MemberMaintenance from "../pages/maintenance/MemberMaintenance";
import LocationMaintenance from "../pages/maintenance/LocationMaintenance";
import PWPMaintenance from "../pages/maintenance/PWPMaintenance";

import Report from "../pages/report/Report";
import DebtorReport from "../pages/report/DebtorReport";
import CreditorReport from "../pages/report/CreditorReport";
import ItemReport from "../pages/report/ItemReport";
import MemberReport from "../pages/report/MemberReport";
import TransactionReport from "../pages/report/TransactionReport";
import LocationReport from "../pages/report/LocationReport";
import PWPReport from "../pages/report/PWPReport";

import Profile from "../header/Profile";

const MainLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const menuMapping = {
    "/main/dashboard": "Dashboard",
    "/main/audit-logs": "Audit Logs",
    "/main/transaction-inquiry": "Inquiry Screen",
    "/main/transaction": "Transaction",
    "/maintenance": "Maintenance",
    "/maintenance/user-maintenance": "User Maintenance",
    "/maintenance/access-right-maintenance": "Access Right Maintenance",
    "/maintenance/debtor-maintenance": "Debtor Maintenance",
    "/maintenance/creditor-maintenance": "Creditor Maintenance",
    "/maintenance/item-maintenance-batch-no": "Item Maintenance",
    "/maintenance/member-maintenance": "Member Maintenance",
    "/maintenance/location-maintenance": "Location Maintenance",
    "/maintenance/pwp-maintenance": "PWP Maintenance",
    "/report": "Report",
    "/report/debtor-report": "Debtor Report",
    "/report/creditor-report": "Creditor Report",
    "/report/item-report": "Item Report",
    "/report/member-report": "Member Report",
    "/report/transaction-report": "Transaction Report",
    "/report/location-report": "Location Report",
    "/report/pwp-report": "PWP Report",
    "/profile": "Profile"
  };

  useEffect(() => {
    const currentMenu = menuMapping[location.pathname] || "Dashboard";
    setSelectedMenu(currentMenu);
  }, [location.pathname]);

  const handleMenuClick = (menuName, routePath) => {
    const currentPath = location.pathname;
    if (menuName === "Transaction" && currentPath.startsWith("/main/transaction")) {
      return;
    }
    setSelectedMenu(menuName);
    navigate(routePath);
  };

  return (
    <div className="main-layout-container">
      <HeaderBar />
      <div className="main-container">
        <Sidebar onMenuClick={handleMenuClick} />
        <div className="content-area">
          <div className="main-layout-content">
            <Routes>
              <Route path="/main/dashboard" element={<Dashboard />} />
              <Route path="/main/audit-logs" element={<AuditLogs />} />
              <Route path="/main/transaction-inquiry" element={<InquiryScreen />} />
              <Route path="/main/transaction" element={<Transaction />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/maintenance/user-maintenance" element={<UserMaintenance />} />
              <Route path="/maintenance/access-right-maintenance" element={<AccessRightMaintenance />} />
              <Route path="/maintenance/debtor-maintenance" element={<DebtorMaintenance />} />
              <Route path="/maintenance/creditor-maintenance" element={<CreditorMaintenance />} />
              <Route path="/maintenance/item-maintenance-batch-no" element={<ItemMaintenance />} />
              <Route path="/maintenance/member-maintenance" element={<MemberMaintenance />} />
              <Route path="/maintenance/location-maintenance" element={<LocationMaintenance />} />
              <Route path="/maintenance/pwp-maintenance" element={<PWPMaintenance />} />
              {/* Report Routes */}
              <Route path="/report" element={<Report />} />
              <Route path="/report/debtor-report" element={<DebtorReport />} />
              <Route path="/report/creditor-report" element={<CreditorReport />} />
              <Route path="/report/item-report" element={<ItemReport />} />
              <Route path="/report/member-report" element={<MemberReport />} />
              <Route path="/report/transaction-report" element={<TransactionReport />} />
              <Route path="/report/location-report" element={<LocationReport />} />
              <Route path="/report/pwp-report" element={<PWPReport />} />
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
