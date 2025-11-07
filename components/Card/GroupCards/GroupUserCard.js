import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../contexts/ThemeContext';

const GroupUserCard = ({ title, onPress, icon = 'document-outline', requestCount = 0 }) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.cardBackground,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          padding: 12,
          marginBottom: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        cardContent: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        },
        icon: {
          marginRight: 10,
        },
        title: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textPrimary,
          flex: 1,
        },
        countContainer: {
          backgroundColor: theme.primary, // badge bg
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
          minWidth: 24,
          alignItems: 'center',
        },
        countText: {
          fontSize: 12,
          fontWeight: 'bold',
          color: '#FFFFFF', // readable on primary in both themes
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardContent}>
        <Ionicons name={icon} size={20} color={theme.primary} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{requestCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupUserCard;
