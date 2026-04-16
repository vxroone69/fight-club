import { useState } from "react";
import { MONTH_NAMES, DAY_NAMES } from "../constants/spheres";
import { localDateStr, getMonthDates } from "../utils/dateUtils";
import { scoreDay, formatMins } from "../utils/scoreUtils";

export default function CalendarView({ member }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(null);
  const today = localDateStr();
  const dates = getMonthDates(year, month);

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  const selLog = selected ? member.logs[selected] || null : null;

  return (
    <div style={{ padding: "0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <button
          onClick={prev}
          style={{
            background: "#080808",
            border: "1px solid #1a1a1a",
            borderRadius: 9,
            color: "#666",
            fontSize: 16,
            width: 34,
            height: 34,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          ‹
        </button>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 20, fontStyle: "italic", color: "#fff", margin: 0 }}>
            {MONTH_NAMES[month]} {year}
          </p>
        </div>
        <button
          onClick={next}
          style={{
            background: "#080808",
            border: "1px solid #1a1a1a",
            borderRadius: 9,
            color: "#666",
            fontSize: 16,
            width: 34,
            height: 34,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            outline: "none",
          }}
        >
          ›
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }}>
        {DAY_NAMES.map((d, i) => (
          <div
            key={i}
            style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#333", textAlign: "center", letterSpacing: "0.1em", padding: "4px 0" }}
          >
            {d}
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 20 }}>
        {dates.map((ds, i) => {
          if (!ds) return <div key={i} />;
          const log = member.logs[ds];
          const score = scoreDay(log, member.spheres);
          const total = member.spheres.length;
          const isToday = ds === today;
          const isFuture = ds > today;
          const isSel = ds === selected;
          const pct = total > 0 ? score / total : 0;
          const bg = !isFuture && score > 0 ? `rgba(139,92,246,${0.1 + pct * 0.65})` : "#080808";
          return (
            <div
              key={ds}
              onClick={() => setSelected(isSel ? null : ds)}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                background: bg,
                border: `1px solid ${isSel ? "#8B5CF6" : isToday ? "#8B5CF633" : "#111"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: isFuture ? "#1c1c1c" : isToday ? "#A78BFA" : score > 0 ? "#ccc" : "#444",
                  fontWeight: isToday ? 700 : 400,
                }}
              >
                {new Date(ds + "T12:00:00").getDate()}
              </span>
              {!isFuture && score > 0 && (
                <div style={{ position: "absolute", bottom: 4, width: 12, height: 2, background: "#8B5CF6" }} />
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 14, padding: 20, animation: "fadeIn 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <p style={{ fontFamily: "Georgia,serif", fontSize: 15, fontStyle: "italic", color: "#fff", margin: 0 }}>
              {new Date(selected + "T12:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
            </p>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#8B5CF6" }}>
              {scoreDay(selLog, member.spheres)}/{member.spheres.length}
            </span>
          </div>
          {member.spheres.map((sp) => {
            const checked = selLog?.[sp.id]?.checked || false;
            const mins = selLog?.[sp.id]?.minutes || 0;
            return (
              <div key={sp.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid #111" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: checked ? sp.color : "#222", flexShrink: 0 }} />
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: checked ? "#ccc" : "#333", flex: 1 }}>
                  {sp.label}
                </span>
                {mins > 0 && (
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: sp.color }}>{formatMins(mins)}</span>
                )}
                {checked && !mins && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, color: "#8B5CF6" }}>done</span>}
              </div>
            );
          })}
          {selLog?.note && (
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#444", marginTop: 14, lineHeight: 1.7, fontStyle: "italic" }}>
              "{selLog.note}"
            </p>
          )}
          {!selLog && (
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#2a2a2a", textAlign: "center", padding: "16px 0", letterSpacing: "0.1em" }}>
              NO DATA
            </p>
          )}
        </div>
      )}
    </div>
  );
}
