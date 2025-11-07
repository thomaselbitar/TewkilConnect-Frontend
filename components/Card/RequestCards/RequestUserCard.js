import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const RequestUserCard = ({
  title,
  category,
  status,
  request,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { theme } = useTheme();
  const { tRequests, tCategories } = useTranslation();
  const [showActions, setShowActions] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const getCategoryIcon = (cat) => {
    const iconMap = {
      'Web Development': 'laptop-outline',
      'Mobile Development': 'phone-portrait-outline',
      Design: 'brush-outline',
      Marketing: 'megaphone-outline',
      Content: 'document-text-outline',
      Consulting: 'people-outline',
      Other: 'ellipsis-horizontal-outline',
    };
    return iconMap[cat] || 'document-outline';
  };

  const getStatusColor = (s) => {
    const map = {
      Pending: theme.warning,
      'In Progress': theme.info,
      Finished: theme.success,
      Declined: '#DC3545',
    };
    return map[s] || theme.textSecondary;
  };

  const getStatusIcon = (s) => {
    const iconMap = {
      Pending: 'time-outline',
      'In Progress': 'play-circle-outline',
      Finished: 'checkmark-circle-outline',
      Declined: 'close-circle-outline',
    };
    return iconMap[s] || 'help-circle-outline';
  };

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

  const getStatusText = (status) => {
    const statusMap = {
      'Pending': tRequests('pending'),
      'In Progress': tRequests('inProgress'),
      'Finished': tRequests('finished'),
      'Declined': tRequests('declined'),
    };
    return statusMap[status] || status;
  };

  const handleLongPress = () => {
    if (status !== 'Pending') return;
    setShowActions(true);
    Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  };

  const hideActions = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setShowActions(false);
    });
  };

  const handleCardPress = () => {
    if (showActions) {
      hideActions();
    } else {
      onPress && onPress();
    }
  };

  const handleEdit = () => {
    hideActions();
    onEdit && onEdit();
  };

  const handleDelete = () => {
    hideActions();
    Alert.alert(tRequests('deleteRequest'), `${tRequests('deleteConfirmMessage')} "${title}"?`, [
      { text: tRequests('cancel'), style: 'cancel' },
      { text: tRequests('delete'), style: 'destructive', onPress: () => onDelete && onDelete() },
    ]);
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 8,
          position: 'relative',
        },
        card: {
          backgroundColor: theme.cardBackground,
          borderWidth: 1,
          borderColor: theme.border,
          borderRadius: 8,
          padding: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        actionOverlay: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          flexDirection: 'row',
          zIndex: 10,
        },
        overlayBackground: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        },
        actionButton: {
          justifyContent: 'center',
          alignItems: 'center',
          width: 70,
          height: '100%',
        },
        editButton: {
          backgroundColor: theme.warning,
        },
        deleteButton: {
          backgroundColor: theme.error,
        },
        actionText: {
          color: '#FFFFFF',
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        cardContent: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        categoryContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: theme.surfaceLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
        },
        contentContainer: {
          flex: 1,
          marginRight: 8,
        },
        title: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textPrimary,
          marginBottom: 4,
        },
        category: {
          fontSize: 14,
          color: theme.textSecondary,
          fontWeight: '500',
        },
        statusContainer: {
          alignItems: 'center',
          minWidth: 60,
        },
        status: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 2,
          textAlign: 'center',
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      {/* Main card */}
      <TouchableOpacity
        style={styles.card}
        onPress={handleCardPress}
        onLongPress={status === 'Pending' ? handleLongPress : null}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          {/* Category Icon */}
          <View style={styles.categoryContainer}>
            <Ionicons name={getCategoryIcon(category)} size={24} color={theme.primary} />
          </View>

          {/* Main Content */}
          <View style={styles.contentContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {getCategoryText(category)}
            </Text>
          </View>

          {/* Status */}
          <View style={styles.statusContainer}>
            <Ionicons name={getStatusIcon(status)} size={16} color={getStatusColor(status)} />
            <Text style={[styles.status, { color: getStatusColor(status) }]}>{getStatusText(status)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action overlay */}
      {showActions && (
        <Animated.View style={[styles.actionOverlay, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.overlayBackground} onPress={hideActions} activeOpacity={1} />
          <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEdit} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{tRequests('edit')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleDelete} activeOpacity={0.7}>
            <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
            <Text style={styles.actionText}>{tRequests('delete')}</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default RequestUserCard;
