import { motion } from 'framer-motion';

/**
 * GrowingVine - Animated vine that grows with task progress
 *
 * Features:
 * - SVG path animation synchronized with progress
 * - Leaves appear at milestone percentages
 * - Organic curved path
 * - Used in TaskTimer for visual progress feedback
 *
 * @param {number} progress - Progress percentage (0-100)
 * @param {string} color - Vine color (default: #6FAF6F)
 * @param {boolean} showLeaves - Show milestone leaves (default: true)
 */
export default function GrowingVine({
  progress = 0,
  color = '#6FAF6F',
  showLeaves = true
}) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div
      className="growing-vine"
      style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '120px',
        height: '120px',
        pointerEvents: 'none',
        opacity: 0.15,
        zIndex:0
      }}
    >
      <svg
        viewBox="0 0 100 100"
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        {/* Main Vine Path */}
        <motion.path
          d="M10,95 Q25,75 40,65 Q55,55 70,40 Q85,25 95,10"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: clampedProgress / 100 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut'
          }}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
          }}
        />

        {/* Milestone Leaves */}
        {showLeaves && (
          <>
            {/* 25% Progress Leaf */}
            {clampedProgress > 25 && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <LeafIcon x="25" y="75" size={8} color={color} />
              </motion.g>
            )}

            {/* 50% Progress Leaf */}
            {clampedProgress > 50 && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <LeafIcon x="40" y="65" size={10} color={color} />
              </motion.g>
            )}

            {/* 75% Progress Leaf */}
            {clampedProgress > 75 && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <LeafIcon x="70" y="40" size={9} color={color} />
              </motion.g>
            )}

            {/* 100% Progress Flower */}
            {clampedProgress >= 100 && (
              <motion.g
                initial={{ opacity: 0, scale: 0, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 360 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <FlowerIcon x="95" y="10" size={12} color={color} />
              </motion.g>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

/**
 * LeafIcon - SVG leaf shape
 */
function LeafIcon({ x, y, size = 10, color = '#6FAF6F' }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <ellipse
        cx="0"
        cy="0"
        rx={size * 0.6}
        ry={size}
        fill={color}
        opacity="0.8"
        transform="rotate(-30)"
      />
      <line
        x1="0"
        y1={-size}
        x2="0"
        y2={size}
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
      />
    </g>
  );
}

/**
 * FlowerIcon - SVG flower for completion
 */
function FlowerIcon({ x, y, size = 12, color = '#6FAF6F' }) {
  const petalCount = 5;
  const petals = Array(petalCount).fill(null);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Petals */}
      {petals.map((_, i) => {
        const angle = (i * 360) / petalCount;
        return (
          <ellipse
            key={i}
            cx="0"
            cy={-size * 0.5}
            rx={size * 0.4}
            ry={size * 0.7}
            fill={color}
            opacity="0.7"
            transform={`rotate(${angle})`}
          />
        );
      })}

      {/* Center */}
      <circle
        cx="0"
        cy="0"
        r={size * 0.3}
        fill="#FFB88C"
        opacity="0.9"
      />
    </g>
  );
}

/**
 * CompactVine - Smaller vine for inline use
 */
export function CompactVine({ progress = 0 }) {
  return (
    <div
      style={{
        width: '60px',
        height: '60px',
        display: 'inline-block',
        position: 'relative'
      }}
    >
      <GrowingVine progress={progress} showLeaves={false} />
    </div>
  );
}
