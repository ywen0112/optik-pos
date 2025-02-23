import React from "react";
import "../css/EyeRecordTable.css";

const GlassesEyePowerTable = ({ title, eyeRecord }) => {
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
            <th>PRISM</th>
            <th>VA</th>
            <th>ADD</th>
            <th>PD</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Right</td>
            <td>{eyeRecord.r_SPH !== null ? eyeRecord.r_SPH : "-"}</td>
            <td>{eyeRecord.r_CYL !== null ? eyeRecord.r_CYL : "-"}</td>
            <td>{eyeRecord.r_AXIS !== null ? eyeRecord.r_AXIS : "-"}</td>
            <td>{eyeRecord.r_PRISM !== null ? eyeRecord.r_PRISM : "-"}</td>
            <td>{eyeRecord.r_VA !== null ? eyeRecord.r_VA : "-"}</td>
            <td>{eyeRecord.r_ADD !== null ? eyeRecord.r_ADD : "-"}</td>
            <td>{eyeRecord.r_PD !== null ? eyeRecord.r_PD : "-"}</td>
          </tr>
          <tr>
            <td>Left</td>
            <td>{eyeRecord.l_SPH !== null ? eyeRecord.l_SPH : "-"}</td>
            <td>{eyeRecord.l_CYL !== null ? eyeRecord.l_CYL : "-"}</td>
            <td>{eyeRecord.l_AXIS !== null ? eyeRecord.l_AXIS : "-"}</td>
            <td>{eyeRecord.l_PRISM !== null ? eyeRecord.l_PRISM : "-"}</td>
            <td>{eyeRecord.l_VA !== null ? eyeRecord.l_VA : "-"}</td>
            <td>{eyeRecord.l_ADD !== null ? eyeRecord.l_ADD : "-"}</td>
            <td>{eyeRecord.l_PD !== null ? eyeRecord.l_PD : "-"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GlassesEyePowerTable;
