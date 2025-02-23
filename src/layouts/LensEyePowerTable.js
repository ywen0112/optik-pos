import React from "react";
import "../css/EyeRecordTable.css";

const LensEyePowerTable = ({ title, eyeRecord }) => {
  if (!eyeRecord) {
    return (
      <div className="eye-power-container">
        {title && <h5>{title}</h5>}
        <p>No data available.</p>
      </div>
    );
  }

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
          <tr>
            <td>Right</td>
            <td>{eyeRecord.r_SPH !== null ? eyeRecord.r_SPH : "-"}</td>
            <td>{eyeRecord.r_CYL !== null ? eyeRecord.r_CYL : "-"}</td>
            <td>{eyeRecord.r_AXIS !== null ? eyeRecord.r_AXIS : "-"}</td>
            <td>{eyeRecord.r_BC !== null ? eyeRecord.r_BC : "-"}</td>
            <td>{eyeRecord.r_DIA !== null ? eyeRecord.r_DIA : "-"}</td>
            <td>{eyeRecord.r_K_READING !== null ? eyeRecord.r_K_READING : "-"}</td>
          </tr>
          <tr>
            <td>Left</td>
            <td>{eyeRecord.l_SPH !== null ? eyeRecord.l_SPH : "-"}</td>
            <td>{eyeRecord.l_CYL !== null ? eyeRecord.l_CYL : "-"}</td>
            <td>{eyeRecord.l_AXIS !== null ? eyeRecord.l_AXIS : "-"}</td>
            <td>{eyeRecord.l_BC !== null ? eyeRecord.l_BC : "-"}</td>
            <td>{eyeRecord.l_DIA !== null ? eyeRecord.l_DIA : "-"}</td>
            <td>{eyeRecord.l_K_READING !== null ? eyeRecord.l_K_READING : "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LensEyePowerTable;
