import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import flameIcon from "../assets/flame.svg";
import captureIcon from "../assets/capture.svg";
import projectsIcon from "../assets/projects.svg";
import statsIcon from "../assets/stats.svg";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Outlet />;

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">&gt;_</div>
          <div className="wordmark">
            <div className="wordmark-name">DevNotes</div>
            <div className="wordmark-sub">BUILD LOG</div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="streak-chip">
            <img
              src={flameIcon}
              alt=""
              style={{ width: "12px", height: "12px" }}
            />
            <span>12-DAY</span>
          </div>
          <Link to="/profile" className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : "A"}
          </Link>
        </div>
      </header>

      <main className="screen">
        <Outlet />
      </main>

      <nav className="tabbar">
        <Link
          to="/"
          className={`tab ${location.pathname === "/" ? "active" : ""}`}
        >
          <img
            src={captureIcon}
            alt=""
            style={{ width: "20px", height: "20px" }}
          />
          <span>CAPTURE</span>
        </Link>
        <Link
          to="/projects"
          className={`tab ${location.pathname.includes("projects") ? "active" : ""}`}
        >
          <img
            src={projectsIcon}
            alt=""
            style={{ width: "20px", height: "20px" }}
          />
          <span>PROJECTS</span>
        </Link>
        <Link
          to="/stats"
          className={`tab ${location.pathname === "/stats" ? "active" : ""}`}
        >
          <img
            src={statsIcon}
            alt=""
            style={{ width: "20px", height: "20px" }}
          />
          <span>STATS</span>
        </Link>
      </nav>
    </div>
  );
}
