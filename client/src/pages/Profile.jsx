import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalNotes: 0, streak: 0 });
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, projectsRes] = await Promise.all([
          api.get("/notes/stats"),
          api.get("/projects"),
        ]);

        const statsData = statsRes.data || {};
        setStats({
          totalNotes: statsData.totalNotes || 0,
          streak: statsData.streak || 0,
        });

        const projectsArray = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : [];
        setProjectCount(projectsArray.length);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatMemberSince = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  if (!user) return null;

  return (
    <>
      <div className="eyebrow">ACCOUNT</div>
      <div className="card pfcard">
        <div className="pf-top">
          <div className="pf-avatar">&gt;_</div>
          <div>
            <div className="pf-name">{user.name}</div>
            <div className="pf-mail">{user.email}</div>
          </div>
        </div>

        <div className="pf-stats">
          <div>
            <div className="pv">{stats.totalNotes}</div>
            <div className="pl">TOTAL ENTRIES</div>
          </div>
          <div>
            <div className="pv">{projectCount}</div>
            <div className="pl">PROJECTS</div>
          </div>
          <div>
            <div className="pv">{stats.streak} days</div>
            <div className="pl">CURRENT STREAK</div>
          </div>
          <div>
            <div className="pv">{formatMemberSince(user.createdAt)}</div>
            <div className="pl">MEMBER SINCE</div>
          </div>
        </div>

        <div className="pf-actions">
          <button
            className="btn btn-secondary"
            onClick={() =>
              alert("Password change flow coming in a future sprint.")
            }
          >
            Change password
          </button>
          <button className="btn-ghost-rust" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
