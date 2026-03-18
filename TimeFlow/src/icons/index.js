/**
 * Icon System Central Export
 * Provides clean imports for all custom icons throughout the app
 */

// Growth/Nature icons
export { default as LeafIcon } from './growth/LeafIcon';
export { default as SproutIcon } from './growth/SproutIcon';
export { default as WaterIcon } from './growth/WaterIcon';
export { default as FlowerIcon } from './growth/FlowerIcon';
export { default as NutIcon } from './growth/NutIcon';
export { default as PlantIcon } from './growth/PlantIcon';
export { default as MoonIcon } from './growth/MoonIcon';
export { default as TreeIcon } from './growth/TreeIcon';
export { default as LeafFallIcon } from './growth/LeafFallIcon';
export { default as LeafDriftIcon } from './growth/LeafDriftIcon';

// Status/Action icons
export { default as CheckmarkIcon } from './status/CheckmarkIcon';
export { default as CloseIcon } from './status/CloseIcon';
export { default as StopwatchIcon } from './status/StopwatchIcon';
export { default as TimerIcon } from './status/TimerIcon';
export { default as ClockIcon } from './status/ClockIcon';
export { default as CalendarIcon } from './status/CalendarIcon';
export { default as HammerIcon } from './status/HammerIcon';
export { default as TargetIcon } from './status/TargetIcon';
export { default as RefreshIcon } from './status/RefreshIcon';
export { default as RepeatIcon } from './status/RepeatIcon';
export { default as InboxIcon } from './status/InboxIcon';

// Emotion/Mood icons
export { default as StarIcon } from './achievements/StarIcon';
export { default as HappyIcon } from './emotions/HappyIcon';
export { default as ContentIcon } from './emotions/ContentIcon';
export { default as NeutralIcon } from './emotions/NeutralIcon';
export { default as UneasyIcon } from './emotions/UneasyIcon';
export { default as WorriedIcon } from './emotions/WorriedIcon';
export { default as SadIcon } from './emotions/SadIcon';

// UI Control icons
export { default as PauseIcon } from './ui-controls/PauseIcon';
export { default as PlayIcon } from './ui-controls/PlayIcon';
export { default as SearchIcon } from './ui-controls/SearchIcon';
export { default as TrashIcon } from './ui-controls/TrashIcon';
export { default as WarningIcon } from './ui-controls/WarningIcon';
export { default as AlertIcon } from './ui-controls/AlertIcon';
export { default as DangerStatusIcon } from './ui-controls/DangerStatusIcon';
export { default as WarningStatusIcon } from './ui-controls/WarningStatusIcon';
export { default as BoltIcon } from './ui-controls/BoltIcon';
export { default as FireIcon } from './ui-controls/FireIcon';

// Category icons
export { default as ComputerIcon } from './categories/ComputerIcon';
export { default as TeamworkIcon } from './categories/TeamworkIcon';
export { default as CreativeIcon } from './categories/CreativeIcon';
export { default as EmailIcon } from './categories/EmailIcon';
export { default as AdminIcon } from './categories/AdminIcon';
export { default as HealthIcon } from './categories/HealthIcon';
export { default as LearningIcon } from './categories/LearningIcon';

// Achievement icons
export { default as TrophyIcon } from './achievements/TrophyIcon';
export { default as CelebrationIcon } from './achievements/CelebrationIcon';
export { default as SparkIcon } from './achievements/SparkIcon';

// Platform icons
export { default as PhoneIcon } from './platform/PhoneIcon';
export { default as AppleIcon } from './platform/AppleIcon';
export { default as DesktopIcon } from './platform/DesktopIcon';
export { default as AirplaneIcon } from './platform/AirplaneIcon';

// Misc icons
export { default as BulbIcon } from './misc/BulbIcon';
export { default as LiferingIcon } from './misc/LiferingIcon';
export { default as ChartIcon } from './misc/ChartIcon';
export { default as BellIcon } from './misc/BellIcon';
export { default as BellMutedIcon } from './misc/BellMutedIcon';
export { default as EyeIcon } from './misc/EyeIcon';
export { default as NoteIcon } from './misc/NoteIcon';

// Context and utilities
export { IconProvider, useIconContext } from './IconContext';
export {
  EMOJI_TO_ICON,
  ICON_CATEGORIES,
  ICON_SIZE_PRESETS,
  ICON_COLORS,
  ICON_VIEWBOX,
  CATEGORY_ICON_MAP,
} from './constants';

/**
 * Dynamic icon resolver for rendering icons by name
 * Useful for data-driven icon rendering
 *
 * @example
 * const IconComponent = getIcon('leaf');
 * <IconComponent size={24} />
 */
export const getIcon = async (iconName) => {
  const iconMap = {
    // Growth icons
    leaf: () => import('./growth/LeafIcon').then(m => m.default),
    sprout: () => import('./growth/SproutIcon').then(m => m.default),
    water: () => import('./growth/WaterIcon').then(m => m.default),
    flower: () => import('./growth/FlowerIcon').then(m => m.default),
    nut: () => import('./growth/NutIcon').then(m => m.default),
    plant: () => import('./growth/PlantIcon').then(m => m.default),
    moon: () => import('./growth/MoonIcon').then(m => m.default),
    tree: () => import('./growth/TreeIcon').then(m => m.default),
    leafFall: () => import('./growth/LeafFallIcon').then(m => m.default),
    leafDrift: () => import('./growth/LeafDriftIcon').then(m => m.default),

    // Status icons
    checkmark: () => import('./status/CheckmarkIcon').then(m => m.default),
    close: () => import('./status/CloseIcon').then(m => m.default),
    stopwatch: () => import('./status/StopwatchIcon').then(m => m.default),
    timer: () => import('./status/TimerIcon').then(m => m.default),
    clock: () => import('./status/ClockIcon').then(m => m.default),
    calendar: () => import('./status/CalendarIcon').then(m => m.default),
    hammer: () => import('./status/HammerIcon').then(m => m.default),
    target: () => import('./status/TargetIcon').then(m => m.default),
    refresh: () => import('./status/RefreshIcon').then(m => m.default),
    repeat: () => import('./status/RepeatIcon').then(m => m.default),
    inbox: () => import('./status/InboxIcon').then(m => m.default),

    // Emotion icons
    star: () => import('./achievements/StarIcon').then(m => m.default),
    happy: () => import('./emotions/HappyIcon').then(m => m.default),
    content: () => import('./emotions/ContentIcon').then(m => m.default),
    neutral: () => import('./emotions/NeutralIcon').then(m => m.default),
    uneasy: () => import('./emotions/UneasyIcon').then(m => m.default),
    worried: () => import('./emotions/WorriedIcon').then(m => m.default),
    sad: () => import('./emotions/SadIcon').then(m => m.default),

    // UI icons
    pause: () => import('./ui-controls/PauseIcon').then(m => m.default),
    play: () => import('./ui-controls/PlayIcon').then(m => m.default),
    search: () => import('./ui-controls/SearchIcon').then(m => m.default),
    trash: () => import('./ui-controls/TrashIcon').then(m => m.default),
    warning: () => import('./ui-controls/WarningIcon').then(m => m.default),
    alert: () => import('./ui-controls/AlertIcon').then(m => m.default),
    dangerStatus: () => import('./ui-controls/DangerStatusIcon').then(m => m.default),
    warningStatus: () => import('./ui-controls/WarningStatusIcon').then(m => m.default),
    bolt: () => import('./ui-controls/BoltIcon').then(m => m.default),
    fire: () => import('./ui-controls/FireIcon').then(m => m.default),

    // Category icons
    computer: () => import('./categories/ComputerIcon').then(m => m.default),
    teamwork: () => import('./categories/TeamworkIcon').then(m => m.default),
    creative: () => import('./categories/CreativeIcon').then(m => m.default),
    email: () => import('./categories/EmailIcon').then(m => m.default),
    admin: () => import('./categories/AdminIcon').then(m => m.default),
    health: () => import('./categories/HealthIcon').then(m => m.default),
    learning: () => import('./categories/LearningIcon').then(m => m.default),

    // Achievement icons
    trophy: () => import('./achievements/TrophyIcon').then(m => m.default),
    celebration: () => import('./achievements/CelebrationIcon').then(m => m.default),
    spark: () => import('./achievements/SparkIcon').then(m => m.default),

    // Platform icons
    phone: () => import('./platform/PhoneIcon').then(m => m.default),
    apple: () => import('./platform/AppleIcon').then(m => m.default),
    desktop: () => import('./platform/DesktopIcon').then(m => m.default),
    airplane: () => import('./platform/AirplaneIcon').then(m => m.default),

    // Misc icons
    bulb: () => import('./misc/BulbIcon').then(m => m.default),
    lifering: () => import('./misc/LiferingIcon').then(m => m.default),
    chart: () => import('./misc/ChartIcon').then(m => m.default),
    bell: () => import('./misc/BellIcon').then(m => m.default),
    bellMuted: () => import('./misc/BellMutedIcon').then(m => m.default),
    eye: () => import('./misc/EyeIcon').then(m => m.default),
  };

  const loader = iconMap[iconName];
  return loader ? await loader() : null;
};
