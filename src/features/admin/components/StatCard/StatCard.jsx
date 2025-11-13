import React from "react";
import "./StatCard.css";

export default function StatCard({ title, value, icon, color = "#1e3c72" }) {
  const formatValue = (val) => {
    if (typeof val === "number") {
      // Format số lớn với dấu phẩy
      return val.toLocaleString("vi-VN");
    }
    return val;
  };

  return (
    <div className="stat-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="stat-card-header">
        <h3>{title}</h3>
        {icon && <div className="stat-icon">{icon}</div>}
      </div>
      <p className="stat-value" style={{ color }}>
        {formatValue(value)}
      </p>
    </div>
  );
}

