import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import OfferCardUser from '../../components/Card/Offers/OfferCardUser';
import { wp, hp } from '../../utils/helpers';
import { userIndividualRequests, userGroupWorks } from '../../Data/UserData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const OfferUserScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tOfferUser } = useTranslation();
  const [offers, setOffers] = useState([]);
  const [acceptedOffer, setAcceptedOffer] = useState(null);
  const [declinedOffers, setDeclinedOffers] = useState([]);
  const [activeSectionOpen, setActiveSectionOpen] = useState(true);
  const [acceptedSectionOpen, setAcceptedSectionOpen] = useState(true);
  const [declinedSectionOpen, setDeclinedSectionOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { requestId, groupId } = route.params || {};

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: tOfferUser('title'),
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.textPrimary,
      },
      headerStyle: {
        backgroundColor: theme.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.textPrimary} 
          />
        </TouchableOpacity>
      ),
      gestureEnabled: false,
    });
  }, [navigation, theme, tOfferUser]);

  // Get offers for a specific request
  const getOffersForRequest = () => {
    let targetRequest = null;

    // First, check individual requests
    targetRequest = userIndividualRequests.find(request => request.id === requestId);
    
    // If not found in individual requests, check group requests
    if (!targetRequest && groupId) {
      const group = userGroupWorks.find(g => g.id === groupId);
      if (group) {
        targetRequest = group.requests.find(request => request.id === requestId);
        if (targetRequest) {
          targetRequest = {
            ...targetRequest,
            isGroupRequest: true,
            groupTitle: group.title
          };
        }
      }
    }

    // If still not found, check all group requests (fallback)
    if (!targetRequest) {
      userGroupWorks.forEach(group => {
        const request = group.requests.find(r => r.id === requestId);
        if (request) {
          targetRequest = {
            ...request,
            isGroupRequest: true,
            groupTitle: group.title
          };
        }
      });
    }

    if (!targetRequest) {
      return [];
    }

    // Return offers for this specific request
    if (targetRequest.offers && targetRequest.offers.length > 0) {
      return targetRequest.offers.map(offer => ({
        ...offer,
        request: targetRequest
      }));
    }

    return [];
  };

  // Load offers function
  const loadOffers = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      const initialOffers = getOffersForRequest();
      setOffers(initialOffers);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Initialize offers on component mount
  React.useEffect(() => {
    loadOffers();
  }, []);

  // Handle pull to refresh
  const onRefresh = () => {
    loadOffers(true);
  };

  const handleAcceptOffer = (offer) => {
    Alert.alert(
      tOfferUser('alerts.acceptOffer'),
      tOfferUser('alerts.acceptConfirm').replace('{providerName}', offer.provider.name),
      [
        { text: tOfferUser('alerts.cancel'), style: 'cancel' },
        { 
          text: tOfferUser('alerts.accept'), 
          style: 'default',
          onPress: () => {
            // Update the request status and assign provider
            updateRequestStatus(offer);
            
            // Set the accepted offer
            setAcceptedOffer(offer);
            
            // Move all other offers to declined
            const otherOffers = offers.filter(o => o.id !== offer.id);
            setDeclinedOffers(prev => [...prev, ...otherOffers]);
            
            // Clear active offers
            setOffers([]);
            
            Alert.alert(
              tOfferUser('alerts.offerAccepted'),
              tOfferUser('alerts.offerAcceptedSuccess').replace('{providerName}', offer.provider.name),
              [{ text: tOfferUser('alerts.ok') }]
            );
          }
        }
      ]
    );
  };

  // Function to update request status and assign provider
  const updateRequestStatus = (acceptedOffer) => {
    // Update individual requests
    const requestIndex = userIndividualRequests.findIndex(request => request.id === requestId);
    if (requestIndex !== -1) {
      userIndividualRequests[requestIndex].status = 'In Progress';
      userIndividualRequests[requestIndex].providerSelection = {
        type: 'specific',
        selectedProvider: acceptedOffer.provider
      };
      // Remove offers since request is now assigned
      userIndividualRequests[requestIndex].offers = [];
      return;
    }

    // Update group requests
    if (groupId) {
      const groupIndex = userGroupWorks.findIndex(group => group.id === groupId);
      if (groupIndex !== -1) {
        const requestIndex = userGroupWorks[groupIndex].requests.findIndex(request => request.id === requestId);
        if (requestIndex !== -1) {
          userGroupWorks[groupIndex].requests[requestIndex].status = 'In Progress';
          userGroupWorks[groupIndex].requests[requestIndex].providerSelection = {
            type: 'specific',
            selectedProvider: acceptedOffer.provider
          };
          // Remove offers since request is now assigned
          userGroupWorks[groupIndex].requests[requestIndex].offers = [];
          return;
        }
      }
    }

    // Fallback: search all group requests
    userGroupWorks.forEach(group => {
      const requestIndex = group.requests.findIndex(request => request.id === requestId);
      if (requestIndex !== -1) {
        group.requests[requestIndex].status = 'In Progress';
        group.requests[requestIndex].providerSelection = {
          type: 'specific',
          selectedProvider: acceptedOffer.provider
        };
        // Remove offers since request is now assigned
        group.requests[requestIndex].offers = [];
      }
    });
  };

  const handleDeclineOffer = (offer) => {
    Alert.alert(
      tOfferUser('alerts.declineOffer'),
      tOfferUser('alerts.declineConfirm').replace('{providerName}', offer.provider.name),
      [
        { text: tOfferUser('alerts.cancel'), style: 'cancel' },
        { 
          text: tOfferUser('alerts.decline'), 
          style: 'destructive',
          onPress: () => {
            // Remove from active offers
            setOffers(prevOffers => prevOffers.filter(o => o.id !== offer.id));
            
            // Add to declined offers
            setDeclinedOffers(prev => [...prev, offer]);
            
            Alert.alert(
              tOfferUser('alerts.offerDeclined'),
              tOfferUser('alerts.offerDeclinedSuccess').replace('{providerName}', offer.provider.name),
              [{ text: tOfferUser('alerts.ok') }]
            );
          }
        }
      ]
    );
  };

  const renderOffer = ({ item }) => (
    <OfferCardUser
      offer={item}
      request={item.request}
      onAccept={handleAcceptOffer}
      onDecline={handleDeclineOffer}
    />
  );

  const renderDeclinedOffer = ({ item }) => (
    <OfferCardUser
      offer={item}
      request={item.request}
      onAccept={null}
      onDecline={null}
      isDeclined={true}
    />
  );

  const renderAcceptedOffer = () => (
    <OfferCardUser
      offer={acceptedOffer}
      request={acceptedOffer.request}
      onAccept={null}
      onDecline={null}
      isAccepted={true}
    />
  );

  const renderSectionHeader = (title, count, color, isOpen, onToggle, showArrow = true) => (
    <TouchableOpacity 
      style={[styles.sectionHeader, { backgroundColor: theme.surfaceLight, borderBottomColor: theme.border }]} 
      onPress={onToggle}
      disabled={!showArrow}
    >
      <View style={styles.sectionHeaderLeft}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        {count > 0 && (
          <View style={[styles.countBadge, { backgroundColor: color }]}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
      {showArrow && (
        <Ionicons 
          name={isOpen ? "chevron-down" : "chevron-forward"} 
          size={20} 
          color={color} 
        />
      )}
    </TouchableOpacity>
  );

  const renderEmptyMessage = (message) => (
    <View style={styles.emptyMessage}>
      <Text style={[styles.emptyMessageText, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );

  // Show loading spinner
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>{tOfferUser('loadingOffers')}</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
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
      {/* Active Offers Section - Only show if no offer is accepted */}
      {!acceptedOffer && (
        <View style={styles.section}>
          {renderSectionHeader(
            tOfferUser('active'), 
            offers.length, 
            theme.primary, 
            activeSectionOpen, 
            () => setActiveSectionOpen(!activeSectionOpen)
          )}
          {activeSectionOpen && (
            offers.length > 0 ? (
              <FlatList
                data={offers}
                renderItem={renderOffer}
                keyExtractor={(item, index) => `active-${item.id}-${index}`}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            ) : (
              renderEmptyMessage(tOfferUser('noActiveOffers'))
            )
          )}
        </View>
      )}

      {/* Accepted Offer Section */}
      <View style={styles.section}>
        {renderSectionHeader(
          tOfferUser('accepted'), 
          acceptedOffer ? 1 : 0, 
          theme.success, 
          acceptedSectionOpen, 
          () => setAcceptedSectionOpen(!acceptedSectionOpen)
        )}
        {acceptedSectionOpen && (
          acceptedOffer ? (
            renderAcceptedOffer()
          ) : (
            renderEmptyMessage(tOfferUser('noOfferAccepted'))
          )
        )}
      </View>

      {/* Declined Offers Section */}
      <View style={styles.section}>
        {renderSectionHeader(
          tOfferUser('declined'), 
          declinedOffers.length, 
          theme.error, 
          declinedSectionOpen, 
          () => setDeclinedSectionOpen(!declinedSectionOpen)
        )}
        {declinedSectionOpen && (
          declinedOffers.length > 0 ? (
            <FlatList
              data={declinedOffers}
              renderItem={renderDeclinedOffer}
              keyExtractor={(item, index) => `declined-${item.id}-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              />
            ) : (
              renderEmptyMessage(tOfferUser('noOfferDeclined'))
            )
          )}
        </View>
      </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: hp(2),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    borderBottomWidth: 1,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  countBadge: {
    paddingHorizontal: wp(2),
    paddingVertical: hp(0.5),
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
    marginLeft: wp(2),
  },
  countText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: hp(1),
  },
  emptyMessage: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(3),
    alignItems: 'center',
  },
  emptyMessageText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp(2),
    fontSize: 16,
    fontWeight: '500',
  },
});

export default OfferUserScreen;
