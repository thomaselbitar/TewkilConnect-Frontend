import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import { updateRTL } from '../utils/rtl';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en');
  const [isLoading, setIsLoading] = useState(true);

  // Available languages
  const languages = {
    en: { name: 'English', code: 'en', flag: '🇺🇸' },
    fr: { name: 'Français', code: 'fr', flag: '🇫🇷' },
    ar: { name: 'العربية', code: 'ar', flag: '🇱🇧' }
  };

  // Load language preference from storage on app start
  useEffect(() => {
    loadLanguagePreference();
  }, []);

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage !== null && languages[savedLanguage]) {
        setCurrentLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
        // Update RTL setting on app start
        updateRTL(savedLanguage);
      }
    } catch (error) {
      console.log('Error loading language preference:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = async (languageCode) => {
    try {
      if (languages[languageCode]) {
        setCurrentLanguage(languageCode);
        await i18n.changeLanguage(languageCode);
        await AsyncStorage.setItem('language', languageCode);
        // Update RTL setting
        updateRTL(languageCode);
      }
    } catch (error) {
      console.log('Error saving language preference:', error);
    }
  };

  const getCurrentLanguageInfo = () => {
    return languages[currentLanguage];
  };

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    getCurrentLanguageInfo,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
