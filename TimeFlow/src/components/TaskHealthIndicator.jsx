export default function TaskHealthIndicator({ health, compact = false }) {
  if (!health || health.status === 'healthy') return null;

  const statusIcons = {
    warning: '⚠️',
    critical: '🚨'
  };

  const statusLabels = {
    warning: 'WARNING',
    critical: 'CRITICAL'
  };

  if (compact) {
    // Compact mode - just badge
    return (
      <span
        style={{
          fontSize: "11px",
          padding: "2px 6px",
          background: health.status === 'critical'
            ? "rgba(220, 38, 38, 0.15)"
            : "rgba(245, 158, 11, 0.15)",
          color: health.color,
          borderRadius: "4px",
          fontWeight: "600",
          display: "inline-flex",
          alignItems: "center",
          gap: "3px"
        }}
        title={health.reasons.join(', ')}
      >
        {statusIcons[health.status]} {statusLabels[health.status]}
      </span>
    );
  }

  // Full mode - detailed card
  return (
    <div style={{
      padding: "12px 14px",
      background: health.status === 'critical'
        ? "linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(220, 38, 38, 0.04))"
        : "linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(245, 158, 11, 0.04))",
      border: `1px solid ${health.status === 'critical' ? 'rgba(220, 38, 38, 0.25)' : 'rgba(245, 158, 11, 0.25)'}`,
      borderRadius: "10px",
      marginTop: "8px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "6px"
      }}>
        <span style={{ fontSize: "16px" }}>{statusIcons[health.status]}</span>
        <div style={{
          fontSize: "13px",
          fontWeight: "700",
          color: health.color
        }}>
          Task Health: {statusLabels[health.status]}
        </div>
        <div style={{
          marginLeft: "auto",
          fontSize: "11px",
          padding: "2px 6px",
          background: "rgba(0,0,0,0.05)",
          borderRadius: "4px",
          color: "#666",
          fontWeight: "600"
        }}>
          Risk Score: {health.score}
        </div>
      </div>
      <div style={{
        fontSize: "12px",
        color: health.status === 'critical' ? '#7f1d1d' : '#92400e',
        lineHeight: 1.5
      }}>
        {health.reasons.length > 0 ? (
          <ul style={{
            margin: 0,
            paddingLeft: "20px",
            listStyle: "disc"
          }}>
            {health.reasons.map((reason, i) => (
              <li key={i}>{reason}</li>
            ))}
          </ul>
        ) : (
          <span>Task requires attention</span>
        )}
      </div>
    </div>
  );
}
