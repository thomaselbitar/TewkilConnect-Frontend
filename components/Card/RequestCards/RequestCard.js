// components/Card/RequestCard.js
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

const RequestCard = ({ request, disableNavigation = false }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handlePress = () => {
    if (!disableNavigation) {
      navigation.navigate('RequestDetails', { request });
    }
  };

  const formatBudget = (budget) => {
    if (budget?.type === 'hourly') return `$${budget.hourlyRate}${t('requestCard.budget.hourly')}`;
    if (budget?.type === 'fixed') return `$${budget.amount} ${t('requestCard.budget.fixed')}`;
    return t('requestCard.budget.notSpecified');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return theme.warning;
      case 'in_progress':
        return theme.info;
      case 'finished':
        return theme.success;
      case 'declined':
        return '#DC3545';
      default:
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time-outline';
      case 'in_progress':
        return 'play-circle-outline';
      case 'finished':
        return 'checkmark-circle-outline';
      case 'declined':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('requestCard.status.pending');
      case 'in_progress':
        return t('requestCard.status.inProgress');
      case 'finished':
        return t('requestCard.status.finished');
      case 'declined':
        return t('requestCard.status.declined');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'Technician': t('categories.technician'),
      'Electrician': t('categories.electrician'),
      'Mechanic': t('categories.mechanic'),
      'IT Specialist': t('categories.itSpecialist'),
      'Hair Stylist': t('categories.hairStylist'),
      'Personal Trainer': t('categories.personalTrainer'),
      'Plumber': t('categories.plumber'),
      'Baby Sitter': t('categories.babySitter'),
      'Pet Groomer': t('categories.petGroomer'),
      'Mover': t('categories.mover'),
      'Gardener': t('categories.gardener'),
      'Nail Artist': t('categories.nailArtist'),
      'Spa Specialist': t('categories.spaSpecialist'),
      'Cleaner': t('categories.cleaner'),
      'AC Technician': t('categories.acTechnician'),
      'Makeup Artist': t('categories.makeupArtist'),
      'Other': t('categories.other'),
    };
    return categoryMap[category] || category;
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        card: {
          backgroundColor: theme.cardBackground,
          padding: 16,
          marginHorizontal: 16,
          marginVertical: 8,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
          borderWidth: 1,
          borderColor: theme.border,
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        },
        statusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        statusText: {
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        },
        categoryContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        categoryText: {
          fontSize: 12,
          color: theme.primary,
          marginLeft: 4,
          fontWeight: '500',
        },
        title: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textPrimary,
          marginBottom: 6,
          lineHeight: 20,
        },
        description: {
          fontSize: 14,
          color: theme.textSecondary,
          marginBottom: 12,
          lineHeight: 18,
        },
        imageContainer: {
          position: 'relative',
          marginBottom: 12,
        },
        image: {
          width: '100%',
          height: 120,
          borderRadius: 8,
        },
        imageCount: {
          position: 'absolute',
          top: 8,
          right: 8,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 12,
          paddingHorizontal: 6,
          paddingVertical: 2,
        },
        imageCountText: {
          color: 'white',
          fontSize: 10,
          fontWeight: '600',
        },
        detailsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        },
        detailItem: {
          flexDirection: 'row',
          alignItems: 'center',
          flex: 1,
        },
        detailText: {
          fontSize: 12,
          color: theme.textSecondary,
          marginLeft: 4,
          flex: 1,
        },
        bottomRow: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
        },
        timingContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        timingText: {
          fontSize: 12,
          color: theme.textSecondary,
          marginLeft: 4,
          fontWeight: '500',
        },
        urgentIcon: {
          marginLeft: 4,
        },
        groupIndicator: {
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        groupText: {
          fontSize: 11,
          color: theme.textSecondary,
          marginLeft: 4,
          fontStyle: 'italic',
        },
      }),
    [theme]
  );

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} disabled={disableNavigation}>
      {/* Header with Status and Category */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons name={getStatusIcon(request.status)} size={16} color={getStatusColor(request.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
            {getStatusText(request.status)}
          </Text>
        </View>
        <View style={styles.categoryContainer}>
          <Ionicons name="briefcase-outline" size={14} color={theme.primary} />
          <Text style={styles.categoryText}>{getCategoryText(request.category)}</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>
        {request.title}
      </Text>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {request.description}
      </Text>

      {/* Image Preview */}
      {request.location?.images && request.location.images.length > 0 && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: request.location.images[0] }} style={styles.image} resizeMode="cover" />
          {request.location.images.length > 1 && (
            <View style={styles.imageCount}>
              <Text style={styles.imageCountText}>+{request.location.images.length - 1}</Text>
            </View>
          )}
        </View>
      )}

      {/* Details Row */}
      <View style={styles.detailsRow}>
        {/* Location */}
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {request.location?.city || t('requestCard.location.notSpecified')}
          </Text>
        </View>

        {/* Budget */}
        <View style={styles.detailItem}>
          <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
          <Text style={styles.detailText}>{formatBudget(request.budget)}</Text>
        </View>
      </View>

      {/* Timing */}
      <View style={styles.bottomRow}>
        <View style={styles.timingContainer}>
          <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
          <Text style={styles.timingText}>
            {request.timing?.type === 'urgent' ? t('requestCard.timing.urgent') : t('requestCard.timing.flexible')}
          </Text>
          {request.timing?.type === 'urgent' && (
            <Ionicons name="warning" size={14} color={theme.star} style={styles.urgentIcon} />
          )}
        </View>
      </View>

      {/* Group Indicator */}
      {request.groupId && (
        <View style={styles.groupIndicator}>
          <Ionicons name="people-circle-outline" size={12} color={theme.textSecondary} />
          <Text style={styles.groupText}>{t('requestCard.groupWork')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default RequestCard;
