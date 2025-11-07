import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  FlatList,
  Dimensions,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import ProviderCard from '../Card/ProviderCards/ProviderCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width: screenWidth } = Dimensions.get('window');

const Review = ({
  // Context props
  contextState,
  contextDispatch,
  // Navigation props
  onBack,
  onPublish,
  onCancel,
  onEdit,
  // UI props
  headerTitle,
  description,
  // Publishing props
  isPublishing = false,
  setIsPublishing,
  // Custom props
  showGroupInfo = false,
  groupId = null,
  hideProviderEdit = false,
}) => {
  const { theme } = useTheme();
  const { tReviewScreen } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePublish = async () => {
    if (isPublishing) return;

    Alert.alert(tReviewScreen('publishAlert.title'), tReviewScreen('publishAlert.message'), [
      { text: tReviewScreen('publishAlert.cancel'), style: 'cancel' },
      {
        text: tReviewScreen('publishAlert.publish'),
        onPress: async () => {
          if (setIsPublishing) setIsPublishing(true);
          try {
            if (onPublish) {
              await onPublish(contextState);
            }
          } catch (error) {
            Alert.alert('Error', tReviewScreen('errors.publishFailed'));
          } finally {
            if (setIsPublishing) setIsPublishing(false);
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleEdit = (screenName) => {
    if (onEdit) onEdit(screenName);
  };

  const formatTiming = () => {
    if (contextState.timing.type === 'urgent') return tReviewScreen('urgent');
    return `${contextState.timing.day} - ${contextState.timing.timeSlot}`;
  };

  const formatBudget = () => {
    if (contextState.budget.hasBudget) {
      if (contextState.budget.type === 'fixed') return `${tReviewScreen('fixedAmount')} $${contextState.budget.amount}`;
      if (contextState.budget.type === 'hourly') return `${tReviewScreen('hourlyRate')} $${contextState.budget.hourlyRate}/hour`;
      return `$${contextState.budget.amount}`;
    }
    return tReviewScreen('noBudgetSet');
    };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        /* ===== CONTAINERS ===== */
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        content: {
          flex: 1,
          padding: 20,
        },

        /* ===== HEADER ===== */
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          paddingTop: 60,
          paddingBottom: 10,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        leftHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        rightHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        },
        backButton: {
          padding: 5,
          width: 34,
        },
        headerButton: {
          paddingHorizontal: 8,
          paddingVertical: 8,
          minWidth: 50,
          alignItems: 'center',
        },
        headerTitle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.textPrimary,
        },
        textCancel: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.textSecondary,
        },
        textPublish: {
          fontSize: 16,
          fontWeight: 'bold',
          color: theme.primary,
        },

        /* ===== DESCRIPTION ===== */
        description: {
          fontSize: 16,
          color: theme.textSecondary,
          marginBottom: 30,
          textAlign: 'center',
        },

        /* ===== GROUP MESSAGE ===== */
        infoContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.surfaceDark,
          borderRadius: 8,
          padding: 10,
          marginBottom: 20,
        },
        infoText: {
          marginHorizontal: 8,
          fontSize: 13,
          color: theme.textSecondary,
        },

        /* ===== INFO SECTIONS ===== */
        infoRow: {
          marginBottom: 30,
          paddingHorizontal: 5,
        },
        infoHeader: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 12,
        },
        infoTitle: {
          fontSize: 24,
          fontWeight: 'bold',
          color: theme.primary,
          marginBottom: 4,
        },
        infoValue: {
          fontSize: 18,
          color: theme.textPrimary,
          lineHeight: 24,
          fontWeight: '500',
        },
        detailItem: {
          marginBottom: 20,
        },
        detailLabel: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textSecondary,
          marginBottom: 6,
          textTransform: 'uppercase',
          letterSpacing: 1,
        },
        detailValue: {
          fontSize: 16,
          color: theme.textPrimary,
          lineHeight: 22,
        },
        sectionSeparator: {
          height: 1,
          backgroundColor: theme.border,
          marginVertical: 20,
          marginHorizontal: 5,
        },

        /* ===== IMAGES ===== */
        imagesContainer: {
          position: 'relative',
          marginBottom: 25,
          borderRadius: 8,
          overflow: 'hidden',
          backgroundColor: theme.surfaceLight,
        },
        imageList: {
          height: screenWidth - 40,
        },
        imageItem: {
          width: screenWidth - 40,
          height: screenWidth - 40,
        },
        reviewImage: {
          width: '100%',
          height: '100%',
          resizeMode: 'cover',
        },
        imageIndicator: {
          position: 'absolute',
          top: 15,
          right: 15,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        },
        imageIndicatorText: {
          color: '#FFFFFF',
          fontSize: 12,
          fontWeight: 'bold',
        },
        editImagesButton: {
          position: 'absolute',
          bottom: 15,
          right: 15,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 20,
          width: 40,
          height: 40,
          justifyContent: 'center',
          alignItems: 'center',
        },

        /* ===== PUBLISH BUTTON ===== */
        publishButton: {
          backgroundColor: theme.primary,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 18,
          borderRadius: 12,
          marginTop: 30,
          marginBottom: 40,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        publishButtonText: {
          color: '#FFFFFF',
          fontSize: 16,
          fontWeight: 'bold',
          marginLeft: 8,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeader}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{headerTitle || tReviewScreen('title')}</Text>
        </View>

        <View style={styles.rightHeader}>
          {!isPublishing && (
            <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
              <Text style={styles.textCancel}>{tReviewScreen('cancel')}</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handlePublish}
            disabled={isPublishing}
            style={[styles.headerButton, { opacity: isPublishing ? 0.5 : 1 }]}
          >
            <Text
              style={[
                styles.textPublish,
                { color: isPublishing ? theme.textDisabled : theme.primary },
              ]}
            >
              {isPublishing ? tReviewScreen('publishing') : tReviewScreen('publish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Group Message */}
        {groupId && (
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
            <Text style={styles.infoText}>{tReviewScreen('groupWorkMessage')} {groupId}</Text>
          </View>
        )}

        <Text style={styles.description}>{description || tReviewScreen('description')}</Text>

        {/* Images */}
        {contextState.location.images && contextState.location.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <FlatList
              data={contextState.location.images}
              renderItem={({ item }) => (
                <View style={styles.imageItem}>
                  <Image source={{ uri: item }} style={styles.reviewImage} />
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / (screenWidth - 40)
                );
                setCurrentImageIndex(index);
              }}
              style={styles.imageList}
            />
            {contextState.location.images.length > 1 && (
              <View style={styles.imageIndicator}>
                <Text style={styles.imageIndicatorText}>
                  {currentImageIndex + 1}/{contextState.location.images.length}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.editImagesButton}
              onPress={() => handleEdit('LocationScreen')}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Category */}
        <View style={styles.infoRow}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>{tReviewScreen('category')}</Text>
            <TouchableOpacity onPress={() => handleEdit('CategorySelection')}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoValue}>{contextState.category}</Text>
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Request Details */}
        <View style={styles.infoRow}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>{tReviewScreen('requestDetails')}</Text>
            <TouchableOpacity onPress={() => handleEdit('RequestFormDetails')}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.title')}</Text>
            <Text style={styles.detailValue}>{contextState.title}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.description')}</Text>
            <Text style={styles.detailValue}>{contextState.description}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.timing')}</Text>
            <Text style={styles.detailValue}>{formatTiming()}</Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Location */}
        <View style={styles.infoRow}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>{tReviewScreen('location')}</Text>
            <TouchableOpacity onPress={() => handleEdit('LocationScreen')}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.city')}</Text>
            <Text style={styles.detailValue}>{contextState.location.city}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.street')}</Text>
            <Text style={styles.detailValue}>{contextState.location.street}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{tReviewScreen('labels.building')}</Text>
            <Text style={styles.detailValue}>{contextState.location.building}</Text>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Budget */}
        <View style={styles.infoRow}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>{tReviewScreen('budget')}</Text>
            <TouchableOpacity onPress={() => handleEdit('BudgetScreen')}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.infoValue}>{formatBudget()}</Text>
        </View>

        {/* Separator */}
        <View style={styles.sectionSeparator} />

        {/* Provider Selection */}
        <View style={styles.infoRow}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoTitle}>{tReviewScreen('providerSelection')}</Text>
            {!hideProviderEdit && (
              <TouchableOpacity onPress={() => handleEdit('ProviderSelectionScreen')}>
                <Ionicons name="create-outline" size={20} color={theme.primary} />
              </TouchableOpacity>
            )}
          </View>
          {contextState.providerSelection.type === 'all' ? (
            <Text style={styles.infoValue}>{tReviewScreen('allProviders')}</Text>
          ) : (
            <ProviderCard provider={contextState.providerSelection.selectedProvider} selectable={false} />
          )}
        </View>

        {/* Publish Button */}
        <TouchableOpacity
          style={[styles.publishButton, { opacity: isPublishing ? 0.5 : 1 }]}
          onPress={handlePublish}
          disabled={isPublishing}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
          <Text style={styles.publishButtonText}>
            {isPublishing ? tReviewScreen('publishing') : tReviewScreen('publishRequest')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Review;
