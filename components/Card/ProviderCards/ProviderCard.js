// components/Card/ProviderCard.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const ProviderCard = ({ provider, selectable = false, selected = false, onSelect }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tCategories } = useTranslation();

  const getCategoryText = (category) => {
    const categoryMap = {
      'Technician': tCategories('technician'),
      'Electrician': tCategories('electrician'),
      'Mechanic': tCategories('mechanic'),
      'IT Specialist': tCategories('itSpecialist'),
      'Hair Stylist': tCategories('hairStylist'),
      'Personal Trainer': tCategories('personalTrainer'),
      'Plumber': tCategories('plumber'),
      'Baby Sitter': tCategories('babySitter'),
      'Pet Groomer': tCategories('petGroomer'),
      'Mover': tCategories('mover'),
      'Gardener': tCategories('gardener'),
      'Nail Artist': tCategories('nailArtist'),
      'Spa Specialist': tCategories('spaSpecialist'),
      'Cleaner': tCategories('cleaner'),
      'AC Technician': tCategories('acTechnician'),
      'Makeup Artist': tCategories('makeupArtist'),
    };
    return categoryMap[category] || category;
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.floor(rating);
    const hasHalfStar = rating - roundedRating >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(<Ionicons key={i} name="star" size={18} color={theme.star} />);
      } else if (i === roundedRating + 1 && hasHalfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={18} color={theme.star} />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={18} color={theme.textDisabled} />);
      }
    }
    return stars;
  };

  const handlePress = () => {
    if (selectable) {
      onSelect && onSelect(provider);
    } else {
      navigation.navigate('ProviderProfile', { provider });
    }
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.cardBackground,
          padding: 12,
          marginVertical: 6,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: theme.border,
        },
        profilePic: {
          width: 60,
          height: 60,
          borderRadius: 30,
          marginRight: 12,
          borderWidth: 2,
          borderColor: theme.success, // green ring for providers
          backgroundColor: theme.surfaceLight,
        },
        name: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textPrimary,
        },
        role: {
          fontSize: 14,
          color: theme.primary,
          marginTop: 2,
        },
        info: {
          fontSize: 14,
          color: theme.textSecondary,
        },
        starsContainer: {
          flexDirection: 'row',
          marginTop: 4,
        },
        radioContainer: {
          marginLeft: 12,
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card} activeOpacity={0.8}>
      <Image source={{ uri: provider.profilePicture }} style={styles.profilePic} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{provider.name}</Text>
        <Text style={styles.role}>{getCategoryText(provider.category)}</Text>
        <Text style={styles.info}>{provider.location}</Text>
        <View style={styles.starsContainer}>{renderStars(provider.rating)}</View>
      </View>
      {selectable && (
        <View style={styles.radioContainer}>
          <Ionicons
            name={selected ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color={selected ? theme.primary : theme.textDisabled}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ProviderCard;
