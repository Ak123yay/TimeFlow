import { useEffect, useState } from "react";
import { CelebrationIcon, LeafIcon } from '../icons';

export default function Celebration({ type = 'task', onComplete }) {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate leaves based on celebration type
    const leafCount = type === 'allDone' ? 20 : 8;
    const newLeaves = [...Array(leafCount)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 3 + Math.random() * 2,
      drift: (Math.random() - 0.5) * 100
    }));
    setLeaves(newLeaves);

    // Auto-dismiss after animation
    const timeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, type === 'allDone' ? 4000 : 3000);

    return () => clearTimeout(timeout);
  }, [type, onComplete]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: "none",
      zIndex: 9999,
      overflow: "hidden"
    }}>
      {/* Success message */}
      {type === 'allDone' && (
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          animation: "celebrationPulse 1s ease-out",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "72px",
            animation: "celebrationBounce 0.6s ease-out"
          }}>
            <CelebrationIcon size={72} />
          </div>
          <div style={{
            fontSize: "24px",
           fontWeight: "900",
            color: "#3B6E3B",
            marginTop: "16px",
            textShadow: "0 2px 8px rgba(59,110,59,0.2)"
          }}>
            All tasks complete!
          </div>
        </div>
      )}

      {/* Falling leaves */}
      {leaves.map(leaf => (
        <div
          key={leaf.id}
          style={{
            position: "absolute",
            top: "-50px",
            left: `${leaf.left}%`,
            animation: `fallingLeaf ${leaf.duration}s linear ${leaf.delay}s forwards`,
            opacity: 0.7,
            "--drift": `${leaf.drift}px`
          }}
        >
          <LeafIcon size={type === 'allDone' ? 32 : 24} />
        </div>
      ))}

      <style>{`
        @keyframes fallingLeaf {
          0% {
            transform: translate(0, -50px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translate(var(--drift), 100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes celebrationPulse {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes celebrationBounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          25% {
            transform: translateY(-30px) scale(1.2);
          }
          50% {
            transform: translateY(-15px) scale(1.1);
          }
          75% {
            transform: translateY(-5px) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
