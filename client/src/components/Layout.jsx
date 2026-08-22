import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Outlet />;

  return (
    <div
      style={{
        maxWidth: "420px",
        margin: "0 auto",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid var(--border)",
        borderRight: "1px solid var(--border)",
        backgroundColor: "var(--paper)",
      }}
    >
      <header
        style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="mono"
          style={{
            fontSize: "0.75rem",
            color: "var(--slate)",
            marginBottom: "0.5rem",
          }}
        >
          &gt;_ DevNotes <span style={{ color: "var(--rust)" }}>BUILD LOG</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h1 style={{ fontSize: "1.25rem" }}>A SATURDAY · 22 AUG</h1>
          <button
            onClick={logout}
            className="mono"
            style={{ fontSize: "0.75rem", color: "var(--rust)" }}
          >
            LOG OUT
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: "1.5rem" }}>
        <Outlet />
      </main>

      <nav
        style={{
          display: "flex",
          borderTop: "1px solid var(--border)",
          backgroundColor: "white",
        }}
      >
        <Link
          to="/"
          style={{
            flex: 1,
            padding: "1rem",
            textAlign: "center",
            textDecoration: "none",
            color: location.pathname === "/" ? "var(--ink)" : "var(--slate)",
            fontWeight: location.pathname === "/" ? "600" : "400",
          }}
        >
          CAPTURE
        </Link>
        <Link
          to="/projects"
          style={{
            flex: 1,
            padding: "1rem",
            textAlign: "center",
            textDecoration: "none",
            color: location.pathname.includes("projects")
              ? "var(--ink)"
              : "var(--slate)",
            fontWeight: location.pathname.includes("projects") ? "600" : "400",
          }}
        >
          PROJECTS
        </Link>
        <Link
          to="/stats"
          style={{
            flex: 1,
            padding: "1rem",
            textAlign: "center",
            textDecoration: "none",
            color:
              location.pathname === "/stats" ? "var(--ink)" : "var(--slate)",
            fontWeight: location.pathname === "/stats" ? "600" : "400",
          }}
        >
          STATS
        </Link>
      </nav>
    </div>
  );
}
