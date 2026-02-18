import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// 📊 Graph
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 Fetch user
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(res.data);
      } catch (error) {
        console.error("Dashboard fetch error 👉", error);
        localStorage.removeItem("token");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate, token]);

  // 🔐 Safe render
  if (loading || !user) {
    return (
      <div style={styles.wrapper}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  // 📊 Calculations
  const dailyLimit =
    user.dailyLimit === "Unlimited" ? 10 : user.dailyLimit;

  const used = user.dailyUploadCount || 0;
  const remaining = dailyLimit - used;
  const percentUsed = Math.min((used / dailyLimit) * 100, 100);

  const graphData = [{ name: "Today", uploads: used }];

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      {/* 🔥 TOP NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.navInner}>
          <div style={styles.logo} onClick={() => navigate("/dashboard")}>
            MediaForge
          </div>

          <div style={styles.navLinks}>
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/convert")}>Convert</span>
            <span onClick={() => navigate("/crop")}>Crop</span>
            <span onClick={() => navigate("/compress")}>Compress</span>
            <span onClick={() => navigate("/pricing")}>Pricing</span>
          </div>

          <button style={styles.logoutBtnSmall} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* 🔥 MAIN CONTENT */}
      <div style={styles.wrapper}>
        <h2 style={styles.title}>Dashboard</h2>

        {/* GRID */}
        <div style={styles.grid}>
          {/* LEFT SIDE */}
          <div>
            {/* USER INFO */}
            <div style={styles.card}>
              <h3>User Info</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Subscription:</strong>{" "}
                <span style={styles.badge}>{user.subscription}</span>
              </p>
            </div>

            {/* QUOTA */}
            <div style={styles.card}>
              <h3>Daily Upload Quota</h3>
              <p>
                {remaining} / {dailyLimit} images remaining today
              </p>

              <div style={styles.bar}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${percentUsed}%`,
                  }}
                />
              </div>

              {remaining <= 0 && (
                <p style={{ color: "#fecaca", marginTop: 10 }}>
                  Daily limit reached. Upgrade to PRO.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT SIDE – GRAPH */}
          <div>
            <div style={styles.card}>
              <h3>Today's Upload Activity</h3>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={graphData}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="uploads" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div style={styles.actions}>
          <button
            style={styles.primaryBtn}
            disabled={remaining <= 0}
            onClick={() => navigate("/upload")}
          >
            🚀 Start Upload
          </button>

          <button
            style={styles.secondaryBtn}
            onClick={() => navigate("/my-media")}
          >
            📁 My Media
          </button>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

/* 🎨 INLINE STYLES */
const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    backdropFilter: "blur(12px)",
    background: "rgba(2,6,23,0.7)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    zIndex: 50,
  },

  navInner: {
    maxWidth: 1200,
    margin: "auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(90deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  navLinks: {
    display: "flex",
    gap: 20,
    color: "#cbd5f5",
    cursor: "pointer",
  },

  logoutBtnSmall: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "1px solid rgba(239,68,68,0.4)",
    background: "rgba(239,68,68,0.25)",
    color: "#fecaca",
    cursor: "pointer",
  },

  wrapper: {
    minHeight: "100vh",
    padding: "140px 24px",
    background:
      "radial-gradient(circle at top left, rgba(168,85,247,0.25), transparent 40%),\
       radial-gradient(circle at bottom right, rgba(236,72,153,0.25), transparent 40%),\
       linear-gradient(135deg, #020617, #0f172a)",
    color: "#fff",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  title: {
    fontSize: "2.2rem",
    marginBottom: 32,
    background: "linear-gradient(90deg,#c084fc,#f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    maxWidth: 1100,
  },

  card: {
    padding: 24,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    marginBottom: 24,
  },

  badge: {
    padding: "4px 12px",
    borderRadius: 999,
    background: "linear-gradient(135deg,#a855f7,#ec4899)",
    fontSize: "0.8rem",
  },

  bar: {
    height: 10,
    background: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    overflow: "hidden",
    marginTop: 8,
  },

  barFill: {
    height: "100%",
    background: "linear-gradient(90deg,#a855f7,#ec4899)",
  },

  actions: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginTop: 40,
  },

  primaryBtn: {
    padding: "14px 32px",
    borderRadius: 999,
    border: "none",
    fontWeight: 600,
    background: "linear-gradient(135deg,#a855f7,#ec4899)",
    color: "#fff",
    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "14px 32px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5f5",
    cursor: "pointer",
  },
};
