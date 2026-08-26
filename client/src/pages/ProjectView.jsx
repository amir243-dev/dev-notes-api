import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import plusIcon from "../assets/plus.svg";

export default function ProjectView() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [activeTag, setActiveTag] = useState("All");

  // Inline Composer State
  const [composerState, setComposerState] = useState("hidden"); // 'hidden', 'create', 'edit'
  const [editingNote, setEditingNote] = useState(null);
  const [draftContent, setDraftContent] = useState("");
  const [draftTags, setDraftTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const fetchNotes = async () => {
    try {
      const notesRes = await api.get(`/notes?projectId=${projectId}`);
      setNotes(notesRes.data.notes);
    } catch (err) {
      console.error(err);
    }
  };

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

  // Composer Handlers
  const openCreate = () => {
    setComposerState("create");
    setEditingNote(null);
    setDraftContent("");
    setDraftTags([]);
    setTagInput("");
  };

  const openEdit = (note) => {
    setComposerState("edit");
    setEditingNote(note);
    setDraftContent(note.content);
    setDraftTags(note.tags || []);
    setTagInput("");
  };

  const closeComposer = () => {
    setComposerState("hidden");
    setEditingNote(null);
    setDraftContent("");
    setDraftTags([]);
    setTagInput("");
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!draftTags.includes(tagInput.trim()))
        setDraftTags([...draftTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSave = async () => {
    if (!draftContent.trim()) return;
    try {
      if (composerState === "create") {
        await api.post("/notes", {
          content: draftContent,
          projectId,
          tags: draftTags,
        });
      } else if (composerState === "edit" && editingNote) {
        await api.put(`/notes/${editingNote._id}`, {
          content: draftContent,
          tags: draftTags,
        });
      }
      await fetchNotes(); // Refresh the list instantly
      closeComposer();
    } catch (err) {
      console.error(err);
      alert("Failed to save note");
    }
  };

  const handleDelete = async () => {
    if (!editingNote) return;
    if (!window.confirm("Delete this entry permanently?")) return;
    try {
      await api.delete(`/notes/${editingNote._id}`);
      await fetchNotes();
      closeComposer();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const wordCount = draftContent.split(/\s+/).filter(Boolean).length;

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
        <button className="btn btn-secondary" onClick={openCreate}>
          <img
            src={plusIcon}
            alt=""
            style={{ width: "11px", height: "11px" }}
          />
          Entry
        </button>
      </div>

      {/* INLINE COMPOSER (Frames 08 & 09) */}
      {composerState !== "hidden" && (
        <div className="card composer">
          <div className="c-label">
            <span>
              {composerState === "create"
                ? `NEW ENTRY · ${project.name.toUpperCase()}`
                : `EDITING ENTRY #${editingNote._id.slice(-2).toUpperCase()} · ${project.name.toUpperCase()}`}
            </span>
            <button className="mx" onClick={closeComposer}>
              ×
            </button>
          </div>

          <div className="field">
            <label className="field-label">TAGS</label>
            <div className="tagbox">
              {draftTags.map((t) => (
                <span key={t} className={`chip chip-sm ${getTagColor(t)}`}>
                  {t}{" "}
                  <span
                    className="x"
                    onClick={() =>
                      setDraftTags(draftTags.filter((x) => x !== t))
                    }
                  >
                    ×
                  </span>
                </span>
              ))}
              <input
                type="text"
                className="addtag"
                placeholder="+ add tag…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label">NOTE</label>
            <textarea
              className="notebox"
              placeholder="What did you build, break, or decide?"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
              autoFocus
            />
          </div>

          <div className="c-meta">
            {wordCount} WORDS ·{" "}
            {composerState === "edit"
              ? "EDITED JUST NOW"
              : `DRAFT SAVED ${new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}`}
          </div>

          <div className="c-foot">
            {composerState === "edit" && (
              <button className="btn-ghost-rust" onClick={handleDelete}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Delete
              </button>
            )}
            <button className="btn btn-secondary" onClick={closeComposer}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {composerState === "create" ? "Save entry" : "Save changes"}
            </button>
          </div>
        </div>
      )}

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
                onClick={() => openEdit(note)}
              >
                <div className="erow-top">
                  {note.tags.slice(0, 3).map((t) => (
                    <span key={t} className={`chip chip-sm ${getTagColor(t)}`}>
                      {t}
                    </span>
                  ))}
                  <span className="etime">{formatTime(note.createdAt)}</span>
                </div>
                <div className="etext">{note.content}</div>
                <div className="emeta">
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
