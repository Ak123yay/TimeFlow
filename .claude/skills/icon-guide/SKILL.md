---
name: icon-guide
description: Comprehensive guidelines for maintaining TimeFlow's minimalistic icon system design standards. Use when creating new icons, modifying existing icons, reviewing icon consistency, optimizing icon performance, or ensuring dark mode compatibility across the icon library.
user-invocable: true
disable-model-invocation: false
argument-hint: "icon name or category to create/review"
---

# TimeFlow Icon System - Design Standards & Implementation Guide

## Design Philosophy & Principles

TimeFlow uses a **minimalistic outline-only aesthetic** that complements its calm, nature-inspired design. This ensures visual consistency, performance optimization, and proper dark mode rendering across all 60+ icons in the system.

### Core Design Principles
1. **Outline-Only**: All icons use strokes, never fills. `fill="none"` is mandatory on every SVG
2. **Minimalistic**: Maximum visual clarity with minimum complexity - no gradients, shadows, or effects
3. **Consistency**: All icons maintain the same visual weight, stroke style, and overall aesthetic
4. **Dark Mode**: Automatic color detection via context, no hardcoded colors
5. **Performance**: React.memo optimization on every icon component for optimal rendering

### Why These Principles Matter
- **Outline-only**: Reduces visual noise in dense task lists, maintains calm aesthetic
- **Minimalistic**: Faster rendering (fewer vector paths), clearer visibility at small sizes
- **Consistent**: Creates visual unity across the app, recognizable icon language
- **Dark mode ready**: Respects user preferences, prevents accessibility issues
- **Performant**: Memoized icons prevent unnecessary re-renders in 100+ task scenarios

---

## Icon Component Architecture

### Required Template & Structure

Every icon must follow this exact structure:

```javascript
import React from 'react';
import { useIconContext } from '../IconContext';

const IconName = React.memo(({
  size = 24,
  fill = null,
  isDark = null,
  className = '',
}) => {
  // REQUIRED: Get dark mode from context
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;

  // REQUIRED: Determine fill color based on dark mode
  // Override 'fill' prop takes precedence, then context, then default
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

  // REQUIRED: Return properly configured SVG
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"                          // CRITICAL: Always 'none'
      stroke={resolvedFill}                // Use resolved color
      strokeWidth="1.2"                    // Standard weight
      strokeLinecap="round"                // Soft edges
      strokeLinejoin="round"               // Smooth corners
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"                   // Accessibility
    >
      {/* SVG path elements - outline only, no fills */}
      <path d="M 12 2 L 22 8 L 22 16 C 22 19.3137 19.3137 22 16 22 L 8 22 C 4.68629 22 2 19.3137 2 16 L 2 8 Z" />
    </svg>
  );
});

// REQUIRED: Display name for React DevTools
IconName.displayName = 'IconName';

export default IconName;
```

### Parameter Reference

| Parameter | Type | Default | Purpose |
|-----------|------|---------|---------|
| `size` | number | 24 | Icon width/height in pixels |
| `fill` | string \| null | null | Override color (for special cases) |
| `isDark` | boolean \| null | null | Force dark/light mode (for testing) |
| `className` | string | '' | Additional CSS classes for styling |

---

## Icon Categories & Organization

TimeFlow organizes icons into **8 semantic categories** for maintainability:

### 1. Growth Icons (Growth/Progress)
- **Examples**: Leaf, Sprout, Flower, Nut, Water, Moon
- **Purpose**: Represent growth, progress, learning, development
- **Usage**: Task categories, milestone markers, achievement badges
- **Location**: `src/icons/growth/`

### 2. Status Icons (Task Status)
- **Examples**: Checkmark, Close, Calendar, Clock, Timer, AlertCircle
- **Purpose**: Show task state and timeline information
- **Usage**: Completion states, deadline indicators, timing information
- **Location**: `src/icons/status/`

### 3. Emotion Icons (User Feelings)
- **Examples**: Happy, Neutral, Sad, Star, Heart, Celebration
- **Purpose**: Represent emotional states and satisfaction
- **Usage**: Reflection, mood tracking, celebration feedback
- **Location**: `src/icons/emotions/`

### 4. UI Control Icons (Interactive Elements)
- **Examples**: Play, Pause, Search, Trash, Settings, Menu, Close
- **Purpose**: Standard UI interactions and navigation
- **Usage**: Button icons, control elements, navigation
- **Location**: `src/icons/ui-controls/`

### 5. Category Icons (Task Categories)
- **Examples**: Computer (Coding), Users (Teamwork), Palette (Creative), Mail (Email), PersonBadge (Admin), Heart (Health), Book (Learning), Lightbulb (Personal)
- **Purpose**: Identify task categories at a glance
- **Usage**: Task category labels, filtering, insights grouping
- **Location**: `src/icons/categories/`

### 6. Achievement Icons (Rewards & Milestones)
- **Examples**: Badge, Trophy, Medal, Star, Target
- **Purpose**: Mark achievements, streaks, and milestones
- **Usage**: Achievement display, streak indicators, rewards
- **Location**: `src/icons/achievements/`

### 7. Platform Icons (System Elements)
- **Examples**: Settings, Info, Help, Bell, Share
- **Purpose**: OS-level and system interactions
- **Usage**: Settings navigation, help links, notifications
- **Location**: `src/icons/platform/`

### 8. Misc Icons (Utility)
- **Examples**: Loading, Dots, Lines, Shapes
- **Purpose**: Various utility and decorative purposes
- **Usage**: Spinners, dividers, decorations
- **Location**: `src/icons/misc/`

---

## Stroke & Shape Guidelines

### Stroke Specifications
- **Primary stroke weight**: 1.2px (most common)
- **Range**: 1.1-1.3px (acceptable variation)
- **Linecap**: Always `round` for soft, modern appearance
- **Linejoin**: Always `round` for smooth corners
- **No variable weights**: Avoid 0.8px or 1.5px unless specifically justified

### Shape Design Patterns

#### Pattern 1: Simple Circles & Rings
```jsx
<circle cx="12" cy="12" r="10" stroke={resolvedFill} strokeWidth="1.2" />
{/* For concentric circles (target, focus) */}
<circle cx="12" cy="12" r="8" stroke={resolvedFill} strokeWidth="1.2" />
<circle cx="12" cy="12" r="5" stroke={resolvedFill} strokeWidth="1.2" />
```

#### Pattern 2: Checkmarks & Confirmations
```jsx
<path
  d="M 4 12 L 10 18 L 20 6"
  stroke={resolvedFill}
  strokeWidth="1.2"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
```

#### Pattern 3: Bar Charts & Data
```jsx
<rect x="4" y="16.5" width="4" height="4" stroke={resolvedFill} strokeWidth="1.1" rx="0.6" />
<rect x="10" y="12.5" width="4" height="8" stroke={resolvedFill} strokeWidth="1.1" rx="0.6" />
<rect x="16" y="8.5" width="4" height="12" stroke={resolvedFill} strokeWidth="1.1" rx="0.6" />
```

#### Pattern 4: Outlined Text Icons
```jsx
<path d="M 3 6 L 21 6 M 3 12 L 21 12 M 3 18 L 21 18" stroke={resolvedFill} strokeWidth="1.2" />
```

#### Pattern 5: Arrow Indicators
```jsx
<path d="M 6 12 L 18 12 M 12 6 L 18 12 L 12 18" stroke={resolvedFill} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
```

---

## Sizing Standards & Usage

### Size Guidelines
- **Tab bar icons**: 20px (fixed, critical size)
- **Card icons**: 24px (default)
- **Large displays**: 32px, 48px, 64px, 72px (scales proportionally)
- **Small badges**: 16px, 18px (must remain readable)

### At-Size Testing Checklist
Test each icon at these sizes for readability:
- [ ] 16px - Small badge/icon (readable?)
- [ ] 20px - Tab bar (sharp, not blurry?)
- [ ] 24px - Standard size (balanced?)
- [ ] 32px - Large button (maintains clarity?)
- [ ] 64px - Hero section (fills space well?)

### Scalability Rules
- All icons should scale linearly without distortion
- Stroke weight should remain visually consistent across sizes
- Fine details must remain readable at 16px minimum
- Avoid designs that only work at specific sizes

---

## Color Implementation & Dark Mode

### Color Specification
```javascript
// Light Mode: #999 (60% grey)
// Dark Mode: #888 (darker grey, ~67% grey)
// These are the ONLY colors ever used for icons

// CORRECT: Use dynamic color resolution
const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

// WRONG: Hardcoded colors
const fill = '#999'; // Always light - breaks dark mode!

// WRONG: Multiple colors
<path d="..." fill="green" />   // Never!
<path d="..." stroke="blue" />  // Never!
```

### Dark Mode Detection
```javascript
// Context-based detection (recommended)
const context = useIconContext();
const resolvedIsDark = isDark ?? context?.isDark ?? false;

// Testing dark mode during development
<IconName isDark={true} />   // Force dark mode
<IconName isDark={false} />  // Force light mode
```

### CSS Dark Mode Fallback
For icons rendered via CSS (rare):
```css
.icon {
  color: #999;  /* Light mode */
}

@media (prefers-color-scheme: dark) {
  .icon {
    color: #888;  /* Dark mode */
  }
}
```

---

## Implementation Checklist - Before Adding to Index

Complete this checklist for every new icon:

### Design Quality
- [ ] Uses outline-only design (`fill="none"`)
- [ ] All strokes exactly 1.2px width
- [ ] Uses `strokeLinecap="round"` and `strokeLinejoin="round"`
- [ ] No gradients, shadows, or effects
- [ ] No filled shapes or colored regions
- [ ] Visual weight matches other icons in category

### Code Quality
- [ ] Has React.memo wrapper
- [ ] Has displayName property
- [ ] Has aria-hidden="true" on SVG
- [ ] Uses useIconContext for dark mode
- [ ] No hardcoded colors (#999/#888 determined dynamically)
- [ ] Accepts size, fill, isDark, className parameters
- [ ] SVG has viewBox="0 0 24 24"

### Dark Mode
- [ ] Tested at size 20px and 24px in light mode (#999)
- [ ] Tested at size 20px and 24px in dark mode (#888)
- [ ] Readable and clear in both modes
- [ ] No contrast issues

### Integration
- [ ] Exported from `src/icons/index.js` (barrel export)
- [ ] Placed in correct category folder
- [ ] Naming follows convention: PascalCase + "Icon" suffix
- [ ] No duplicate icons with similar names

### Performance
- [ ] Uses React.memo (prevents unnecessary re-renders)
- [ ] SVG paths are optimized (no overly complex shapes)
- [ ] File size is reasonable (<1KB typical)

---

## Common Icon Design Mistakes & Fixes

### Mistake 1: Using Filled Shapes
```jsx
// ❌ WRONG: Filled circle
<circle cx="12" cy="12" r="10" fill="#999" />

// ✅ CORRECT: Outlined circle
<circle cx="12" cy="12" r="10" stroke={resolvedFill} strokeWidth="1.2" fill="none" />
```

### Mistake 2: Inconsistent Stroke Weights
```jsx
// ❌ WRONG: Mixed stroke widths
<path d="M 5 12 L 19 12" strokeWidth="0.8" />  // Too thin
<path d="M 12 5 L 12 19" strokeWidth="1.5" />  // Too thick

// ✅ CORRECT: Consistent weight
<path d="M 5 12 L 19 12" strokeWidth="1.2" />
<path d="M 12 5 L 12 19" strokeWidth="1.2" />
```

### Mistake 3: Hardcoded Colors
```jsx
// ❌ WRONG: Color doesn't respond to dark mode
<svg fill="none" stroke="#999">  // Always light!
  {/* ... */}
</svg>

// ✅ CORRECT: Dynamic color resolution
<svg fill="none" stroke={resolvedFill}>  // Uses context!
  {/* ... */}
</svg>
```

### Mistake 4: Missing Dark Mode Context
```jsx
// ❌ WRONG: Doesn't import or use context
const MyIcon = ({ size = 24 }) => (
  <svg fill="none" stroke="#999">  // No dark mode support!
    {/* ... */}
  </svg>
);

// ✅ CORRECT: Imports and uses context
const MyIcon = React.memo(({ size = 24, isDark = null }) => {
  const context = useIconContext();
  const resolvedIsDark = isDark ?? context?.isDark ?? false;
  const resolvedFill = fill ?? (resolvedIsDark ? '#888' : '#999');

  return (
    <svg fill="none" stroke={resolvedFill}>
      {/* ... */}
    </svg>
  );
});
```

### Mistake 5: Inconsistent Sizing
```jsx
// ❌ WRONG: Icons at different default sizes
<IconA size={24} />  {/* Default */}
<IconB size={32} />  {/* Wrong default! */}

// ✅ CORRECT: Consistent defaults
<IconA size={24} />  {/* Standard */}
<IconB size={24} />  {/* Standard */}
<IconC size={24} />  {/* For tab bar, use 20px explicitly */}
```

---

## Exporting & Tree-Shaking

### Barrel Export Pattern
All icons are exported from `src/icons/index.js` for clean module structure:

```javascript
// ✅ CORRECT: Named exports enable tree-shaking
export { default as LeafIcon } from './growth/LeafIcon';
export { default as CheckmarkIcon } from './status/CheckmarkIcon';
export { default as HappyIcon } from './emotions/HappyIcon';
// ... etc for all 60+ icons

// Usage in components
import { LeafIcon, CheckmarkIcon, HappyIcon } from '@/icons';
```

### File Organization
```
src/icons/
├── growth/
│   ├── LeafIcon.jsx
│   ├── SproutIcon.jsx
│   └── ...
├── status/
│   ├── CheckmarkIcon.jsx
│   ├── CloseIcon.jsx
│   └── ...
├── [other categories]/
└── index.js (barrel export)
```

---

## Testing Icons Properly

### Manual Testing Checklist
1. **Light Mode**: Render at 20px, 24px, 32px - all readable?
2. **Dark Mode**: Toggle OS dark mode - colors update correctly?
3. **Integration**: Import from barrel export - works without errors?
4. **Performance**: No console warnings or performance issues?
5. **Accessibility**: No visual contrast issues (WCAG AA+)?

### Quick Test Component
```jsx
// Use this to test new icons during development
function IconTest() {
  const [isDark, setIsDark] = React.useState(false);

  return (
    <div>
      <button onClick={() => setIsDark(!isDark)}>Toggle Dark</button>
      <div style={{ background: isDark ? '#1a1a1a' : '#fff', padding: '20px' }}>
        <MyNewIcon size={16} isDark={isDark} />
        <MyNewIcon size={20} isDark={isDark} />
        <MyNewIcon size={24} isDark={isDark} />
        <MyNewIcon size={32} isDark={isDark} />
      </div>
    </div>
  );
}
```

---

## Performance Optimization Tips

- **Use React.memo**: Every icon component should be wrapped
- **Avoid inline SVGs**: Always use separate files for cleaner code
- **Minimal paths**: Simplify SVG paths to reduce file size
- **Cache at component level**: Icons rendered 100+ times benefit from memoization
- **Batch icon updates**: If modifying multiple icons, do it in one commit

---

## Quick Reference

| Task | File | Example |
|------|------|---------|
| Create new icon | `src/icons/[category]/IconName.jsx` | `src/icons/growth/LeafIcon.jsx` |
| Add to exports | `src/icons/index.js` | `export { default as LeafIcon } from ...` |
| Use in component | Any component file | `import { LeafIcon } from '@/icons'` |
| Test sizes | Component render | `<LeafIcon size={24} />` |
| Test dark mode | Context override | `<LeafIcon isDark={true} />` |
| Tab bar size | Tab component | `<LeafIcon size={20} />` |
