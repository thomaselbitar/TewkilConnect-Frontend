import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const ResultSearch = ({ user, onPress }) => {
  const { theme } = useTheme();

  const borderColor = user.userType === 'provider' ? theme.success : theme.primary;

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={14} color={theme.star} />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color={theme.star} />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color={theme.star} />);
    }

    return stars;
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        userCard: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 16,
          paddingHorizontal: 20,
          backgroundColor: theme.cardBackground,
          borderRadius: 12,
          marginVertical: 6,
          borderWidth: 1,
          borderColor: theme.border,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        profileImageContainer: {
          width: 50,
          height: 50,
          borderRadius: 25,
          borderWidth: 2,
          overflow: 'hidden',
          marginRight: 16,
        },
        profileImage: {
          width: '100%',
          height: '100%',
        },
        profileImagePlaceholder: {
          width: '100%',
          height: '100%',
          borderRadius: 25,
          alignItems: 'center',
          justifyContent: 'center',
        },
        profileImageText: {
          color: '#FFFFFF',
          fontSize: 18,
          fontWeight: 'bold',
        },
        userInfo: {
          flex: 1,
        },
        username: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textPrimary,
          marginBottom: 6,
        },
        ratingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        ratingText: {
          fontSize: 12,
          color: theme.textSecondary,
          marginLeft: 6,
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity style={styles.userCard} onPress={() => onPress(user)}>
      <View style={[styles.profileImageContainer, { borderColor }]}>
        {user.profileImage ? (
          <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImagePlaceholder, { backgroundColor: borderColor }]}>
            <Text style={styles.profileImageText}>
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.username}>
          {user.firstName} {user.lastName}
        </Text>
        {user.rating != null && (
          <View style={styles.ratingContainer}>
            {renderStars(user.rating)}
            <Text style={styles.ratingText}>{user.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ResultSearch;
