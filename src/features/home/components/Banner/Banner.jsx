import React from "react";
import "./Banner.css";

export default function Banner({ banner }) {
  return (
    <div className="banner">
      <button className="nav-btn left">{"\u276E"}</button> 
      <img src={banner} alt="banner" />
      <button className="nav-btn right">{"\u276F"}</button> 
    </div>
  );
}
