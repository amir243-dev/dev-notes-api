import { useState, useEffect } from "react";
import api from "../api";

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/notes/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setStats({ streak: 0, weeklyCount: 0, mostUsedTags: [] });
      });
  }, []);

  if (!stats)
    return (
      <div
        className="screen"
        style={{ textAlign: "center", marginTop: "40px" }}
      >
        <p className="sub">Loading stats...</p>
      </div>
    );

  const tags = stats.mostUsedTags || [];
  const maxTagCount = tags.length > 0 ? tags[0].count : 1;

  // Map tags to their specific mockup colors
  const tagColorMap = {
    typescript: "var(--slate)",
    prisma: "var(--slate)",
    schema: "var(--slate)",
    bugfix: "var(--rust)",
    mistake: "var(--rust)",
    "architecture-decision": "var(--ochre)",
    learning: "var(--ochre)",
    auth: "var(--sage)",
    perf: "var(--sage)",
  };
  const getTagColor = (tag) => tagColorMap[tag] || "var(--slate)";

  return (
    <>
      <div className="eyebrow">PERSONAL LOGGING STATS</div>
      <div className="h1" style={{ marginTop: "8px" }}>
        Stats
      </div>

      <div className="card streak-hero">
        <div className="flame-ring">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1.5c.3 1.9 1.3 3 2.4 4.2 1 1.1 2.1 2.3 2.1 4.3A4.5 4.5 0 0 1 8 14.5a4.5 4.5 0 0 1-4.5-4.5c0-1.4.6-2.5 1.4-3.5.3.8.8 1.4 1.6 1.8C6.2 6 6.9 3.6 8 1.5z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="sh-num">
          {stats.streak || 0} <small>day streak</small>
        </div>
        <div className="sh-sub">
          {stats.weeklyCount || 0} entries logged this week
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">MOST-USED TAGS · ALL TIME</div>
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <div key={tag._id || index} className="trow">
              <span className="tname" style={{ color: getTagColor(tag._id) }}>
                {tag._id}
              </span>
              <div className="ttrack">
                <div
                  className="tfill"
                  style={{
                    width: `${(tag.count / maxTagCount) * 100}%`,
                    background: getTagColor(tag._id),
                  }}
                ></div>
              </div>
              <span className="tcount">{tag.count}</span>
            </div>
          ))
        ) : (
          <div
            className="sub"
            style={{ textAlign: "center", padding: "12px 0" }}
          >
            No tags logged yet.
          </div>
        )}
      </div>
    </>
  );
}
