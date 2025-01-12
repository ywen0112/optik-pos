import React, { useState, useEffect, useMemo } from "react";
import "../css/AccessRightCrudModal.css";

const AccessRightCrudModal = ({
  isOpen,
  title,
  data,
  onClose,
  onSave,
  isViewing,
}) => {
  const [formData, setFormData] = useState({
    id: null,
    role: "",
    accessRights: [],
    fullAccess: false,
  });

  const defaultModules = useMemo(
    () => [
      { name: "Dashboard", singlePermission: true },
      { name: "Audit Logs", singlePermission: true },
      { name: "Inquiry Screen", singlePermission: true },
      { name: "Report", singlePermission: true },
      { name: "Transaction - Open/Close Counter, Cash In/Out", singlePermission: true },
      { name: "Transaction - Sales Invoice", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Transaction - Purchase Invoice", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Transaction - Credit Note", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "User Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Access Right Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Debtor Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Debtor Type Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Creditor Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Creditor Type Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Item Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Item Group Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Item Type Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Item Commision Setting", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Member Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Member Type Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Member Point Setting", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Location Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "PWP Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
    ],
    []
  );

  useEffect(() => {
    if (isOpen) {
      // Map defaultModules and merge with the role's existing accessRights
      const accessRights = defaultModules.map((module) => {
        const existingModule = data.accessRights?.find(
          (right) => right.module === module.name
        );
        return {
          module: module.name,
          permissions: existingModule?.permissions || [],
        };
      });

      // Calculate fullAccess state
      const fullAccess = accessRights.every((module) => {
        const moduleDefinition = defaultModules.find((mod) => mod.name === module.module);

        return moduleDefinition?.singlePermission
          ? module.permissions.includes("Allow")
          : module.permissions.length === (moduleDefinition?.permissions?.length || 0);
      });

      setFormData({
        id: data.id || null,
        role: data.role || "",
        accessRights,
        fullAccess,
      });
    } else {
      // Reset form when modal is closed
      setFormData({
        id: null,
        role: "",
        accessRights: defaultModules.map((module) => ({
          module: module.name,
          permissions: [],
        })),
        fullAccess: false,
      });
    }
  }, [isOpen, data, defaultModules]);

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
  };

  const handleFullAccessChange = () => {
    setFormData((prevState) => {
      const fullAccess = !prevState.fullAccess;

      const updatedRights = defaultModules.map((module) => ({
        module: module.name,
        permissions: fullAccess
          ? module.singlePermission
            ? ["Allow"]
            : module.permissions || []
          : [],
      }));

      return { ...prevState, accessRights: updatedRights, fullAccess };
    });
  };

  const handleModuleCheckboxChange = (moduleName, permissions = []) => {
    setFormData((prevState) => {
      const updatedRights = prevState.accessRights.map((module) => {
        if (module.module === moduleName) {
          const isAllSelected = permissions.every((permission) =>
            module.permissions?.includes(permission)
          );

          return {
            ...module,
            permissions: isAllSelected ? [] : permissions,
          };
        }
        return module;
      });

      const fullAccess = defaultModules.every((module) => {
        const moduleRights = updatedRights.find(
          (right) => right.module === module.name
        );
        return module.singlePermission
          ? moduleRights?.permissions.includes("Allow")
          : moduleRights?.permissions.length ===
              (module.permissions?.length || 0);
      });

      return { ...prevState, accessRights: updatedRights, fullAccess };
    });
  };

  const handlePermissionChange = (moduleName, permission) => {
    setFormData((prevState) => {
      const updatedRights = prevState.accessRights.map((module) => {
        if (module.module === moduleName) {
          const permissions = module.permissions.includes(permission)
            ? module.permissions.filter((perm) => perm !== permission)
            : [...module.permissions, permission];

          return { ...module, permissions };
        }
        return module;
      });

      const fullAccess = defaultModules.every((module) => {
        const moduleRights = updatedRights.find(
          (right) => right.module === module.name
        );
        return module.singlePermission
          ? moduleRights?.permissions.includes("Allow")
          : moduleRights?.permissions.length ===
              (module.permissions?.length || 0);
      });

      return { ...prevState, accessRights: updatedRights, fullAccess };
    });
  };

  const handleSave = () => {
    if (!formData.role) {
      alert("Role name is required.");
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>{title}</h3>
        <div className="popup-form">
          <div className="form-group">
            <label>User Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={handleRoleChange}
              disabled={isViewing}
              placeholder="Enter user role"
            />
          </div>

          <div className="access-rights">
            <label>Access Rights</label>
            <div className="modules">
              <div className="module-group">
                <div className="module-title">
                  <div className="module-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.fullAccess}
                      onChange={handleFullAccessChange}
                      disabled={isViewing}
                    />
                  </div>
                  <span>Full Access</span>
                </div>
              </div>

              {defaultModules.map((module) => (
                <div key={module.name} className="module-group">
                  <div className="module-title">
                    <div className="module-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          module.singlePermission
                            ? formData.accessRights.find((right) => right.module === module.name)
                                ?.permissions.includes("Allow")
                            : formData.accessRights.find((right) => right.module === module.name)
                                ?.permissions.length === (module.permissions || []).length
                        }
                        onChange={() =>
                          handleModuleCheckboxChange(
                            module.name,
                            module.singlePermission ? ["Allow"] : module.permissions
                          )
                        }
                        disabled={isViewing}
                      />
                    </div>
                    <span>{module.name}</span>
                  </div>
                  {!module.singlePermission && (
                    <div className="permissions">
                      {module.permissions.map((permission) => (
                        <label key={permission}>
                          <div className="module-checkbox">
                            <input
                              type="checkbox"
                              checked={formData.accessRights.find(
                                (right) => right.module === module.name
                              )?.permissions.includes(permission)}
                              onChange={() =>
                                handlePermissionChange(module.name, permission)
                              }
                              disabled={isViewing}
                            />
                          </div>
                          {permission}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="popup-buttons">
          {!isViewing && (
            <>
              <button className="save-button" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-button" onClick={onClose}>
                Cancel / Close
              </button>
            </>
          )}
          {isViewing && (
            <button className="cancel-button" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccessRightCrudModal;
