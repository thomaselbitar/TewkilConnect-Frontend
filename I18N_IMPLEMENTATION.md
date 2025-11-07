# Internationalization (i18n) Implementation Guide

## Overview
Your app now has complete internationalization support with English, French, and Arabic languages, including RTL (Right-to-Left) support for Arabic.

## 🌍 Supported Languages
- **English** 🇺🇸 (en) - Default
- **French** 🇫🇷 (fr) - Français  
- **Arabic** 🇱🇧 (ar) - العربية (with RTL support)

## 📁 File Structure
```
├── i18n/
│   └── index.js                 # i18n configuration
├── locales/
│   ├── en.json                  # English translations
│   ├── fr.json                  # French translations
│   └── ar.json                  # Arabic translations
├── contexts/
│   └── LanguageContext.js       # Language state management
├── hooks/
│   └── useTranslation.js        # Translation hook
└── utils/
    └── rtl.js                   # RTL utilities
```

## 🚀 How to Use

### 1. Basic Translation
```javascript
import { useTranslation } from '../hooks/useTranslation';

const MyComponent = () => {
  const { t, tCommon, tAuth, tHome, tSettings } = useTranslation();
  
  return (
    <Text>{t('auth.welcome')}</Text>
    <Text>{tCommon('cancel')}</Text>
    <Text>{tAuth('login')}</Text>
  );
};
```

### 2. Helper Functions
The `useTranslation` hook provides convenient helper functions:
- `tCommon(key)` - Common translations (cancel, save, etc.)
- `tAuth(key)` - Authentication related translations
- `tHome(key)` - Home screen translations
- `tSettings(key)` - Settings screen translations
- `tRequest(key)` - Request creation translations
- `tProfile(key)` - Profile related translations
- `tNavigation(key)` - Navigation translations
- `tLanguages(key)` - Language names

### 3. Language Switching
```javascript
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { changeLanguage, currentLanguage, languages } = useLanguage();
  
  const switchToArabic = () => {
    changeLanguage('ar'); // Automatically handles RTL
  };
};
```

### 4. RTL Support
```javascript
import { isRTL, getTextAlign, getFlexDirection } from '../utils/rtl';

const MyComponent = () => {
  const textAlign = getTextAlign(); // 'right' for Arabic, 'left' for others
  const flexDirection = getFlexDirection(); // 'row-reverse' for Arabic
  
  return (
    <Text style={{ textAlign }}>Arabic text</Text>
  );
};
```

## 🔧 Adding New Translations

### 1. Add to Translation Files
Update all three language files (`en.json`, `fr.json`, `ar.json`):

```json
{
  "newSection": {
    "newKey": "English text",
    "anotherKey": "More English text"
  }
}
```

### 2. Use in Components
```javascript
const { t } = useTranslation();
<Text>{t('newSection.newKey')}</Text>
```

### 3. Add Helper Function (Optional)
If you have many translations in a section, add a helper to `useTranslation.js`:
```javascript
tNewSection: (key) => t(`newSection.${key}`),
```

## 📱 Translated Screens
Currently translated screens:
- ✅ Login Screen
- ✅ Home Screen  
- ✅ Profile Settings Screen
- 🔄 More screens can be added following the same pattern

## 🎨 RTL Features
- Automatic text alignment for Arabic
- Flexible direction support
- Margin/padding utilities for RTL layouts
- Language switching with RTL updates

## 🔄 Language Persistence
- Language preference is saved to AsyncStorage
- Automatically restored on app restart
- RTL settings applied based on selected language

## 🛠️ Development Tips

### Adding New Screens
1. Import `useTranslation` hook
2. Use appropriate helper functions (`tAuth`, `tHome`, etc.)
3. Replace hardcoded strings with translation keys
4. Test in all three languages

### Testing Translations
1. Switch languages in Profile Settings
2. Verify text appears correctly
3. Check RTL layout for Arabic
4. Ensure all strings are translated

### Common Patterns
```javascript
// Good
<Text>{tAuth('welcome')}</Text>

// Avoid
<Text>Welcome</Text>
```

## 🚨 Important Notes
- Always use translation keys instead of hardcoded strings
- Test RTL layout when adding new UI components
- Keep translation files in sync across all languages
- Use semantic key names (e.g., 'welcome' not 'text1')

## 🔮 Future Enhancements
- Add more screens to translation
- Implement pluralization rules
- Add date/time formatting per locale
- Add number formatting per locale
- Implement dynamic language loading

