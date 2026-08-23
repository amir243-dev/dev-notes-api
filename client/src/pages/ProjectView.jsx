import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api";
import plusIcon from "../assets/plus.svg";

export default function ProjectView() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeTag, setActiveTag] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, notesRes] = await Promise.all([
          api.get("/projects"),
          api.get(`/notes?projectId=${projectId}`),
        ]);
        const currentProject = projRes.data.find((p) => p._id === projectId);
        setProject(currentProject);
        setNotes(notesRes.data.notes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [projectId]);

  if (!project) return <div className="screen">Loading...</div>;

  const allTags = ["All", ...new Set(notes.flatMap((n) => n.tags))];
  const filteredNotes =
    activeTag === "All"
      ? notes
      : notes.filter((n) => n.tags.includes(activeTag));

  const groupNotesByDate = (notesArr) => {
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    notesArr.forEach((note) => {
      const noteDate = new Date(note.createdAt);
      noteDate.setHours(0, 0, 0, 0);
      let label;
      if (noteDate.getTime() === today.getTime())
        label = `TODAY · ${noteDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}`;
      else if (noteDate.getTime() === yesterday.getTime())
        label = `YESTERDAY · ${noteDate.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}`;
      else
        label = noteDate
          .toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "short",
          })
          .toUpperCase();

      if (!groups[label]) groups[label] = [];
      groups[label].push(note);
    });
    return groups;
  };

  const groupedNotes = groupNotesByDate(filteredNotes);
  const formatTime = (dateStr) =>
    new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

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
      <Link to="/projects" className="backlink">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path
            d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All projects
      </Link>

      <div className="shead" style={{ marginTop: "12px" }}>
        <div>
          <div className="h1">{project.name}</div>
          <div className="pj-meta">
            {project.topTags && project.topTags.length > 0
              ? project.topTags.join(" · ")
              : "NO TAGS YET"}{" "}
            — {project.entryCount || 0} ENTRIES
          </div>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          <img
            src={plusIcon}
            alt=""
            style={{ width: "11px", height: "11px" }}
          />
          Entry
        </button>
      </div>

      <div className="filters">
        {allTags.map((tag) => (
          <button
            key={tag}
            className={`fchip ${activeTag === tag ? "on" : ""}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {Object.entries(groupedNotes).map(([dateLabel, dateNotes]) => (
        <div key={dateLabel}>
          <div className="glabel">{dateLabel}</div>
          <div className="card" style={{ marginBottom: "24px" }}>
            {dateNotes.map((note) => (
              <div
                key={note._id}
                className="erow"
                onClick={() => navigate(`/notes/${note._id}`)}
              >
                <div className="erow-top">
                  {note.tags.slice(0, 3).map((t) => (
                    <span key={t} className={`chip chip-sm ${getTagColor(t)}`}>
                      {t}
                    </span>
                  ))}
                  <span className="row-time">{formatTime(note.createdAt)}</span>
                </div>
                <div className="row-text">{note.content}</div>
                <div className="row-meta">
                  #{note._id.slice(-2).toUpperCase()} · EDITED{" "}
                  {formatTime(note.updatedAt || note.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
