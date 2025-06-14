export const theme = {
  colors: {
    primary: {
      50: '#E8F7FF',
      100: '#D1EEFF',
      200: '#A3DDFF',
      300: '#75CBFF',
      400: '#4BBAFF',
      500: '#38B6FF',
      600: '#0098F7',
      700: '#0078C4',
      800: '#005A91',
      900: '#003B5F',
      950: '#002A45',
    },
    secondary: {
      50: '#F0F8FF',
      100: '#E0F0FE',
      200: '#BAE0FD',
      300: '#90CBFB',
      400: '#64B0F9',
      500: '#4299F6',
      600: '#1078EC',
      700: '#0E61C0',
      800: '#104E94',
      900: '#0F3F72',
      950: '#0A2746',
    },
    accent: {
      50: '#F5FAFF',
      100: '#EAF5FF',
      200: '#CEEAFF',
      300: '#9BD9FF',
      400: '#65C3FF',
      500: '#3AAEFF',
      600: '#0091FF',
      700: '#0077D6',
      800: '#0060AB',
      900: '#004F8A',
      950: '#00325A',
    },
    tertiary: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
      950: '#0B111E',
    },
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0A0A0A',
    },
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  fonts: {
    primary: `'Inter', sans-serif`,
    heading: `'Poppins', sans-serif`,
    mono: `'JetBrains Mono', monospace`,
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    blue: '0 4px 14px 0 rgba(56, 182, 255, 0.3)',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  transitions: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '750ms',
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    toast: 1600,
    tooltip: 1700,
  },
} as const;

export type Theme = typeof theme;
export default theme; 