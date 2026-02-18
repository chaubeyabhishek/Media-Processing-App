import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="mf-navbar">
      <div className="mf-navInner">

        <div className="mf-logo" onClick={() => navigate("/dashboard")}>
          MediaForge
        </div>

        <div className="mf-navLinks">
          <span onClick={() => navigate("/Dashboard")}>Dashboard</span>
          <span onClick={() => navigate("/convert")}>Convert</span>
          <span onClick={() => navigate("/crop")}>Crop</span>
          <span onClick={() => navigate("/compress")}>Compress</span>
          <span onClick={() => navigate("/pricing")}>Pricing</span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
