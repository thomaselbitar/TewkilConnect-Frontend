// Screens/RequestDetails/RequestDetailsScreen.js
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Alert, Image, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { GlobalStyles } from '../../constants/Styles';
import ProviderCard from '../../components/Card/ProviderCards/ProviderCard';
import { requests } from '../../Data/Data';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

const RequestDetailsScreen = ({ route }) => {
  const { request } = route.params;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRequest, setCurrentRequest] = useState(null);

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
    });
  }, [navigation, theme]);

  // Enhanced loading effect
  useEffect(() => {
    const loadRequestData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call or data processing
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // If no request is passed, use a sample from our filtered data
        if (!request) {
          // Get a random request from our filtered data
          const randomIndex = Math.floor(Math.random() * requests.length);
          setCurrentRequest(requests[randomIndex]);
        } else {
          // Use the passed request but ensure it has the required structure
          const processedRequest = {
            ...request,
            providerSelection: {
              type: 'all', // Force provider selection to be 'all'
              selectedProvider: null
            },
            location: request.location || {},
            timing: request.timing || { type: 'flexible' },
            budget: request.budget || { hasBudget: false, type: 'none' }
          };
          setCurrentRequest(processedRequest);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading request data:', error);
        setIsLoading(false);
        Alert.alert(t('requestDetailsView.error'), t('requestDetailsView.failedToLoadRequest'));
      }
    };

    loadRequestData();
  }, [request]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#FFA500';
      case 'in_progress': return '#007BFF';
      case 'finished': return '#28A745';
      case 'cancelled': return '#DC3545';
      case 'declined': return '#DC3545';
      default: return '#6C757D';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'time-outline';
      case 'in_progress': return 'play-circle-outline';
      case 'finished': return 'checkmark-circle-outline';
      case 'declined': return 'close-circle-outline';
      default: return 'help-circle-outline';
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
      return `$${budget.hourlyRate}/hour`;
    } else if (budget.type === 'fixed') {
      return `$${budget.amount}`;
    }
    return t('requestDetailsView.notSpecified');
  };

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.floor(rating); // Only full stars
    const hasHalfStar = rating - roundedRating >= 0.5; // Check if there is a half star
  
    for (let i = 1; i <= 5; i++) {
      if (i <= roundedRating) {
        stars.push(
          <Ionicons key={i} name="star" size={16} color="#FFD700" />
        );
      } else if (i === roundedRating + 1 && hasHalfStar) {
        stars.push(
          <Ionicons key={i} name="star-half" size={16} color="#FFD700" />
        );
      } else {
        stars.push(
          <Ionicons key={i} name="star-outline" size={16} color="#ccc" />
        );
      }
    }
    return stars;
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

  // If no current request, show error
  if (!currentRequest) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.error} />
        <Text style={styles.errorText}>{t('requestDetailsView.noRequestFound')}</Text>
        <Text style={styles.errorSubText}>{t('requestDetailsView.requestNotAvailable')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <Ionicons name={getStatusIcon(currentRequest.status)} size={24} color={getStatusColor(currentRequest.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(currentRequest.status) }]}>
            {getStatusText(currentRequest.status)}
          </Text>
        </View>
        <Text style={styles.createdDate}>{t('requestDetailsView.createdOn')} {formatDate(new Date())}</Text>
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
      {currentRequest.location?.images && currentRequest.location.images.length > 0 && (
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
          <Text style={styles.detailValue}>{currentRequest.location?.city || t('requestDetailsView.notSpecified')}</Text>
          <Text style={styles.detailSubValue}>
            {currentRequest.location?.street && currentRequest.location?.building 
              ? `${currentRequest.location.street}, ${currentRequest.location.building}`
              : t('requestDetailsView.addressNotSpecified')
            }
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
            {currentRequest.budget?.type === 'hourly' ? t('requestDetailsView.hourlyRate') : t('requestDetailsView.fixedPrice')}
          </Text>
        </View>

        {/* Timing */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="time-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{t('requestDetailsView.timing')}</Text>
          </View>
          <View style={styles.timingContainer}>
            {currentRequest.timing?.type === 'urgent' ? (
              <>
                <Text style={[styles.detailValue, styles.urgentText]}>{t('requestDetailsView.urgent')}</Text>
                <Ionicons name="warning" size={30} color="#FFD700" style={styles.urgentIcon} />
              </>
            ) : (
              <Text style={styles.detailValue}>{t('requestDetailsView.flexible')}</Text>
            )}
          </View>
          {currentRequest.timing?.day && (
            <Text style={styles.detailSubValue}>
              {currentRequest.timing.day} {currentRequest.timing.timeSlot}
            </Text>
          )}
        </View>

        {/* Provider Selection */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <Ionicons name="people-outline" size={20} color={theme.primary} />
            <Text style={styles.detailTitle}>{t('requestDetailsView.providerType')}</Text>
          </View>
          <Text style={styles.detailValue}>{t('requestDetailsView.allProviders')}</Text>
          <Text style={styles.detailSubValue}>{t('requestDetailsView.openToAnyProvider')}</Text>
        </View>
      </View>

      {/* Request Owner Section */}
      {currentRequest?.requestOwner && (
        <View style={styles.ownerSection}>
          <Text style={styles.sectionTitle}>{t('requestDetailsView.postedBy')}</Text>
          <View style={styles.ownerCard}>
            <View style={styles.ownerInfo}>
              <Image 
                source={{ uri: currentRequest.requestOwner.profilePicture }} 
                style={[
                  styles.ownerImage,
                  { 
                    borderColor: currentRequest.requestOwner.isProvider 
                      ? '#28A745'  // Green for providers
                      : theme.primary  // Theme primary for users
                  }
                ]}
              />
              <View style={styles.ownerDetails}>
                <Text style={styles.ownerName}>{currentRequest.requestOwner.name}</Text>
                {currentRequest.requestOwner.isProvider && (
                  <Text style={styles.ownerProviderCategory}>{currentRequest.requestOwner.providerCategory}</Text>
                )}
                <View style={styles.ownerRating}>
                  {renderStars(currentRequest.requestOwner.rating)}
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={() => navigation.navigate('Chat', { 
                userId: currentRequest.requestOwner.id,
                userName: currentRequest.requestOwner.name 
              })}
            >
              <Ionicons name="chatbubble-outline" size={18} color={theme.primary} />
              <Text style={styles.contactButtonText}>{t('requestDetailsView.contact')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Action Buttons - Only show for pending requests */}
      {(currentRequest?.status === 'pending') && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.applyButton} onPress={() => navigation.navigate('MakeOffer', { request: currentRequest })}>
            <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            <Text style={styles.applyButtonText}>
              {t('requestDetailsView.applyForRequest')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default RequestDetailsScreen;

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
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 15,
    borderWidth: 1,
    borderColor: theme.border,
  },
  infoText: {
    marginHorizontal: 8,
    fontSize: 14,
    color: theme.primary,
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  ownerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  ownerCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: theme.border,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ownerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  ownerDetails: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    marginBottom: 4,
  },
  ownerProviderCategory: {
    fontSize: 12,
    color: theme.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  ownerRating: {
    flexDirection: 'row',
    marginTop: 4,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.primary,
    backgroundColor: theme.background,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 6,
  },
  applyButton: {
    backgroundColor: theme.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: theme.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.textSecondary,
    fontWeight: '400',
    textAlign: 'center',
    opacity: 0.7,
  },
});
