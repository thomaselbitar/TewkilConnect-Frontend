export const LightTheme = {
  // Base colors
  background: '#FFFFFF',
  cardBackground: '#F9F9F9',
  textPrimary: '#000000',
  textSecondary: '#666666',
  border: '#d1d1d1',

  // Brand colors
  primary: '#007BFF',   // Blue
  success: '#28A745',   // Green
  error: '#DC3545',     // Red

  // Status colors
  warning: '#FFA500',   // Orange - for pending status
  info: '#007BFF',      // Blue - for in-progress status
  
  // UI element colors
  star: '#FFD700',      // Gold - for ratings
  heart: '#ff3040',     // Red - for likes/hearts
  social: '#0095f6',    // Instagram blue
  
  // Additional surface colors
  surfaceLight: '#F8F9FA',    // Light gray backgrounds
  surfaceMedium: '#f5f5f5',   // Medium gray backgrounds
  surfaceDark: '#e3f2fd',     // Light blue backgrounds
  disabled: '#d1d1d1',        // Disabled states
  
  // Text variations
  textTertiary: '#999999',    // Lighter text
  textDisabled: '#cccccc',    // Disabled text
};

export const DarkTheme = {
  // Base colors
  background: '#0D1B2A',      // Dark navy
  cardBackground: '#1B263B',  // Slightly lighter blue
  textPrimary: '#FFFFFF',
  textSecondary: '#B0BEC5',
  border: '#334155',

  // Brand colors (same as light)
  primary: '#007BFF',   // Blue
  success: '#28A745',   // Green
  error: '#DC3545',     // Red

  // Status colors
  warning: '#FFA500',   // Orange - for pending status
  info: '#007BFF',      // Blue - for in-progress status
  
  // UI element colors
  star: '#FFD700',      // Gold - for ratings
  heart: '#ff3040',     // Red - for likes/hearts
  social: '#0095f6',    // Instagram blue
  
  // Additional surface colors
  surfaceLight: '#2D3748',    // Darker gray for cards
  surfaceMedium: '#4A5568',   // Medium dark gray
  surfaceDark: '#1A202C',     // Very dark blue
  disabled: '#4A5568',        // Disabled states
  
  // Text variations
  textTertiary: '#718096',    // Lighter text
  textDisabled: '#A0AEC0',    // Disabled text
};

// Legacy support - keeping old GlobalStyles for backward compatibility
export const GlobalStyles = {
  colors: {
    primary1: LightTheme.textPrimary,
    primary2: LightTheme.background,
    primary3: LightTheme.primary,
    primary4: LightTheme.border,
    error: LightTheme.error,
  },
};