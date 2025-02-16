import React, { useState, useEffect, useMemo } from "react";
import "../css/AccessRightCrudModal.css";
import ErrorModal from "./ErrorModal";

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
  const [errors, setErrors] = useState({});
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: "", message: "" });

  const defaultModules = useMemo(
    () => [
      { name: "Dashboard", singlePermission: true },
      { name: "Audit Logs", singlePermission: true },
      { name: "Inquiry Screen", singlePermission: true },
      { name: "Report", singlePermission: true },
      { name: "Transaction Cash In/Out", singlePermission: true },
      { name: "Transaction Sales Invoice", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Transaction Purchase Invoice", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Transaction Credit Note", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "User Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Access Right Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Debtor Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Creditor Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Item Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Member Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "Location Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
      { name: "PWP Maintenance", permissions: ["View", "Add", "Edit", "Delete"] },
    ],
    []
  );

  useEffect(() => {
    if (isOpen) {
      const accessRights = defaultModules.map((module) => {
        const existingModule = data.accessRights?.find(
          (right) => right.module === module.name
        );
        return {
          module: module.name,
          permissions: existingModule?.permissions || [],
        };
      });

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
      setFormData({
        id: null,
        role: "",
        accessRights: defaultModules.map((module) => ({
          module: module.name,
          permissions: [],
        })),
        fullAccess: false,
      });
      setErrors({});
    }
  }, [isOpen, data, defaultModules]);

  const validateFields = () => {
    const validationErrors = {};
    if (!formData.role.trim()) {
      validationErrors.role = "Role is required.";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };


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
          const isChecked = module.permissions.length === 0; // If unchecked, enable all
  
          return {
            ...module,
            permissions: isChecked ? permissions : [], // If checked, set all permissions; else, clear them
            allow: isChecked, // ✅ Ensure allow is true when selecting module
          };
        }
        return module;
      });
  
      return { ...prevState, accessRights: updatedRights };
    });
  };
  
  const handlePermissionChange = (moduleName, permission) => {
    setFormData((prevState) => {
      const updatedRights = prevState.accessRights.map((module) => {
        if (module.module === moduleName) {
          const updatedPermissions = module.permissions.includes(permission)
            ? module.permissions.filter((perm) => perm !== permission) // Remove if unchecked
            : [...module.permissions, permission]; // Add if checked
  
          const hasAnyPermission = updatedPermissions.length > 0;
  
          return {
            ...module,
            permissions: updatedPermissions,
            allow: hasAnyPermission, // ✅ Ensure allow is set to true if at least one permission is checked
          };
        }
        return module;
      });
  
      return { ...prevState, accessRights: updatedRights };
    });
  };  

  const handleSave = () => {
    if (!validateFields()) {
      setErrorModal({
        isOpen: true,
        title: "Error",
        message: "Please fill out all required fields.",
      });
      return;
    }
  
    setFormData((prevState) => {
      const updatedAccessRights = prevState.accessRights.map((module) => {
        const isSinglePermissionModule = [
          "Dashboard", "Audit Logs", "Inquiry Screen", "Report", "Transaction Cash In/Out"
        ].includes(module.module);
  
        const hasAtLeastOnePermission = module.permissions.length > 0;
  
        // ✅ Fix: If single permission module and allow is selected, enable all actions
        if (isSinglePermissionModule && hasAtLeastOnePermission) {
          return {
            module: module.module,
            allow: true,
            add: true,
            edit: true,
            view: true,
            delete: true,
          };
        }
  
        // ✅ For multi-permission modules, allow is true if at least one permission is selected
        return {
          module: module.module,
          allow: hasAtLeastOnePermission,
          add: module.permissions.includes("Add"),
          edit: module.permissions.includes("Edit"),
          view: module.permissions.includes("View"),
          delete: module.permissions.includes("Delete"),
        };
      });
  
      console.log("🚀 Updated Permissions Before API Call:", JSON.stringify(updatedAccessRights));
  
      if (prevState.fullAccess) {
        updatedAccessRights.forEach((module) => {
          module.allow = true;
          module.add = true;
          module.edit = true;
          module.view = true;
          module.delete = true;
        });
      }
  
      onSave({
        ...prevState,
        accessRights: updatedAccessRights,
      });
  
      return prevState;
    });
  };
  

  const closeErrorModal = () => {
    setErrorModal({ isOpen: false, title: "", message: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="access-popup-content">
        <h3>{title}</h3>
        <div className="access-popup-form">
          <div className="form-group">
            <label>User Role</label>
            <input
              type="text"
              value={formData.role}
              onChange={handleRoleChange}
              disabled={isViewing}
              placeholder="Enter user role"
              className={errors.role ? "input-error" : ""}
            />
            {errors.role && <span className="error-message">{errors.role}</span>}
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
                            checked={!!formData.accessRights.find(
                              (right) => right.module === module.name
                            )?.permissions.includes(permission)}
                            onChange={() => handlePermissionChange(module.name, permission)}
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

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={closeErrorModal}
      />
    </div>
  );
};

export default AccessRightCrudModal;
