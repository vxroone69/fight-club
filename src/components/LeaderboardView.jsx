import { localDateStr, getWeekDates } from "../utils/dateUtils";
import { scoreDay, getStreak } from "../utils/scoreUtils";

export default function LeaderboardView({ allMembers }) {
  const today = localDateStr();
  const weekDates = getWeekDates();

  const ranked = allMembers
    .filter((m) => m.setupDone && m.spheres.length > 0)
    .map((m) => {
      const weekScore = weekDates.reduce((s, d) => s + scoreDay(m.logs[d], m.spheres), 0);
      const weekPossible = weekDates.length * m.spheres.length;
      const streak = getStreak(m.logs, m.spheres);
      const todayScore = scoreDay(m.logs[today], m.spheres);
      const weekPct = weekPossible > 0 ? Math.round((weekScore / weekPossible) * 100) : 0;
      return { ...m, weekScore, weekPossible, weekPct, streak, todayScore };
    })
    .sort((a, b) => b.weekPct - a.weekPct);

  const medals = ["1st", "2nd", "3rd"];

  return (
    <div style={{ padding: "28px 24px 100px" }}>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
        This week
      </p>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 400, color: "#fff", fontStyle: "italic", letterSpacing: "-0.01em", marginBottom: 4 }}>
        The Fight Club
        <span style={{ color: "#8B5CF6" }}>.</span>
      </h1>
      <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#333", marginBottom: 28, letterSpacing: "0.05em" }}>
        You don't talk about Fight Club.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {ranked.map((m, i) => (
          <div
            key={m.name}
            style={{
              background: i === 0 ? "#0a0814" : "#080808",
              border: `1px solid ${i === 0 ? "#8B5CF633" : "#1a1a1a"}`,
              borderRadius: 14,
              padding: "18px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {i === 0 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg,rgba(109,40,217,0.06),transparent)", pointerEvents: "none" }} />}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 26, fontStyle: "italic", color: i === 0 ? "#8B5CF6" : i === 1 ? "#666" : "#444", flexShrink: 0 }}>
                {medals[i] || `${i + 1}`}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: 18, fontStyle: "italic", color: i === 0 ? "#fff" : "#aaa" }}>
                    {m.displayName}
                  </span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 18, color: i === 0 ? "#8B5CF6" : "#555", fontWeight: 400 }}>
                    {m.weekPct}
                    <span style={{ fontSize: 11, color: i === 0 ? "#6D28D9" : "#333" }}>%</span>
                  </span>
                </div>
                <div style={{ height: 2, background: "#111", borderRadius: 1, marginBottom: 10 }}>
                  <div
                    style={{
                      height: "100%",
                      borderRadius: 1,
                      background: i === 0 ? "linear-gradient(90deg,#6D28D9,#8B5CF6,#A78BFA)" : "#222",
                      width: `${m.weekPct}%`,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383838", letterSpacing: "0.08em" }}>
                    streak {m.streak}d
                  </span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383838", letterSpacing: "0.08em" }}>
                    TODAY {m.todayScore}/{m.spheres.length}
                  </span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383838", letterSpacing: "0.08em" }}>
                    {m.weekScore}/{m.weekPossible} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {ranked.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#2a2a2a", letterSpacing: "0.1em" }}>
              WAITING FOR FIGHTERS
            </p>
          </div>
        )}
      </div>

      {/* Sphere breakdown */}
      {ranked.map((m) => (
        <div key={m.name} style={{ marginBottom: 24 }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 12 }}>
            {m.displayName} — spheres
          </p>
          {m.spheres.map((sp) => {
            const spScore = weekDates.reduce((s, d) => s + (m.logs[d]?.[sp.id]?.checked ? 1 : 0), 0);
            const spPct = Math.round((spScore / 7) * 100);
            return (
              <div key={sp.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: sp.color, flexShrink: 0 }} />
                <span
                  style={{
                    fontFamily: "'DM Mono',monospace",
                    fontSize: 10,
                    color: "#444",
                    width: 72,
                    flexShrink: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sp.label}
                </span>
                <div style={{ flex: 1, height: 2, background: "#111", borderRadius: 1 }}>
                  <div style={{ height: "100%", borderRadius: 1, background: sp.color, width: `${spPct}%`, transition: "width 0.4s ease" }} />
                </div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#383838", width: 24, textAlign: "right", flexShrink: 0 }}>
                  {spScore}/7
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
