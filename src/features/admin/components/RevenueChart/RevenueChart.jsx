import React from "react";
import "./RevenueChart.css";

export default function RevenueChart({ data, title, type = "daily" }) {
  if (!data || data.length === 0) {
    return (
      <div className="revenue-chart">
        <h3>{title}</h3>
        <div className="chart-empty">Không có dữ liệu</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.amount || d.count || 0));

  return (
    <div className="revenue-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        {data.map((item, index) => {
          const value = item.amount || item.count || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const label = type === "monthly" ? item.month : item.date;

          return (
            <div key={index} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{ height: `${height}%` }}
                  title={`${label}: ${value.toLocaleString("vi-VN")}${type === "daily" ? "₫" : ""}`}
                >
                  <span className="chart-value">
                    {value > 0 && (value / 1000000 >= 1
                      ? `${(value / 1000000).toFixed(1)}M`
                      : value >= 1000
                      ? `${(value / 1000).toFixed(1)}K`
                      : value)}
                  </span>
                </div>
              </div>
              <div className="chart-label">
                {type === "monthly"
                  ? label.split("-")[1] || label
                  : new Date(label).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                    })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

