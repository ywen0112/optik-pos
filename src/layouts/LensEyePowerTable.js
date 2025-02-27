import React from "react";
import "../css/EyeRecordTable.css";

const LensEyePowerTable = ({ title, eyeRecord, editable, onChange }) => {
  if (!eyeRecord) {
    return (
      <div className="eye-power-container">
        {title && <h5>{title}</h5>}
        <p>No data available.</p>
      </div>
    );
  }

  const handleInputChange = (field, value) => {
    if (onChange) {
      onChange({ ...eyeRecord, [field]: value });
    }
  };

  return (
    <div className="eye-power-container">
      {title && <h5>{title}</h5>}
      <table className="eye-record-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>SPH</th>
            <th>CYL</th>
            <th>AXIS</th>
            <th>BC</th>
            <th>DIA</th>
            <th>K_READING</th>
          </tr>
        </thead>
        <tbody>
          {["r", "l"].map((side) => (
            <tr key={side}>
              <td>{side === "r" ? "Right" : "Left"}</td>
              {["SPH", "CYL", "AXIS", "BC", "DIA", "K_READING"].map((param) => {
                const field = `${side}_${param}`;
                return (
                  <td key={field}>
                    {editable ? (
                      <input
                        type="number"
                        value={eyeRecord[field] ?? ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                      />
                    ) : (
                      eyeRecord[field] ?? "-"
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LensEyePowerTable;
