import React from "react";
import "./TopList.css";

export default function TopList({ title, items, type = "movies" }) {
  if (!items || items.length === 0) {
    return (
      <div className="top-list">
        <h3>{title}</h3>
        <div className="list-empty">Không có dữ liệu</div>
      </div>
    );
  }

  const formatRevenue = (amount) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ₫`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ₫`;
    }
    return `${amount.toLocaleString("vi-VN")} ₫`;
  };

  return (
    <div className="top-list">
      <h3>{title}</h3>
      <div className="top-list-items">
        {items.map((item, index) => (
          <div key={index} className="top-list-item">
            <div className="item-rank">
              <span className={`rank-badge rank-${index + 1}`}>
                {index + 1}
              </span>
            </div>
            <div className="item-info">
              <div className="item-name">
                {type === "movies" ? item.title : item.name}
              </div>
              <div className="item-revenue">
                {formatRevenue(item.revenue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

