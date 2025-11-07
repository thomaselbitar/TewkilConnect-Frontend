import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Alert, Image, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../constants/Styles';
import ProviderCard from '../../components/Card/ProviderCards/ProviderCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

const UserRequestDetailsScreen = ({ route, navigation }) => {
  const { request, updatedRequest, isUpdated } = route.params;
  const { theme } = useTheme();
  const { tProviders, t } = useTranslation();
  const [currentRequest, setCurrentRequest] = useState(request);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Set up header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: {
        color: theme.textPrimary,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('OfferUserScreen', { 
          requestId: currentRequest.id,
          groupId: currentRequest.groupId 
        })} style={{ marginRight: 16 }}>
          <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>{t('requestDetailsView.offers')}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, currentRequest]);

  // Update the request data if it was edited
  useEffect(() => {
    if (isUpdated && updatedRequest) {
      setCurrentRequest(updatedRequest);
      // Remove the duplicate success alert - it's already shown in EditUserRequest
      // Alert.alert('Success', 'Request updated successfully!');
    }
  }, [isUpdated, updatedRequest]);

  // Load request data function
  const loadRequestData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }
      
      // Simulate API call or data processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Additional data processing if needed
      if (currentRequest) {
        // Validate and process request data
        if (!currentRequest.location) {
          currentRequest.location = {};
        }
        if (!currentRequest.providerSelection) {
          currentRequest.providerSelection = { type: 'all' };
        }
        if (!currentRequest.timing) {
          currentRequest.timing = { type: 'flexible' };
        }
        if (!currentRequest.budget) {
          currentRequest.budget = { hasBudget: false };
        }
      }
      
      setIsLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error loading request data:', error);
      setIsLoading(false);
      setRefreshing(false);
      Alert.alert('Error', 'Failed to load request details. Please try again.');
    }
  };

  // Enhanced loading effect
  useEffect(() => {
    loadRequestData();
  }, [currentRequest]);

  // Handle pull to refresh
  const onRefresh = () => {
    loadRequestData(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FFA500';
      case 'In Progress': return '#007BFF';
      case 'Finished': return '#28A745';
      case 'Declined': return '#DC3545';
      case 'Cancelled': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return 'time-outline';
      case 'In Progress': return 'play-circle-outline';
      case 'Finished': return 'checkmark-circle-outline';
      case 'Declined': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const handleEditRequest = () => {
    // Prepare the data in the format expected by EditUserRequest
    const editData = {
      category: currentRequest.category,
      location: {
        city: currentRequest.location.city,
        street: currentRequest.location.street,
        building: currentRequest.location.building,
        images: currentRequest.location.images || [],
      },
      providerSelection: {
        // Reset provider selection to "all" if request is declined
        type: currentRequest.status === 'Declined' ? 'all' : currentRequest.providerSelection.type,
        selectedProvider: currentRequest.status === 'Declined' ? null : currentRequest.providerSelection.selectedProvider,
      },
      title: currentRequest.title,
      description: currentRequest.description,
      timing: {
        type: currentRequest.timing.type,
        day: currentRequest.timing.day,
        timeSlot: currentRequest.timing.timeSlot,
      },
      budget: currentRequest.budget, // Include budget if needed
      groupId: currentRequest.groupId, // Include groupId for group message
    };

    // Change from replace to navigate
    navigation.replace('EditUserRequest', {
      initialData: editData,
      requestId: currentRequest.id, // Pass the request ID for updating
      originalStatus: currentRequest.status, // Pass the original status to determine if it's a resend
    });
  };

  const handleDeleteRequest = () => {
    Alert.alert(t('requestDetailsView.deleteRequest'), t('requestDetailsView.deleteConfirm'), [
      { text: t('common.no'), style: 'cancel' },
      { text: t('common.yes'), style: 'destructive', onPress: () => console.log('Request deleted') }
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBudget = (budget) => {
    if (budget.type === 'hourly') {
      return `$${budget.hourlyRate}${t('requestCard.budget.hourly')}`;
    } else if (budget.type === 'fixed') {
      return `$${budget.amount} ${t('requestCard.budget.fixed')}`;
    }
    return t('requestCard.budget.notSpecified');
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending':
      case 'pending':
        return t('requestCard.status.pending');
      case 'In Progress':
      case 'in_progress':
        return t('requestCard.status.inProgress');
      case 'Finished':
      case 'finished':
        return t('requestCard.status.finished');
      case 'Declined':
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

  const getStatusKey = (status) => {
    switch (status) {
      case 'Pending':
        return 'pending';
      case 'In Progress':
        return 'in_progress';
      case 'Finished':
        return 'finished';
      case 'pending':
        return 'pending';
      case 'in_progress':
        return 'in_progress';
      case 'finished':
        return 'finished';
      default:
        return status;
    }
  };



  const styles = createStyles(theme);

  // Enhanced loading screen
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{t('requestDetailsView.loadingRequestDetails')}</Text>
        <Text style={styles.loadingSubText}>{t('requestDetailsView.loadingSubText')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons name={getStatusIcon(currentRequest.status)} size={24} color={getStatusColor(currentRequest.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(currentRequest.status) }]}>
            {getStatusText(currentRequest.status)}
          </Text>
        </View>
        <Text style={styles.createdDate}>{t('requestDetailsView.createdOn')} {formatDate(currentRequest.createdAt)}</Text>
      </View>

      {/* Group Message */}
      {currentRequest.groupId && (
        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <Text style={styles.infoText}>{t('requestDetailsView.belongsToGroup')} {currentRequest.groupId}</Text>
        </View>
      )}

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>{currentRequest.title}</Text>
        <View style={styles.categoryContainer}>
          <Ionicons name="briefcase-outline" size={16} color={theme.primary} />
          <Text style={styles.categoryText}>{getCategoryText(currentRequest.category)}</Text>
        </View>
      </View>

      {/* Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('requestDetailsView.description')}</Text>
        <Text style={styles.description}>{currentRequest.description}</Text>
      </View>

      {/* Images Section */}
      {currentRequest.location.images && currentRequest.location.images.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('requestDetailsView.images')}</Text>
          <View style={styles.swipeImageContainer}>
            <FlatList
              data={currentRequest.location.images}
              horizontal
              pagingEnabled
              scrollEventThrottle={16}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.imageContainer}>
                  <Image source={{ uri: item }} style={styles.requestImage} />
                </View>
              )}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(event.nativeEvent.contentOffset.x / (width - 40));
                setCurrentImageIndex(index);
              }}
            />
            {/* Image Count Indicator */}
            {currentRequest.location.images.length > 1 && (
              <View style={styles.imageCountContainer}>
                <Text style={styles.imageCountText}>
                  {currentImageIndex + 1}/{currentRequest.location.images.length}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        {/* Location */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="location-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{t('requestDetailsView.location')}</Text>
          </View>
          <Text style={styles.detailValue}>{currentRequest.location.city}</Text>
          <Text style={styles.detailSubValue}>
            {currentRequest.location.street}, {currentRequest.location.building}
          </Text>
        </View>

        {/* Budget */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="pricetag-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{t('requestDetailsView.budget')}</Text>
          </View>
          <Text style={styles.detailValue}>{formatBudget(currentRequest.budget)}</Text>
          <Text style={styles.detailSubValue}>
            {currentRequest.budget.type === 'hourly' ? t('requestDetailsView.hourlyRate') : t('requestDetailsView.fixedPrice')}
          </Text>
        </View>

        {/* Timing */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="time-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{t('requestDetailsView.timing')}</Text>
          </View>
          <View style={styles.timingContainer}>
            {currentRequest.timing.type === 'urgent' ? (
              <>
                <Text style={[styles.detailValue, styles.urgentText]}>{t('requestDetailsView.urgent')}</Text>
                <Ionicons name="warning" size={30} color="#FFD700" style={styles.urgentIcon} />
              </>
            ) : (
              <Text style={styles.detailValue}>{t('requestDetailsView.flexible')}</Text>
            )}
          </View>
          {currentRequest.timing.day && (
            <Text style={styles.detailSubValue}>
              {currentRequest.timing.day} {currentRequest.timing.timeSlot}
            </Text>
          )}
        </View>

        {/* Provider Selection */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="person-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{tProviders('provider')}</Text>
          </View>
          <Text style={styles.detailValue}>
            {currentRequest.providerSelection.type === 'specific' ? tProviders('specificProvider') : tProviders('anyProvider')}
          </Text>
                     {currentRequest.providerSelection.selectedProvider && (
             <ProviderCard 
               provider={currentRequest.providerSelection.selectedProvider}
               selectable={false}
             />
           )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.editButton,
            (currentRequest.status !== 'Pending' && currentRequest.status !== 'Declined') && styles.disabledButton
          ]} 
          onPress={handleEditRequest}
          disabled={currentRequest.status !== 'Pending' && currentRequest.status !== 'Declined'}
        >
          <Ionicons 
            name="create-outline" 
            size={20} 
            color={(currentRequest.status === 'Pending' || currentRequest.status === 'Declined') ? theme.background : theme.textSecondary} 
          />
          <Text style={[
            styles.actionButtonText, 
            { color: (currentRequest.status === 'Pending' || currentRequest.status === 'Declined') ? theme.background : theme.textSecondary }
          ]}>
{t('requestDetailsView.editRequest')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.deleteButton,
            currentRequest.status === 'In Progress' && styles.disabledButton
          ]} 
          onPress={handleDeleteRequest}
          disabled={currentRequest.status === 'In Progress'}
        >
          <Ionicons 
            name="trash-outline" 
            size={20} 
            color={currentRequest.status === 'In Progress' ? theme.textSecondary : theme.error} 
          />
          <Text style={[
            styles.actionButtonText, 
            { color: currentRequest.status === 'In Progress' ? theme.textSecondary : theme.error }
          ]}>
{t('requestDetailsView.deleteRequest')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Status Message */}
      {currentRequest.status !== 'Pending' && (
        <View style={styles.statusMessageContainer}>
          <Ionicons name="information-circle-outline" size={16} color={theme.textSecondary} />
          <Text style={styles.statusMessageText}>
            {currentRequest.status === 'In Progress'
              ? t('requestDetailsView.statusMessageInProgress')
              : currentRequest.status === 'Finished'
              ? t('requestDetailsView.statusMessageCompleted')
              : currentRequest.status === 'Declined'
              ? t('requestDetailsView.statusMessageDeclined')
              : t('requestDetailsView.statusMessageCompleted')
            }
          </Text>
        </View>
      )}

      
    </ScrollView>
  );
};

export default UserRequestDetailsScreen;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  createdDate: {
    fontSize: 14,
    color: theme.textPrimary,
    fontWeight: '500',
  },
  titleSection: {
    padding: 20,
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    color: theme.primary,
    marginLeft: 6,
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: theme.textPrimary,
    lineHeight: 24,
  },
  detailsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  detailCard: {
    backgroundColor: theme.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: 2,
  },
  detailSubValue: {
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '500',
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  urgentText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  urgentIcon: {
    marginLeft: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    borderColor: theme.error,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: theme.cardBackground,
  },
  statusMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: theme.primary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statusMessageText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  swipeImageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.cardBackground,
  },
  imageContainer: {
    width: width - 40,
    height: width - 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requestImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageCountContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  imageCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingSubText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.7,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoText: {
    marginHorizontal: 8,
    fontSize: 13,
    color: theme.textSecondary,
  },
});
