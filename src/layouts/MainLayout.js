import React, { useEffect, useState } from "react";
import { Routes, Route, Outlet, useNavigate, useLocation } from "react-router-dom";
import HeaderBar from "../components/HeaderBar";
import Sidebar from "../components/SideBar";
import "../css/MainLayout.css";

import Dashboard from "../pages/main/Dashboard";
import AuditLogs from "../pages/main/AuditLogs";
import InquiryScreen from "../pages/main/InquiryScreen";
import Transaction from "../pages/main/Transaction";
import CashManagement from "../pages/main/CashManagement";
import SalesInvoice from "../pages/main/SalesInvoice";

import UserMaintenance from "../pages/maintenance/UserMaintenance";
import AccessRightMaintenance from "../pages/maintenance/AccessRightMaintenance";
import DebtorMaintenance from "../pages/maintenance/DebtorMaintenance";
import DebtorTypeMaintenance from "../pages/maintenance/DebtorTypeMaintenance";
import CreditorMaintenance from "../pages/maintenance/CreditorMaintenance";
import CreditorTypeMaintenance from "../pages/maintenance/CreditorTypeMaintenance";
import ItemMaintenance from "../pages/maintenance/ItemMaintenance";
import ItemGroupMaintenance from "../pages/maintenance/ItemGroupMaintenance";
import ItemTypeMaintenance from "../pages/maintenance/ItemTypeMaintenance";
import MemberMaintenance from "../pages/maintenance/MemberMaintenance";
import MemberTypeMaintenance from "../pages/maintenance/MemberTypeMaintenance";
import LocationMaintenance from "../pages/maintenance/LocationMaintenance";
import PWPMaintenance from "../pages/maintenance/PWPMaintenance";

import DebtorReport from "../pages/report/DebtorReport";
import CreditorReport from "../pages/report/CreditorReport";
import ItemReport from "../pages/report/ItemReport";
import MemberReport from "../pages/report/MemberReport";
import TransactionReport from "../pages/report/TransactionReport";
import LocationReport from "../pages/report/LocationReport";
import PWPReport from "../pages/report/PWPReport";

const MainLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState("Dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  const menuMapping = {
    "/main/dashboard": "Dashboard",
    "/main/audit-logs": "Audit Logs",
    "/main/inquiry-screen": "Inquiry Screen",
    "/main/transaction": "Transaction",
    "/main/transaction/cash-management": "Transaction",
    "/main/transaction/sales-invoice": "Transaction",
    "/maintenance/user-maintenance": "User Maintenance",
    "/maintenance/access-right-maintenance": "Access Right Maintenance",
    "/maintenance/debtor-maintenance": "Debtor Maintenance",
    "/maintenance/debtor-type-maintenance": "Debtor Type Maintenance",
    "/maintenance/creditor-maintenance": "Creditor Maintenance",
    "/maintenance/creditor-type-maintenance": "Creditor Type Maintenance",
    "/maintenance/item-maintenance-batch-no": "Item Maintenance",
    "/maintenance/item-group-maintenance": "Item Group Maintenance",
    "/maintenance/item-type-maintenance": "Item Type Maintenance",
    "/maintenance/member-maintenance": "Member Maintenance",
    "/maintenance/member-type-maintenance": "Member Type Maintenance",
    "/maintenance/location-maintenance": "Location Maintenance",
    "/maintenance/pwp-maintenance": "PWP Maintenance",
    "/report/debtor-report": "Debtor Report",
    "/report/creditor-report": "Creditor Report",
    "/report/item-report": "Item Report",
    "/report/member-report": "Member Report",
    "/report/transaction-report": "Transaction Report",
    "/report/location-report": "Location Report",
    "/report/pwp-report": "PWP Report",
  };

  useEffect(() => {
    // Update selectedMenu based on the current route
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
          <div className="main-layout-header">
            <h2>{selectedMenu}</h2>
            <button className="sync-button">Sync Data</button>
          </div>
          <div className="main-layout-content">
            <Routes>
              <Route path="/main/dashboard" element={<Dashboard />} />
              <Route path="/main/audit-logs" element={<AuditLogs />} />
              <Route path="/main/inquiry-screen" element={<InquiryScreen />} />
              <Route path="/main/transaction" element={<Transaction />}>
                <Route path="cash-management" element={<CashManagement />} />
                <Route path="sales-invoice" element={<SalesInvoice />} />
              </Route>
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
