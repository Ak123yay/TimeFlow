---
name: design-review
description: Comprehensive design review for TimeFlow UI/design consistency, user experience, and alignment with nature-inspired calm productivity philosophy. Use when evaluating UI modifications, new components, design systems, color updates, responsive behavior, or mobile experience changes.
disable-model-invocation: false
argument-hint: "component/section name or change type"
---

# TimeFlow Design Review - Comprehensive Quality Assurance

## Overview
TimeFlow's design philosophy is "calm productivity" through a nature-inspired aesthetic. This skill ensures all UI/design changes maintain consistency, accessibility, and the gentle, supportive user experience that defines the brand.

---

## Design Philosophy & Core Principles

### TimeFlow's Core Philosophy
1. **Realistic Planning** - Encourage users to plan what's actually achievable, not aspirational
2. **Gentle Guidance** - Supportive suggestions without guilt or judgment
3. **Progress Over Perfection** - Celebrate small wins, not just completion
4. **Calm Aesthetic** - Visual design reduces stress, not adds it
5. **Nature-Inspired** - Earth tones, organic shapes, growth metaphors

### What This Means for Design
- ✅ Warm, calming colors (greens, earth tones, soft transitions)
- ✅ Sufficient whitespace - never crowded or overwhelming
- ✅ Gentle animations - purposeful, not distracting
- ✅ Clear hierarchy - important info prominent, secondary subtle
- ✅ Self-compassionate language - encouraging, never harsh
- ❌ Gamification - no badges, streaks, or competition
- ❌ Harsh colors - no bright reds, neons, or aggressive design
- ❌ Complicated interactions - should be intuitive and calm
- ❌ Overwhelming information - must respect cognitive load

---

## Color System Review

### Color Palette Reference

#### Primary Brand Colors
- **Forest Green (Light Mode)**: #3B6E3B
- **Light Green (Dark Mode)**: #6FAF6F
- **Moss Green**: #7C9A73
- **Sage Green**: #9DB39B

#### Status Colors (Nature-Inspired)
- **Success (Fresh Leaf)**: #52B788 - Healthy, completed
- **Warning (Golden Sunflower)**: #F9C74F - Gentle alert
- **Danger (Autumn Berry)**: #FF6B6B - Urgent, error
- **Info (Water Blue)**: #90E0EF - Calm, informational

#### Neutral Colors
- **Text Primary (Light)**: #1A1A1A
- **Text Primary (Dark)**: #E8F0E8
- **Background (Light)**: #F0F8F2
- **Background (Dark)**: #1A1F1A
- **Card**: #ffffff (light), #242B24 (dark)

#### Icon Colors (ONLY)
- **Light Mode**: #999 (grey)
- **Dark Mode**: #888 (darker grey)
- **NEVER use other colors for icons**

### Color Review Checklist
- [ ] All colors from approved palette (no new colors added)
- [ ] Icons are ONLY grey (#999 or #888, never green/blue/red)
- [ ] Dark mode colors adjusted +10-15% brightness from light
- [ ] Status colors (warning/danger) used appropriately
- [ ] No harsh neons or bright reds (except danger critical)
- [ ] Green/earth tones used consistently
- [ ] Text has sufficient contrast (WCAG AA minimum)

### Dark Mode Verification
```
1. Enable OS dark mode (Settings → Display)
2. Refresh app
3. Verify all colors updated correctly
4. Check text readability (not too dark)
5. Verify background is dark, not black
6. Check card backgrounds are slightly lighter than background
7. Confirm no colors "stuck" at light mode values
```

---

## Typography & Text Review

### Font System
- **Family**: Inter, system-ui, -apple-system, "Segoe UI", Roboto
- **Scale**: Consistent hierarchy (h1 > h2 > h3 > body > small)

### Sizing Guidelines
- **Headings**: h1 (28px/800wt), h2 (22px/700wt), h3 (18px/700wt)
- **Body**: 15px normal weight
- **Labels**: 13px, slightly muted color
- **Mobile Input**: Minimum 16px (prevents iOS autofocus zoom)

### Text Review Checklist
- [ ] Readable on small screens (320px width)
- [ ] Sufficient color contrast (WCAG AA: 4.5:1 for small text)
- [ ] No text smaller than 12px (unreadable)
- [ ] Line height adequate (1.4-1.6 for readability)
- [ ] Form inputs are 44px minimum height (touch target)
- [ ] Buttons have clear labels (no icon-only buttons)
- [ ] Error messages are clear and helpful
- [ ] Instructions are concise, not overwhelming

---

## Spacing & Layout Review

### Spacing Scale
- **Micro**: 4px (rarely used)
- **Small**: 8px (padding within components)
- **Medium**: 12px, 16px (gaps between elements)
- **Large**: 20px, 24px (section spacing)
- **Extra**: 32px+ (major section breaks)

### Layout Patterns
- **Full width**: Content spans 100% on mobile, max-width on desktop
- **Padding**: Consistent gutters (16px-20px mobile, 24px desktop)
- **Gaps**: Consistent spacing between similar elements
- **Alignment**: Content flush-left or centered, never weird indents

### Responsive Breakpoints
- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px
- **Desktop**: 1025px+

### Layout Review Checklist
- [ ] No horizontal scroll on any screen size
- [ ] Comfortable padding on all edges (not cramped)
- [ ] Consistent spacing between elements (not erratic)
- [ ] Tab bar doesn't overlap content (70px minimum bottom padding)
- [ ] Cards have adequate padding inside (14-20px)
- [ ] Sections well-separated (visual hierarchy clear)
- [ ] Icon + text properly aligned (baseline matches)
- [ ] Forms not too wide on desktop (max-width 600px ideally)
- [ ] Touch targets minimum 44x44px on mobile

---

## Component-Specific Review

### Tab Bar Review
**Fixed Styling**: 70px height, full viewport width, solid background
- [ ] Height exactly 70px (not 60px, not 80px)
- [ ] Background solid white (#ffffff) or (#1a1a1a), NOT semi-transparent
- [ ] Width 100vw (full viewport, not 100%)
- [ ] Icon size exactly 20px (not 24px, not 32px)
- [ ] Icons grey (#999 light, #888 dark)
- [ ] Active tab has clear indicator (thin underline)
- [ ] All 5 tabs visible and properly spaced
- [ ] Fixed position at bottom, above keyboard on mobile

### Icon Review
- [ ] All icons outline-only (no fills, no colors)
- [ ] Stroke weight consistent (1.2px standard)
- [ ] Icons grey only (#999 or #888)
- [ ] Dark mode works (context-based)
- [ ] Sizes correct (20px tab bar, 24px standard)
- [ ] No decorative elements or details
- [ ] Minimalistic aesthetic maintained
- [ ] Accessible (aria-hidden="true" on SVG)

### Task Cards Review
- [ ] Consistent padding (14-20px interior)
- [ ] Clear visual hierarchy (name prominent, meta info secondary)
- [ ] Active task stands out (highlighted, different color)
- [ ] Completed tasks muted (lower opacity)
- [ ] Borders/shadows subtle (not harsh)
- [ ] Touch-friendly sizing (comfortable to tap)
- [ ] Timeline visible and clear
- [ ] Status badges visible and understandable

### Buttons Review
- [ ] Minimum 44px height (touch target)
- [ ] Clear label text (not icon-only)
- [ ] Primary buttons prominent (green, gradient)
- [ ] Secondary buttons subtle (ghost style, outline)
- [ ] Hover state clear (scale up or color shift)
- [ ] Active/pressed state feedback (quick animation)
- [ ] Disabled state visible (greyed out or disabled cursor)
- [ ] Loading state if async (spinner or disabled)

---

## Animation & Motion Review

### Animation Philosophy
- **Speed**: 0.2s-0.4s for most transitions (not instant, not slow)
- **Easing**: Cubic-bezier(0.25, 0.46, 0.45, 0.94) (smooth, spring-like)
- **Purpose**: Purposeful, not distracting (draw attention to changes)
- **Accessibility**: Respect prefers-reduced-motion

### Animation Review Checklist
- [ ] Animations under 400ms (not too slow)
- [ ] Easing smooth, not linear
- [ ] Animations enhance, not distract
- [ ] Respects prefers-reduced-motion (reduces to 10-50ms)
- [ ] No jank or stuttering (60fps smooth)
- [ ] Hover animations light (micro-interactions)
- [ ] Loading states are animated (spinner, pulse)
- [ ] Transitions between states clear (fade, slide)
- [ ] No overwhelming entrance animations

### Motion Testing
```
1. Open DevTools (F12)
2. Find prefers-reduced-motion in Settings → Rendering
3. Enable it
4. Verify animations disabled or greatly reduced
5. Disable it
6. Verify animations restored
```

---

## Dark Mode Review

### Dark Mode Requirements
- All colors should have dark mode equivalent
- Dark mode is CSS-based (prefers-color-scheme: dark)
- Sufficient contrast in dark mode (4.5:1 for small text)
- No colors "stuck" at light mode values

### Dark Mode Testing
```
1. Enable System Dark Mode (OS Settings)
2. Refresh app - all colors update immediately
3. Check all components render correctly
4. Verify no light colors in dark mode
5. Check contrast is sufficient (not too dark/light)
6. Test all interactive elements (buttons, inputs, etc)
7. Verify icons updated to dark grey
8. Test dark mode + light mode switching
```

### Dark Mode CSS Pattern
```css
/* CORRECT: Uses CSS variables that change in dark mode */
:root {
  --primary: #3B6E3B;
  --bg: #F0F8F2;
}

@media (prefers-color-scheme: dark) {
  :root {
    --primary: #6FAF6F;  /* Lighter for dark mode */
    --bg: #1A1F1A;
  }
}

body {
  background: var(--bg);  /* Uses variable, adapts automatically */
}
```

---

## Accessibility Review

### Color Contrast
- **WCAG AA**: Minimum 4.5:1 for normal text, 3:1 for large text
- **WCAG AAA**: 7:1 for normal text, 4.5:1 for large text (recommended)
- **Exception**: Icons can be lower if outlined (not filled)

### Touch Targets
- **Minimum**: 44x44px (Apple guideline)
- **Comfortable**: 48x48px+
- **Spacing**: At least 8px between touch targets

### Semantics & Navigation
- [ ] Proper heading hierarchy (h1, h2, h3 in order)
- [ ] Form labels associated with inputs (not placeholder-only)
- [ ] Buttons and links clearly labeled
- [ ] Icon-only buttons have aria-label or title
- [ ] Important decorative images have aria-hidden="true"
- [ ] Color not the only indicator (also use shape, text, icons)
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus visible (outline visible when tabbing)

### Accessibility Testing
```
1. Test with keyboard only (Tab through page)
2. Disable colors (Chrome DevTools → Rendering → Emulate CSS media feature)
3. Verify content still distinguishable without color
4. Test with screen reader (optional, browser-dependent)
5. Zoom in 200% (should still be readable, no horizontal scroll)
```

---

## Mobile Experience Review

### Mobile Viewport
- [ ] Viewport meta tag correct (width=device-width, initial-scale=1)
- [ ] No horizontal scroll at any zoom level
- [ ] Works in both portrait and landscape
- [ ] Zooming still possible (not disabled by `user-scalable=no`)

### Touch Interactions
- [ ] All buttons/interactive elements 44x44px minimum
- [ ] Double-tap zoom works if needed
- [ ] No touch lag or delay
- [ ] Swipe gestures smooth and responsive
- [ ] No hover-only functionality (not accessible on touch)

### Mobile Optimization
- [ ] Forms not too wide (not full viewport on tablet)
- [ ] Keyboard doesn't cover important content
- [ ] Input fields 16px minimum (prevents iOS zoom)
- [ ] No decorative elements (floating leaves, etc) on mobile
- [ ] Performance good on slower connections
- [ ] Battery-friendly (no excessive animations)

### Mobile Testing Checklist
```
1. Test on iPhone (portrait & landscape)
2. Test on Android phone
3. Test on tablet (portrait & landscape)
4. Test on various screen sizes (DevTools → Device Toolbar)
5. Test touch interactions (tap, long-press, swipe)
6. Test keyboard (bottom sheet, modals with inputs)
7. Test in landscape (especially with notch/safe-area)
8. Zoom 200% - should still be usable
```

### Safe Area Handling
- [ ] Content doesn't hide under notches
- [ ] Safe area padding used on edges
- [ ] Tab bar respects safe-area-inset-bottom
- [ ] Forms respect safe-area-inset-left/right

---

## Performance Review

### Visual Performance
- [ ] Animations smooth (60fps, no dropped frames)
- [ ] Scroll smooth (no jank)
- [ ] Transitions quick (<400ms)
- [ ] No layout thrashing (excessive repaints)

### Image & Asset Optimization
- [ ] SVG icons used instead of raster images
- [ ] Icons optimized (no unnecessary complexity)
- [ ] Images sized appropriately for device
- [ ] No oversized assets

### DevTools Audit
```
1. Open DevTools → Lighthouse
2. Run audit (Performance)
3. Check score (90+ is good, 100 ideal)
4. Review suggestions
5. Check for long-running scripts
```

---

## Philosophy Alignment Review

### Calm Productivity Check
- [ ] Design is peaceful, not stressful
- [ ] No aggressive language or visuals
- [ ] No gamification elements (badges, streaks, points)
- [ ] Focus on progress, not perfection
- [ ] Error messages are helpful, not punishment
- [ ] Success feedback is gentle, not flashy

### Nature-Inspired Check
- [ ] Colors from nature (greens, earth, water)
- [ ] No artificial bright colors
- [ ] Organic shapes (rounded corners, soft edges)
- [ ] Maybe subtle nature metaphors (growth, seasons)

### User-Centered Check
- [ ] Information hierarchy clear (important info prominent)
- [ ] No cognitive overload (simplified UI, not complex)
- [ ] Instructions clear and concise
- [ ] Edge cases handled gracefully
- [ ] No confusing states or missing feedback

---

## Common Design Mistakes to Catch

### Mistake 1: Wrong Tab Bar Height
```css
/* ❌ WRONG */
.tab-bar { height: 60px; }    /* Too small */
.tab-bar { height: 90px; }    /* Too large */

/* ✅ CORRECT */
.tab-bar { height: 70px; }
```

### Mistake 2: Icon Colors Changed
```jsx
/* ❌ WRONG: Icon color not grey */
<CheckmarkIcon stroke="#52B788" />  /* Green! */

/* ✅ CORRECT: Icons always grey */
<CheckmarkIcon />  {/* Uses context, renders #999 or #888 */}
```

### Mistake 3: No Dark Mode Support
```css
/* ❌ WRONG: Only light mode */
.card { background: #ffffff; }  /* Always white */

/* ✅ CORRECT: Supports dark mode */
.card { background: var(--card); }  /* #ffffff or #242B24 */
```

### Mistake 4: Insufficient Touch Targets
```css
/* ❌ WRONG */
button { height: 30px; }    /* Too small! */

/* ✅ CORRECT */
button { min-height: 44px; }  /* Touch-friendly */
```

### Mistake 5: Harsh Status Colors
```css
/* ❌ WRONG: Aggressive colors */
.warning { color: #ff0000; }  /* Bright red */
.info { color: #0000ff; }     /* Bold blue */

/* ✅ CORRECT: Nature-inspired */
.warning { color: #F9C74F; }  /* Golden */
.info { color: #90E0EF; }     /* Water blue */
```

---

## Review Checklist - Final Quality Gate

### Visual Consistency
- [ ] Colors from approved palette
- [ ] Typography consistent (sizing, weight)
- [ ] Spacing consistent (using scale)
- [ ] Icons all grey and outline-only
- [ ] Components match existing design
- [ ] Dark mode fully supported

### User Experience
- [ ] Interactions intuitive
- [ ] Feedback clear (hover, active, disabled states)
- [ ] Touch-friendly (44px+ targets)
- [ ] Mobile responsive (321px to 4000px+)
- [ ] Animations purposeful and smooth
- [ ] Loading states visible

### Accessibility
- [ ] Contrast sufficient (4.5:1 minimum)
- [ ] Touch targets adequate
- [ ] Color not only indicator
- [ ] Keyboard navigable
- [ ] Focus visible
- [ ] Semantic HTML

### Performance
- [ ] No layout jank or stuttering
- [ ] Animations smooth (60fps)
- [ ] Assets optimized
- [ ] No memory leaks
- [ ] Battery-friendly

### Philosophy Alignment
- [ ] Peaceful, not stressful
- [ ] Nature-inspired aesthetic
- [ ] Progress-focused, not perfection
- [ ] Supportive, not judgmental
- [ ] No harmful gamification

---

## Design Review Workflow

1. **Identify scope** - What component or section is changing?
2. **Check colors** - Do they match the palette?
3. **Test responsiveness** - Works on mobile and desktop?
4. **Verify accessibility** - Sufficient contrast, touch targets good?
5. **Test dark mode** - All colors update correctly?
6. **Check philosophy** - Does it align with calm productivity?
7. **Review animations** - Smooth and purposeful?
8. **Document findings** - Note any issues
9. **Recommend fixes** - Specific change needed
10. **Verify fix** - Re-check after changes

---

## Getting Help

- Use `/timeflow-guide` for design system documentation
- Use `/icon-guide` for icon-specific reviews
- Use `/design-review [component]` for deeper analysis
- Reference this skill for specific review guidelines
