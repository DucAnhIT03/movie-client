import React from "react";
import "./Promo.css";

export default function Promo({ promos }) {
  return (
    <div className="promo">
      <div className="option">
        <h3>Khuyến mãi</h3>
        <h3>Xem tất cả</h3>
      </div>
      {promos.map((p) => (
        <img key={p.id} src={p.img} alt="promo" />
      ))}
    </div>
  );
}
