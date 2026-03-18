/**
 * SwiftUI-style React Component Utilities
 * Native iOS/macOS design patterns for React
 */

import React from 'react';

// SwiftUI Button Component
export const SwiftUIButton = React.memo(({
  children,
  style = 'primary',
  size = 'medium',
  disabled = false,
  ...props
}) => {
  const sizeClass = size === 'large' ? 'large' : size === 'small' ? 'small' : '';
  return (
    <button
      className={`swiftui-button ${style} ${sizeClass}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

SwiftUIButton.displayName = 'SwiftUIButton';

// SwiftUI Card Component
export const SwiftUICard = React.memo(({ children, interactive = false, ...props }) => (
  <div className={`swiftui-card ${interactive ? 'interactive' : ''}`} {...props}>
    {children}
  </div>
));

SwiftUICard.displayName = 'SwiftUICard';

// SwiftUI List Component
export const SwiftUIList = React.memo(({ children, ...props }) => (
  <div className="swiftui-list" {...props}>
    {children}
  </div>
));

SwiftUIList.displayName = 'SwiftUIList';

// SwiftUI List Item Component
export const SwiftUIListItem = React.memo(({
  children,
  trailing = null,
  ...props
}) => (
  <div className="swiftui-list-item" {...props}>
    <div style={{ flex: 1 }}>{children}</div>
    {trailing && <div>{trailing}</div>}
  </div>
));

SwiftUIListItem.displayName = 'SwiftUIListItem';

// SwiftUI Navigation Bar
export const SwiftUINavBar = React.memo(({
  title,
  small = false,
  leading = null,
  trailing = null,
}) => (
  <div className="swiftui-navbar">
    {leading && <div>{leading}</div>}
    <div className={small ? 'swiftui-navbar-small-title' : 'swiftui-navbar-title'}>
      {title}
    </div>
    {trailing && <div>{trailing}</div>}
  </div>
));

SwiftUINavBar.displayName = 'SwiftUINavBar';

// SwiftUI Tab Bar
export const SwiftUITabBar = React.memo(({
  items,
  activeIndex,
  onChange,
  style = 'default',
  compact = false,
}) => {
  const barClasses = `swiftui-tabbar ${style} ${compact ? 'compact' : ''}`.trim();

  return (
    <div className={barClasses}>
      {items.map((item, index) => (
        <div
          key={index}
          className={`swiftui-tab-item ${index === activeIndex ? 'active' : ''}`}
          onClick={() => onChange(index)}
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={item.label}
        >
          {item.icon && <div>{item.icon}</div>}
          {item.label && <span>{item.label}</span>}
          {item.badge && <div className="swiftui-tab-badge">{item.badge}</div>}
          <div className="swiftui-tab-indicator" />
        </div>
      ))}
    </div>
  );
});

SwiftUITabBar.displayName = 'SwiftUITabBar';

// SwiftUI Sheet Modal
export const SwiftUISheet = React.memo(({
  title,
  children,
  onClose,
  ...props
}) => (
  <div className="swiftui-sheet" {...props}>
    <div className="swiftui-sheet-handle" />
    {title && <h2 className="swiftui-sheet-title">{title}</h2>}
    {children}
  </div>
));

SwiftUISheet.displayName = 'SwiftUISheet';

// SwiftUI Toggle/Switch
export const SwiftUIToggle = React.memo(({
  checked = false,
  onChange,
  ...props
}) => (
  <button
    className={`swiftui-toggle ${checked ? 'active' : ''}`}
    onClick={() => onChange?.(!checked)}
    role="switch"
    aria-checked={checked}
    {...props}
  />
));

SwiftUIToggle.displayName = 'SwiftUIToggle';

// SwiftUI TextField
export const SwiftUITextField = React.memo(({
  placeholder = '',
  ...props
}) => (
  <input
    className="swiftui-textfield"
    placeholder={placeholder}
    {...props}
  />
));

SwiftUITextField.displayName = 'SwiftUITextField';

// SwiftUI Segmented Control
export const SwiftUISegmented = React.memo(({
  items,
  activeIndex = 0,
  onChange,
}) => (
  <div className="swiftui-segmented">
    {items.map((item, index) => (
      <button
        key={index}
        className={`swiftui-segmented-item ${index === activeIndex ? 'active' : ''}`}
        onClick={() => onChange(index)}
      >
        {item}
      </button>
    ))}
  </div>
));

SwiftUISegmented.displayName = 'SwiftUISegmented';

// SwiftUI Section Header
export const SwiftUISectionHeader = React.memo(({ children, ...props }) => (
  <h3 className="swiftui-section-header" {...props}>
    {children}
  </h3>
));

SwiftUISectionHeader.displayName = 'SwiftUISectionHeader';

// SwiftUI Section Footer
export const SwiftUISectionFooter = React.memo(({ children, ...props }) => (
  <p className="swiftui-section-footer" {...props}>
    {children}
  </p>
));

SwiftUISectionFooter.displayName = 'SwiftUISectionFooter';

// SwiftUI Divider
export const SwiftUIDivider = React.memo((props) => (
  <div className="swiftui-divider" {...props} />
));

SwiftUIDivider.displayName = 'SwiftUIDivider';

// SwiftUI VStack
export const SwiftUIVStack = React.memo(({
  children,
  spacing = 'default',
  ...props
}) => (
  <div className={`swiftui-vstack ${spacing === 'large' ? 'large-gap' : ''}`} {...props}>
    {children}
  </div>
));

SwiftUIVStack.displayName = 'SwiftUIVStack';

// SwiftUI HStack
export const SwiftUIHStack = React.memo(({
  children,
  spacing = 'default',
  spaceBetween = false,
  ...props
}) => (
  <div
    className={`swiftui-hstack ${spaceBetween ? 'space-between' : ''}`}
    {...props}
  >
    {children}
  </div>
));

SwiftUIHStack.displayName = 'SwiftUIHStack';

// SwiftUI Spacer
export const SwiftUISpacer = React.memo(({ size = 8 } = {}) => (
  <div style={{ height: size, width: '100%' }} />
));

SwiftUISpacer.displayName = 'SwiftUISpacer';

// SwiftUI Group
export const SwiftUIGroup = React.memo(({ children, ...props }) => (
  <div className="swiftui-group" {...props}>
    {children}
  </div>
));

SwiftUIGroup.displayName = 'SwiftUIGroup';

// SwiftUI Loading Indicator
export const SwiftUIProgress = React.memo((props) => (
  <div className="swiftui-progress" {...props} />
));

SwiftUIProgress.displayName = 'SwiftUIProgress';

// SwiftUI Safe Area Container
export const SwiftUISafeArea = React.memo(({ children, ...props }) => (
  <div className="swiftui-safe-area" {...props}>
    {children}
  </div>
));

SwiftUISafeArea.displayName = 'SwiftUISafeArea';
