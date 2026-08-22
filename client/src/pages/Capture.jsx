import React, { useState, useEffect } from "react";
import api from "../api";

export default function Capture() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    api.get("/projects").then((res) => setProjects(res.data));
    if (res.data.length > 0) setProjectId(res.data[0]._id);
  }).catch(() => {
    alert("Failed to load projects. Ensure Backend is running. ");
  }, []);

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !projectId)
      return alert("Project and content required");

    await api.post("/notes", { content, projectId, tags });
    setContent("");
    setTags([]);
    setTagInput("");
    alert("Entry Saved");
  };

  // ========================================
  return (
    <div>
      <div
        className="mono"
        style={{
          fontSize: "0.75rem",
          color: "var(--slate)",
          marginBottom: "1rem",
        }}
      >
        CAPTURE TODAY'S BUILD. ONE THOUGHT, SAVED BEFORE IT'S GONE.
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        <div>
          <label
            className="mono"
            style={{
              fontSize: "0.75rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            PROJECT
          </label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.length === 0 && <option>No projects yet</option>}
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="mono"
            style={{
              fontSize: "0.75rem",
              display: "block",
              marginBottom: "0.5rem",
            }}
          >
            TAGS
          </label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              marginBottom: "0.5rem",
            }}
          >
            {tags.map((t) => (
              <span
                key={t}
                className="tag"
                onClick={() => setTags(tags.filter((x) => x !== t))}
                style={{ cursor: "pointer" }}
              >
                {t} ×
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="add tag and press enter..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
          />
        </div>
        <div>
          <label
            className="mono"
            style={{
              display: "block",
              fontSize: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            NOTE
          </label>
          <textarea
            placeholder="what did you break, learn or decide today"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div
            className="mono"
            style={{
              fontSize: "0.75rem",
              color: "var(--slate)",
              marginTop: "0.5rem",
              textAlign: "right",
            }}
          >
            {content.split(/\s+/).filter(Boolean).length} WORDS
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: "100%" }}>
          Save entry ⌘↩
        </button>
      </form>
    </div>
  );
}
