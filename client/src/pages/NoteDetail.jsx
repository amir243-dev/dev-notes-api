import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import editIcon from "../assets/edit.svg";
import trashIcon from "../assets/trash.svg";

export default function NoteDetail() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const noteRes = await api.get(`/notes/${noteId}`);
        setNote(noteRes.data);
        const projRes = await api.get("/projects");
        const proj = projRes.data.find(
          (p) =>
            p._id === (noteRes.data.projectId._id || noteRes.data.projectId),
        );
        setProject(proj);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNote();
  }, [noteId]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this entry permanently?")) return;
    try {
      await api.delete(`/notes/${noteId}`);
      navigate(`/projects/${note.projectId._id || note.projectId}`);
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (!note) return <div className="screen">Loading...</div>;

  const dateStr = new Date(note.createdAt)
    .toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
    .toUpperCase();
  const timeStr = new Date(note.createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const wordCount = note.content.split(/\s+/).filter(Boolean).length;
  const projName = project ? project.name.toUpperCase() : "PROJECT";

  const tagColors = {
    typescript: "c-slate",
    prisma: "c-slate",
    auth: "c-sage",
    learning: "c-sage",
    bugfix: "c-rust",
    mistake: "c-rust",
    "architecture-decision": "c-ochre",
    schema: "c-ochre",
  };
  const getTagColor = (tag) => tagColors[tag] || "c-slate";

  return (
    <>
      <div className="eyebrow">
        {projName} · ENTRY #{note._id.slice(-2).toUpperCase()}
      </div>

      <div className="display" style={{ marginTop: "12px", lineHeight: "1.3" }}>
        {note.content.split(".")[0]}
      </div>

      <div className="autometa" style={{ marginTop: "10px" }}>
        {dateStr} · {timeStr} · EDITED {timeStr} · {wordCount} WORDS
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          marginTop: "16px",
        }}
      >
        {note.tags.map((t) => (
          <span key={t} className={`chip ${getTagColor(t)}`}>
            {t}
          </span>
        ))}
      </div>

      <div
        className="dbody"
        style={{
          marginTop: "24px",
          fontSize: "14px",
          lineHeight: "1.7",
          color: "var(--ink-soft)",
        }}
      >
        {note.content.split("\n").map((paragraph, idx) => (
          <p key={idx} style={{ marginBottom: "16px" }}>
            {paragraph}
          </p>
        ))}
      </div>

      <div className="dfoot">
        <Link
          to={`/projects/${note.projectId._id || note.projectId}`}
          className="backlink"
        >
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <path
              d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All entries
        </Link>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn btn-secondary">
            <img
              src={editIcon}
              alt=""
              style={{ width: "12px", height: "12px" }}
            />
            Edit
          </button>
          <button className="btn btn-danger-ghost" onClick={handleDelete}>
            <img
              src={trashIcon}
              alt=""
              style={{ width: "12px", height: "12px" }}
            />
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
