import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {
  Upload,
  Zap,
  Image,
  Shuffle,
  ArrowRight,
  Sparkles,
} from "lucide-react";


export default function ImageProcessorLanding() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Zap />,
      title: "Lightning Fast Compression",
      description:
        "Reduce file sizes by up to 90% without losing quality. Perfect for web optimization.",
    },
    {
      icon: <Upload />,
      title: "Batch Upload",
      description:
        "Process multiple images at once. Save time with intelligent batch processing.",
    },
    {
      icon: <Shuffle />,
      title: "Format Conversion",
      description:
        "Convert between JPG, PNG, WebP, AVIF and more formats easily.",
    },
    {
      icon: <Image />,
      title: "Quality Preservation",
      description:
        "Advanced algorithms ensure your images stay sharp and clear.",
    },
  ];

  const formats = ["JPG", "PNG", "WebP", "AVIF", "GIF", "HEIC"];

  return (
    <div className="landing-wrapper">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo">
            <Sparkles />
            <span>ImageFlow</span>
          </div>

          <div className="nav-links">
            <a href="#features">Features</a>
            <Link to = "/pricing">
            <a href="#pricing">Pricing</a>
            </Link>
            
            <a href="#about">About</a>
          </div>

          <Link to = "/login">
           <button className="btn-primary">Get Started</button>
          </Link>
             
          
          
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div
          className="hero-bg"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        />

        <div className="hero-content">
          <span className="badge">Professional Image Processing</span>

          <h1>
            Transform Your Images
            <br />
            <span>In Seconds</span>
          </h1>

          <p>
            Compress, convert, and optimize your images with modern cloud
            technology.
          </p>

          <div className="hero-actions">
            <button className="btn-primary">
              Start Processing <ArrowRight />
            </button>
            <button className="btn-outline">Watch Demo</button>
          </div>
        </div>

        {/* FORMAT PILLS */}
        <div className="format-pills">
          {formats.map((f) => (
            <div key={f} className="pill">
              {f}
            </div>
          ))}
        </div>

        {/* UPLOAD BOX */}
        <div className="upload-box">
          <Upload />
          <h3>Drop your images here</h3>
          <p>or click to browse</p>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features">
        <h2>Powerful Features</h2>

        <div className="feature-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Ready to Transform Your Images?</h2>
        <p>Join thousands of creators using ImageFlow</p>
        <Link to = "/login">
        <button className="btn-primary">
          Get Started Free <ArrowRight />
        </button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <Sparkles />
        <p>© 2025 ImageFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}
