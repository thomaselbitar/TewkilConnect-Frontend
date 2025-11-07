// components/CategoryItem.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const CategoryItem = ({ title, iconName, onPress }) => {
  const { theme } = useTheme();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        categoryItem: {
          alignItems: 'center',
          marginRight: 15,
        },
        iconCircle: {
          width: 60,
          height: 60,
          backgroundColor: `${theme.primary}90`, // theme-based background
          borderRadius: 30,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 6,
        },
        categoryText: {
          fontSize: 12,
          textAlign: 'center',
          color: theme.primary, // theme-based text color
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity style={styles.categoryItem} onPress={onPress}>
      <View style={styles.iconCircle}>
        <Ionicons name={iconName} size={28} color="white" />
      </View>
      <Text style={styles.categoryText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CategoryItem;
