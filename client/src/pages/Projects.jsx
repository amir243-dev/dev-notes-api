import { useState, useEffect } from "react";
import api from "../api";
import NewProjectModal from "../components/NewProjectModal";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const colors = ["var(--sage)", "var(--slate)", "var(--ochre)", "var(--rust)"];

  const formatMeta = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    if (diffDays === 0) return `UPDATED TODAY · ${timeStr}`;
    if (diffDays === 1) return `UPDATED 1D AGO`;
    if (diffDays < 7) return `UPDATED ${diffDays}D AGO`;
    return `UPDATED ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase()}`;
  };

  const totalEntries = projects.reduce(
    (acc, p) => acc + (p.entryCount || 0),
    0,
  );

  return (
    <>
      <div className="shead">
        <div>
          <div className="eyebrow">
            {projects.length} ACTIVE · {totalEntries} ENTRIES
          </div>
          <div className="h1" style={{ marginTop: "8px" }}>
            Projects
          </div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setShowModal(true)}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3.5v9M3.5 8h9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          New
        </button>
      </div>

      <div className="pline">
        {projects.map((p, index) => {
          const color = colors[index % colors.length];
          return (
            <div
              key={p._id}
              className="pcard"
              style={{ borderTop: `3px solid ${color}` }}
            >
              <div className="p-top">
                <span className="p-sq" style={{ background: color }}></span>
                <span className="p-meta">
                  {formatMeta(p.updatedAt || p.createdAt)}
                </span>
              </div>
              <div className="p-name">{p.name}</div>
              {p.description && <div className="p-desc">{p.description}</div>}
              <div className="p-foot">
                <span className="p-count">{p.entryCount || 0} ENTRIES</span>
                <span className="p-tags">
                  {p.topTags && p.topTags.length > 0
                    ? p.topTags.join(" · ")
                    : "—"}
                </span>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && !loading && (
          <div
            className="sub"
            style={{ textAlign: "center", marginTop: "40px" }}
          >
            No projects yet. Create your first build log.
          </div>
        )}
      </div>

      {showModal && (
        <NewProjectModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            fetchProjects();
          }}
        />
      )}
    </>
  );
}
