// components/UI/SearchBar.js
import React, { useMemo } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const SearchBar = ({ placeholder, value, onChangeText, onSubmitEditing }) => {
  const { theme, isDarkMode } = useTheme();
  const { tUI } = useTranslation();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        searchContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.cardBackground,
          paddingHorizontal: 16,
          borderRadius: 12,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: theme.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        searchInput: {
          flex: 1,
          fontSize: 16,
          paddingVertical: 12,
          color: theme.textPrimary,
        },
        clearButton: {
          marginLeft: 8,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder={placeholder || tUI('search')}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        style={styles.searchInput}
        returnKeyType="search"
        placeholderTextColor={theme.textSecondary}
        selectionColor={theme.primary}
        {...(Platform.OS === 'ios' ? { keyboardAppearance: isDarkMode ? 'dark' : 'light' } : {})}
      />
      {value?.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
          <Ionicons name="close-circle" size={22} color={theme.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
