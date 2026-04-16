import { useState } from "react";

export default function NotesView({ member, onUpdate }) {
  const [notes, setNotes] = useState(member.notes || []);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [expandedNote, setExpandedNote] = useState(null);

  function addNote() {
    if (!newNoteTitle.trim()) return;
    const note = {
      id: `note_${Date.now()}`,
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString(),
    };
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    onUpdate({ ...member, notes: updatedNotes });
    setNewNoteTitle("");
    setNewNoteContent("");
  }

  function deleteNote(id) {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    onUpdate({ ...member, notes: updatedNotes });
    setExpandedNote(null);
  }

  function updateNote(id, field, value) {
    const updatedNotes = notes.map((n) => (n.id === id ? { ...n, [field]: value } : n));
    setNotes(updatedNotes);
    onUpdate({ ...member, notes: updatedNotes });
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: 20 }}>
      {/* New Note Section */}
      <div style={{ background: "#080808", border: "1px solid #1a1a1a", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 18, fontStyle: "italic", fontWeight: 400, margin: "0 0 16px 0", color: "#fff" }}>
          New Note
        </h2>
        <input
          type="text"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          placeholder="Note Title"
          style={{
            width: "100%",
            background: "#000",
            border: "1px solid #1a1a1a",
            borderRadius: 8,
            color: "#fff",
            padding: "12px 16px",
            fontFamily: "Georgia,serif",
            fontSize: 14,
            fontStyle: "italic",
            marginBottom: 12,
            boxSizing: "border-box",
            outline: "none",
          }}
        />
        <textarea
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="What's on your mind? Write about your progress, goals, or anything..."
          style={{
            width: "100%",
            background: "#000",
            border: "1px solid #1a1a1a",
            borderRadius: 8,
            color: "#ccc",
            padding: "12px 16px",
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            lineHeight: 1.8,
            minHeight: 100,
            marginBottom: 12,
            boxSizing: "border-box",
            outline: "none",
            resize: "vertical",
          }}
        />
        <button
          onClick={addNote}
          style={{
            background: "linear-gradient(135deg,#6D28D9,#8B5CF6)",
            border: "none",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 8,
            cursor: "pointer",
            fontFamily: "'DM Mono',monospace",
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.08em",
          }}
        >
          ADD NOTE
        </button>
      </div>

      {/* Notes List */}
      <div style={{ display: "grid", gap: 16 }}>
        {notes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#444" }}>
            <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, margin: 0 }}>No notes yet. Start writing to capture your thoughts.</p>
          </div>
        ) : (
          notes.map((note) => {
            const isExpanded = expandedNote === note.id;
            const date = new Date(note.createdAt);
            const dateStr = date.toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "2-digit" });

            return (
              <div
                key={note.id}
                style={{
                  background: "#080808",
                  border: isExpanded ? "1px solid #8B5CF6" : "1px solid #1a1a1a",
                  borderRadius: 12,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <div
                  onClick={() => setExpandedNote(isExpanded ? null : note.id)}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: isExpanded ? 16 : 0 }}
                >
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "Georgia,serif",
                        fontSize: 16,
                        fontStyle: "italic",
                        fontWeight: 400,
                        margin: "0 0 6px 0",
                        color: "#fff",
                      }}
                    >
                      {note.title}
                    </h3>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, color: "#444", margin: 0, letterSpacing: "0.05em" }}>
                      {dateStr}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#333",
                      fontSize: 16,
                      cursor: "pointer",
                      padding: "4px 8px",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#8B5CF6")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                  >
                    −
                  </button>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: "#ccc", lineHeight: 1.8, margin: "0 0 16px 0", whiteSpace: "pre-wrap" }}>
                      {note.content}
                    </p>
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note.id, "content", e.target.value)}
                      style={{
                        width: "100%",
                        background: "#000",
                        border: "1px solid #1a1a1a",
                        borderRadius: 8,
                        color: "#ccc",
                        padding: "12px 16px",
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 12,
                        lineHeight: 1.8,
                        minHeight: 80,
                        boxSizing: "border-box",
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
