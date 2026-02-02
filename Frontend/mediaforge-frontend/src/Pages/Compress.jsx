import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Compress.css";

const Compress = () => {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(60);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("quality", quality);

    try {
      setLoading(true);
      setMessage("");
      setDownloadUrl(null);

      const res = await axios.post(
        "http://localhost:4000/api/v1/media/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setDownloadUrl(res.data.media.imageUrl);
      setMessage("✅ Image compressed. Ready to download!");
    } catch (error) {
      console.error("Compress error 👉", error);
      setMessage("❌ Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 REAL DOWNLOAD (SYSTEM ME SAVE)
  const handleDownload = async () => {
    try {
      const response = await fetch(downloadUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = "compressed-image.jpg"; // filename
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error 👉", error);
    }
  };

  return (
    <div className="compress-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-inner">
          <div className="logo" onClick={() => navigate("/dashboard")}>
            MediaForge
          </div>

          <div className="nav-links">
            <span onClick={() => navigate("/resize")}>Resize</span>
            <span onClick={() => navigate("/convert")}>Convert</span>
            <span onClick={() => navigate("/crop")}>Crop</span>
            <span className="active">Compress</span>
            <span onClick={() => navigate("/pricing")}>Pricing</span>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="compress-wrapper">
        <h2 className="compress-title">Compress Image</h2>

        <div className="compress-card">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <label>
            Compression Quality: <strong>{quality}%</strong>
          </label>

          <input
            type="range"
            min="20"
            max="90"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
          />

          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Compressing..." : "Compress & Upload"}
          </button>

          {message && <p className="message">{message}</p>}

          {/* 🔥 REAL DOWNLOAD BUTTON */}
          {downloadUrl && (
            <button className="download-btn" onClick={handleDownload}>
              ⬇️ Download Image
            </button>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        © {new Date().getFullYear()} MediaForge • All rights reserved
      </footer>
    </div>
  );
};

export default Compress;
