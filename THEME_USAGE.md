# Theme System Usage Guide

## Overview
Your app now has a complete dark/light theme system with consistent colors throughout the application.

## How to Use

### 1. Access Theme in Components
```javascript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.textPrimary }}>Hello World</Text>
    </View>
  );
};
```

### 2. Available Theme Colors

#### Base Colors
- `theme.background` - Main background color
- `theme.cardBackground` - Card/surface background
- `theme.textPrimary` - Primary text color
- `theme.textSecondary` - Secondary text color
- `theme.border` - Border color

#### Brand Colors
- `theme.primary` - Main brand blue (#007BFF)
- `theme.success` - Success green (#28A745)
- `theme.error` - Error red (#DC3545)

#### Status Colors
- `theme.warning` - Warning orange (#FFA500)
- `theme.info` - Info blue (#007BFF)

#### UI Element Colors
- `theme.star` - Gold for ratings (#FFD700)
- `theme.heart` - Red for likes (#ff3040)
- `theme.social` - Instagram blue (#0095f6)

#### Surface Colors
- `theme.surfaceLight` - Light gray backgrounds
- `theme.surfaceMedium` - Medium gray backgrounds
- `theme.surfaceDark` - Dark blue backgrounds
- `theme.disabled` - Disabled states

#### Text Variations
- `theme.textTertiary` - Lighter text
- `theme.textDisabled` - Disabled text

### 3. Theme Toggle
Users can toggle between light and dark themes in the Profile Settings screen. The preference is automatically saved and restored on app restart.

### 4. Creating Themed Styles
```javascript
const MyComponent = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      borderColor: theme.border,
    },
    text: {
      color: theme.textPrimary,
    },
  });
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Themed content</Text>
    </View>
  );
};
```

## Theme Colors

### Light Theme
- Background: White (#FFFFFF)
- Card Background: Light Gray (#F9F9F9)
- Text: Black (#000000)
- Primary: Blue (#007BFF)

### Dark Theme
- Background: Dark Navy (#0D1B2A)
- Card Background: Darker Blue (#1B263B)
- Text: White (#FFFFFF)
- Primary: Blue (#007BFF) - Same as light theme

## Implementation Status
✅ Theme system implemented
✅ Profile Settings toggle added
✅ Home screen themed
✅ Bottom tabs themed
✅ Status bar responds to theme
✅ Theme preference persistence

## Next Steps
To fully theme your app, update remaining screens and components to use `theme` colors instead of hardcoded colors or `GlobalStyles.colors`.
