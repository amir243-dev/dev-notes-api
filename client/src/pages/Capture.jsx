import { useState, useEffect } from "react";
import api from "../api";

export default function Capture() {
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
        if (res.data.length > 0) setProjectId(res.data[0]._id);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };
    fetchProjects();
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
    try {
      await api.post("/notes", { content, projectId, tags });
      setContent("");
      setTags([]);
      setTagInput("");
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const today = new Date()
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .toUpperCase()
    .replace(",", " · ");

  return (
    <>
      <div className="head-row" style={{ marginBottom: "24px" }}>
        <div>
          <div className="eyebrow">{today}</div>
          <h1 className="h1" style={{ marginTop: "8px" }}>
            Capture today's build.
          </h1>
        </div>
      </div>
      <p className="sub" style={{ marginBottom: "24px" }}>
        One thought, saved before it's gone.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="field-label">PROJECT</label>
          <select
            className="select"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.length === 0 && <option value="">No projects yet</option>}
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label className="field-label">TAGS</label>
          <div className="tagbox">
            {tags.map((t) => (
              <span key={t} className="chip c-slate chip-sm">
                {t}
                <button
                  type="button"
                  className="chip-x"
                  onClick={() => setTags(tags.filter((x) => x !== t))}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              type="text"
              className="tag-add"
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
            className="textarea"
            placeholder="What did you build, break, or decide today?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div
            className="autometa"
            style={{ marginTop: "8px", textAlign: "right" }}
          >
            {content.split(/\s+/).filter(Boolean).length} WORDS
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={{ marginTop: "16px" }}
        >
          Save entry
          <span className="kbd">⌘↩</span>
        </button>
      </form>
    </>
  );
}
