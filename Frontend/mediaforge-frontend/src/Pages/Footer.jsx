import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footerContainer">

        <div className="footerBrand">
          <h2>MediaForge</h2>
          <p>Powerful tools to resize, convert and crop your media easily.</p>
        </div>

        
        <div className="footerLinks">
          <h3>Tools</h3>
          <a href="/resize">Resize Image</a>
          <a href="/convert">Convert Image</a>
          <a href="/crop">Crop Image</a>
        </div>

        {/* RIGHT */}
        <div className="footerLinks">
          <h3>Company</h3>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>

      </div>

      {/* Bottom */}
      <div className="footerBottom">
        © {new Date().getFullYear()} MediaForge • Built with ❤️ by Abhishek
      </div>

    </footer>
  );
};

export default Footer;
