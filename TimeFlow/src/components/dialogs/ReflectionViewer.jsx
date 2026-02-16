import "../../App.css";

export default function ReflectionViewer({ date, reflection, onClose }) {
  if (!reflection) return null;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const completionRate = reflection.totalCount > 0
    ? Math.round((reflection.completedCount / reflection.totalCount) * 100)
    : 0;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      animation: "fadeIn 0.2s ease-out"
    }}>
      <div style={{
        background: "#fff",
        padding: 32,
        borderRadius: 20,
        width: "92%",
        maxWidth: 600,
        boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        animation: "scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        maxHeight: "80vh",
        overflow: "auto"
      }}>
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24
        }}>
          <div>
            <div style={{
              fontSize: 24,
              fontWeight: 900,
              color: "#123a12",
              marginBottom: 4
            }}>
              Daily Reflection
            </div>
            <div style={{ fontSize: 14, color: "#6B8E6B" }}>
              {formatDate(date)}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "1px solid rgba(111,175,111,0.3)",
              background: "#fff",
              color: "#6B8E6B",
              fontSize: 20,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(111,175,111,0.1)";
              e.currentTarget.style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ×
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
          padding: 20,
          background: "linear-gradient(135deg, rgba(167,211,167,0.15), rgba(111,175,111,0.08))",
          borderRadius: 12,
          border: "1px solid rgba(111,175,111,0.2)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#3B6E3B" }}>
              {reflection.completedCount}/{reflection.totalCount}
            </div>
            <div style={{ fontSize: 12, color: "#6B8E6B", marginTop: 4 }}>
              Tasks Completed
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#3B6E3B" }}>
              {completionRate}%
            </div>
            <div style={{ fontSize: 12, color: "#6B8E6B", marginTop: 4 }}>
              Completion Rate
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#3B6E3B" }}>
              {reflection.mood === 'great' ? '😊' :
               reflection.mood === 'good' ? '🙂' :
               reflection.mood === 'okay' ? '😐' :
               reflection.mood === 'rough' ? '😔' : '–'}
            </div>
            <div style={{ fontSize: 12, color: "#6B8E6B", marginTop: 4, textTransform: "capitalize" }}>
              {reflection.mood || 'No mood'}
            </div>
          </div>
        </div>

        {/* Reflection Text */}
        {reflection.reflection && (
          <div style={{
            padding: 20,
            background: "linear-gradient(135deg, rgba(220,240,220,0.12), rgba(200,230,200,0.06))",
            borderRadius: 12,
            border: "1px solid rgba(111,175,111,0.15)"
          }}>
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#3B6E3B",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}>
              <span>📝</span>
              <span>What went well today</span>
            </div>
            <div style={{
              fontSize: 15,
              lineHeight: 1.6,
              color: "#3B6E3B",
              whiteSpace: "pre-wrap"
            }}>
              {reflection.reflection}
            </div>
          </div>
        )}

        {/* No reflection message */}
        {!reflection.reflection && (
          <div style={{
            padding: 32,
            textAlign: "center",
            color: "#9CA3AF",
            fontSize: 14
          }}>
            No reflection written for this day
          </div>
        )}

        {/* Close button */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
          <button
            onClick={onClose}
            className="btn primary"
            style={{ padding: "10px 24px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
