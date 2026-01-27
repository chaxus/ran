/**
 * Design Tokens for ranui component library
 *
 * These tokens define the visual language of the design system.
 * They should be used consistently across all components.
 */

export const tokens = {
  // Color palette
  colors: {
    // Primary colors
    primary: {
      50: '#e6f4ff',
      100: '#bae0ff',
      200: '#91caff',
      300: '#69b1ff',
      400: '#4096ff',
      500: '#1890ff',
      600: '#0958d9',
      700: '#003eb3',
      800: '#002c8c',
      900: '#001d66',
    },
    // Success colors
    success: {
      50: '#f6ffed',
      100: '#d9f7be',
      200: '#b7eb8f',
      300: '#95de64',
      400: '#73d13d',
      500: '#52c41a',
      600: '#389e0d',
      700: '#237804',
      800: '#135200',
      900: '#092b00',
    },
    // Warning colors
    warning: {
      50: '#fffbe6',
      100: '#fff1b8',
      200: '#ffe58f',
      300: '#ffd666',
      400: '#ffc53d',
      500: '#faad14',
      600: '#d48806',
      700: '#ad6800',
      800: '#874d00',
      900: '#613400',
    },
    // Danger/Error colors
    danger: {
      50: '#fff1f0',
      100: '#ffccc7',
      200: '#ffa39e',
      300: '#ff7875',
      400: '#ff4d4f',
      500: '#f5222d',
      600: '#cf1322',
      700: '#a8071a',
      800: '#820014',
      900: '#5c0011',
    },
    // Neutral colors
    neutral: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e8e8e8',
      300: '#d9d9d9',
      400: '#bfbfbf',
      500: '#8c8c8c',
      600: '#595959',
      700: '#434343',
      800: '#262626',
      900: '#1f1f1f',
      950: '#141414',
    },
  },

  // Spacing scale
  spacing: {
    0: '0',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
  },

  // Border radius
  radius: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    '3xl': '24px',
    full: '9999px',
  },

  // Font sizes
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Shadows
  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    none: 'none',
  },

  // Animation durations
  duration: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Animation easings
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Ant Design easing
    antEase: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },

  // Z-index scale
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
} as const;

// Semantic tokens for light theme
export const lightTheme = {
  // Background colors
  bg: {
    base: tokens.colors.neutral[50],
    elevated: '#ffffff',
    muted: tokens.colors.neutral[100],
    subtle: tokens.colors.neutral[200],
  },
  // Text colors
  text: {
    primary: 'rgba(0, 0, 0, 0.88)',
    secondary: 'rgba(0, 0, 0, 0.65)',
    tertiary: 'rgba(0, 0, 0, 0.45)',
    disabled: 'rgba(0, 0, 0, 0.25)',
    inverse: '#ffffff',
  },
  // Border colors
  border: {
    base: tokens.colors.neutral[300],
    muted: tokens.colors.neutral[200],
    strong: tokens.colors.neutral[400],
  },
  // Semantic colors
  semantic: {
    primary: tokens.colors.primary[500],
    success: tokens.colors.success[500],
    warning: tokens.colors.warning[500],
    danger: tokens.colors.danger[500],
  },
} as const;

// Semantic tokens for dark theme
export const darkTheme = {
  bg: {
    base: tokens.colors.neutral[950],
    elevated: tokens.colors.neutral[900],
    muted: tokens.colors.neutral[800],
    subtle: tokens.colors.neutral[700],
  },
  text: {
    primary: 'rgba(255, 255, 255, 0.88)',
    secondary: 'rgba(255, 255, 255, 0.65)',
    tertiary: 'rgba(255, 255, 255, 0.45)',
    disabled: 'rgba(255, 255, 255, 0.25)',
    inverse: 'rgba(0, 0, 0, 0.88)',
  },
  border: {
    base: tokens.colors.neutral[600],
    muted: tokens.colors.neutral[700],
    strong: tokens.colors.neutral[500],
  },
  semantic: {
    primary: tokens.colors.primary[400],
    success: tokens.colors.success[400],
    warning: tokens.colors.warning[400],
    danger: tokens.colors.danger[400],
  },
} as const;

export type Theme = typeof lightTheme;
