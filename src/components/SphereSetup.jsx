import { useState } from "react";
import { SPHERE_COLORS, SPHERE_ICONS } from "../constants/spheres";

let idCounter = Math.floor(Math.random() * 1000000);

export default function SphereSetup({ member, onSave }) {
  const [spheres, setSpheres] = useState(
    member.spheres.length > 0
      ? member.spheres
      : [{ id: `s${idCounter++}`, label: "", icon: "1", color: "#8B5CF6", desc: "" }]
  );

  function addSphere() {
    if (spheres.length >= 5) return;
    setSpheres((prev) => [
      ...prev,
      {
        id: `s${idCounter++}`,
        label: "",
        icon: SPHERE_ICONS[prev.length % SPHERE_ICONS.length],
        color: SPHERE_COLORS[prev.length % SPHERE_COLORS.length],
        desc: "",
      },
    ]);
  }
  function removeSphere(id) {
    setSpheres((prev) => prev.filter((s) => s.id !== id));
  }
  function updateSphere(id, field, val) {
    setSpheres((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#000", padding: "48px 24px", display: "flex", flexDirection: "column" }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#555", letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: 8 }}>Fight Club / Setup</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 34, fontWeight: 400, color: "#fff", marginBottom: 6, fontStyle: "italic", letterSpacing: "-0.01em" }}>{member.displayName}</h1>
        <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#444", lineHeight: 1.7 }}>Define what you're fighting for.<br />Max 5 spheres. Be ruthlessly specific.</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, flex: 1 }}>
        {spheres.map((sp) => (
          <div key={sp.id} style={{ background: "#080808", border: "1px solid #1c1c1c", borderRadius: 14, padding: "16px 16px 16px 20px", position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, borderRadius: "14px 0 0 14px", background: sp.color }} />
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <input
                value={sp.label}
                onChange={(e) => updateSphere(sp.id, "label", e.target.value)}
                placeholder="Name your sphere"
                maxLength={18}
                style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid #222", color: "#fff", fontSize: 15, fontWeight: 600, padding: "4px 0", outline: "none", fontFamily: "Georgia,serif", fontStyle: "italic" }}
              />
              <select
                value={sp.color}
                onChange={(e) => updateSphere(sp.id, "color", e.target.value)}
                style={{ background: "#111", border: "1px solid #1c1c1c", borderRadius: 8, color: "#fff", fontSize: 10, padding: "4px 6px", cursor: "pointer", fontFamily: "'DM Mono',monospace", outline: "none" }}
              >
                {SPHERE_COLORS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {spheres.length > 1 && (
                <button
                  onClick={() => removeSphere(sp.id)}
                  style={{ background: "none", border: "none", color: "#333", fontSize: 20, cursor: "pointer", lineHeight: 1, padding: "0 4px" }}
                >
                  −
                </button>
              )}
            </div>
            <input
              value={sp.desc}
              onChange={(e) => updateSphere(sp.id, "desc", e.target.value)}
              placeholder="What does hitting this look like today?"
              style={{ width: "100%", background: "transparent", border: "none", color: "#555", fontSize: 11, padding: "0", outline: "none", fontFamily: "'DM Mono',monospace", letterSpacing: "0.02em", boxSizing: "border-box" }}
            />
          </div>
        ))}
      </div>

      {spheres.length < 5 && (
        <button
          onClick={addSphere}
          style={{ width: "100%", background: "transparent", border: "1px dashed #1c1c1c", borderRadius: 12, color: "#333", fontSize: 12, padding: "13px", cursor: "pointer", fontFamily: "'DM Mono',monospace", marginBottom: 16, letterSpacing: "0.08em", transition: "all 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#8B5CF6")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1c1c1c")}
        >
          + ADD SPHERE ({5 - spheres.length} left)
        </button>
      )}

      <button
        onClick={() => {
          const valid = spheres.filter((s) => s.label.trim());
          if (!valid.length) return;
          onSave({ ...member, spheres: valid, setupDone: true });
        }}
        style={{ width: "100%", background: "linear-gradient(135deg,#6D28D9 0%,#8B5CF6 50%,#A78BFA 100%)", border: "none", borderRadius: 12, color: "#fff", fontSize: 13, fontWeight: 700, padding: "16px", cursor: "pointer", fontFamily: "'DM Mono',monospace", letterSpacing: "0.15em" }}
      >
        LOCK IN
      </button>
    </div>
  );
}
