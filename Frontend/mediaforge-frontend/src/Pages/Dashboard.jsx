import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./footer";
import "./Dashboard.css";

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

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/auth/me",
          { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading || !user) {
    return (
      <div className="dashWrapper">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  const dailyLimit =
    user.dailyLimit === "Unlimited" ? 10 : user.dailyLimit;

  const used = user.dailyUploadCount || 0;
  const remaining = dailyLimit - used;
  const percentUsed = Math.min((used / dailyLimit) * 100, 100);

  const graphData = [{ name: "Today", uploads: used }];

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:4000/api/v1/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
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
      {/* NAVBAR */}
      <nav className="dashNavbar">
        <div className="dashNavInner">
          <div className="dashLogo" onClick={() => navigate("/dashboard")}>
            MediaForge
          </div>

          <div className="dashNavLinks">
            <span onClick={() => navigate("/")}>Home</span>
            <span onClick={() => navigate("/convert")}>Convert</span>
            <span onClick={() => navigate("/crop")}>Crop</span>
            <span onClick={() => navigate("/compress")}>Compress</span>
            <span onClick={() => navigate("/pricing")}>Pricing</span>
          </div>

          <button className="dashLogoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div className="dashWrapper">

        <h2 className="dashTitle">Dashboard</h2>

        <div className="dashGrid">

          <div>
            <div className="dashCard">
              <h3>User Info</h3>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Subscription:</strong>{" "}
                <span className="dashBadge">{user.subscription}</span>
              </p>
            </div>

            <div className="dashCard">
              <h3>Daily Upload Quota</h3>
              <p>{remaining} / {dailyLimit} images remaining today</p>

              <div className="dashBar">
                <div
                  className="dashBarFill"
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              {remaining <= 0 && (
                <p className="dashLimitText">
                  Daily limit reached. Upgrade to PRO.
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="dashCard">
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

      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
