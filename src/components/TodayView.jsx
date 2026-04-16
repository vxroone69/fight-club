import { localDateStr } from "../utils/dateUtils";
import { scoreDay, totalMinutes, getStreak, formatMins } from "../utils/scoreUtils";

export default function TodayView({ member, onUpdate }) {
  const today = localDateStr();
  const log = member.logs[today] || {};

  function toggleSphere(id) {
    const newLog = { ...log, [id]: { ...log[id], checked: !log[id]?.checked } };
    onUpdate({ ...member, logs: { ...member.logs, [today]: newLog } });
  }
  function setMins(id, val) {
    const newLog = { ...log, [id]: { ...log[id], minutes: Math.max(0, parseInt(val) || 0) } };
    onUpdate({ ...member, logs: { ...member.logs, [today]: newLog } });
  }
  function setNote(val) {
    onUpdate({ ...member, logs: { ...member.logs, [today]: { ...log, note: val } } });
  }

  const score = scoreDay(log, member.spheres);
  const total = member.spheres.length;
  const streak = getStreak(member.logs, member.spheres);
  const todayMins = totalMinutes(log, member.spheres);
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const dateLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* Hero header */}
      <div style={{ padding: "0", background: "transparent", borderBottom: "1px solid #1a1a1a", marginBottom: 20 }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>{dateLabel}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: 30, fontWeight: 400, color: "#fff", fontStyle: "italic", letterSpacing: "-0.01em", margin: 0 }}>
            {member.displayName}
            <span style={{ color: "#8B5CF6" }}>.</span>
          </h1>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Georgia,serif", fontSize: 32, color: pct === 100 ? "#8B5CF6" : "#fff", fontStyle: "italic" }}>
              {score}
              <span style={{ color: "#333", fontSize: 20 }}>/{total}</span>
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#444", letterSpacing: "0.15em" }}>SPHERES HIT</div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 2, background: "#111", borderRadius: 1, marginBottom: 20, overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg,#6D28D9,#8B5CF6,#A78BFA)", width: `${pct}%`, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius: 1 }} />
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ label: "STREAK", value: streak > 0 ? `${streak}d` : "—", sub: "", color: streak > 2 ? "#8B5CF6" : streak > 0 ? "#A78BFA" : "#333" }, { label: "TIME", value: formatMins(todayMins), color: "#8B5CF6" }, { label: "RATE", value: `${pct}%`, color: pct === 100 ? "#A78BFA" : pct >= 60 ? "#8B5CF6" : "#555" }].map((s) => (
            <div key={s.label} style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 10, padding: "12px 10px", textAlign: "center" }}>
              <div style={{ fontFamily: "Georgia,serif", fontSize: 20, fontStyle: "italic", color: s.color }}>
                {s.value}
                {s.sub}
              </div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#444", letterSpacing: "0.12em", marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Spheres list */}
      <div style={{ padding: "0", display: "flex", flexDirection: "column", gap: 8, borderBottom: "1px solid #1a1a1a", marginBottom: 20 }}>
        {member.spheres.map((sp) => {
          const checked = log[sp.id]?.checked || false;
          const mins = log[sp.id]?.minutes || 0;
          return (
            <div
              key={sp.id}
              style={{
                background: checked ? "#0d0a14" : "#080808",
                border: `1px solid ${checked ? sp.color + "55" : "#1a1a1a"}`,
                borderRadius: 14,
                padding: "14px 16px",
                position: "relative",
                transition: "all 0.2s",
                overflow: "hidden",
              }}
            >
              {checked && <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at left,${sp.color}08,transparent 70%)`, pointerEvents: "none" }} />}
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2.5, background: checked ? sp.color : "#1a1a1a", transition: "background 0.2s", borderRadius: "14px 0 0 14px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  onClick={() => toggleSphere(sp.id)}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 5,
                    border: `1.5px solid ${checked ? sp.color : "#2a2a2a"}`,
                    background: checked ? sp.color : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "all 0.15s",
                  }}
                >
                  {checked && (
                    <span style={{ fontSize: 11, color: "#fff", fontWeight: 900, lineHeight: 1 }}>•</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontFamily: "Georgia,serif", fontWeight: 400, fontSize: 16, color: checked ? sp.color : "#ccc", fontStyle: "italic", transition: "color 0.2s" }}>{sp.label}</span>
                  </div>
                  {sp.desc && (
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#383838", margin: 0, letterSpacing: "0.02em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {sp.desc}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <input
                    type="number"
                    min="0"
                    max="480"
                    value={mins || ""}
                    onChange={(e) => setMins(sp.id, e.target.value)}
                    placeholder="—"
                    style={{
                      width: 48,
                      background: "#111",
                      border: `1px solid ${checked ? sp.color + "44" : "#1c1c1c"}`,
                      borderRadius: 8,
                      color: checked ? sp.color : "#666",
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 12,
                      padding: "5px 8px",
                      textAlign: "center",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                  />
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#333", letterSpacing: "0.05em" }}>min</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reflection */}
      <div style={{ margin: "0", background: "transparent", border: "none", borderRadius: 0, padding: "0" }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#383838", letterSpacing: "0.2em", marginBottom: 10 }}>REFLECTION</p>
        <textarea
          value={log.note || ""}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What clicked today? What are you fixing tomorrow?"
          style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#555", fontFamily: "'DM Mono',monospace", fontSize: 12, lineHeight: 1.9, resize: "none", minHeight: 60, boxSizing: "border-box", fontStyle: "italic" }}
        />
      </div>
    </div>
  );
}
