import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { wp, hp } from '../../utils/helpers';
import OfferMadeCard from '../../components/Card/Offers/OfferMadeCard';
import { userMadeOffersData } from '../../Data/OfferDataByUser';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const OffersMadeScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tOffersMade } = useTranslation();
  const [offersData, setOffersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSectionOpen, setActiveSectionOpen] = useState(true);
  const [acceptedSectionOpen, setAcceptedSectionOpen] = useState(true);
  const [declinedSectionOpen, setDeclinedSectionOpen] = useState(true);

  // Set up header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      title: tOffersMade('title'),
      headerTitleStyle: {
        fontWeight: 'bold',
        color: theme.textPrimary,
      },
      headerStyle: {
        backgroundColor: theme.background,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      },
    });
  }, [navigation, theme, tOffersMade]);

  useEffect(() => {
    loadOffersData();
  }, []);

  const loadOffersData = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffersData(userMadeOffersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading offers data:', error);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOffersData(userMadeOffersData);
    } catch (error) {
      console.error('Error refreshing offers data:', error);
    }
    setRefreshing(false);
  };

  const getOffersByStatus = (status) => {
    return offersData.filter(item => item.userOffer.status === status);
  };

  const renderOfferItem = ({ item }) => (
    <OfferMadeCard
      request={item.request}
      userOffer={item.userOffer}
    />
  );

  const renderSectionHeader = (title, count, color, isOpen, onToggle) => (
    <TouchableOpacity 
      style={[styles.sectionHeader, { backgroundColor: theme.surfaceLight, borderBottomColor: theme.border }]} 
      onPress={onToggle}
    >
      <View style={styles.sectionHeaderLeft}>
        <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
        {count > 0 && (
          <View style={[styles.countBadge, { backgroundColor: color }]}>
            <Text style={styles.countText}>{count}</Text>
          </View>
        )}
      </View>
      <Ionicons 
        name={isOpen ? "chevron-down" : "chevron-forward"} 
        size={20} 
        color={color} 
      />
    </TouchableOpacity>
  );

  const renderEmptyMessage = (message) => (
    <View style={styles.emptyMessage}>
      <Text style={[styles.emptyMessageText, { color: theme.textSecondary }]}>{message}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>{tOffersMade('loadingOffers')}</Text>
      </View>
    );
  }

  const activeOffers = getOffersByStatus('active');
  const acceptedOffers = getOffersByStatus('accepted');
  const declinedOffers = getOffersByStatus('declined');

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
      {/* Main Stats Dashboard */}
      <View style={[styles.statsSection, { backgroundColor: theme.cardBackground }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>{tOffersMade('totalOffersMade')}</Text>
          <Text style={[styles.totalNumber, { color: theme.primary }]}>{offersData.length}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: theme.border }]} />

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: theme.primary }]}>{activeOffers.length}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="time-outline" size={14} color={theme.primary} />
              <Text style={[styles.statusLabel, { color: theme.primary }]}>{tOffersMade('active')}</Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: theme.success }]}>{acceptedOffers.length}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="checkmark-circle-outline" size={14} color={theme.success} />
              <Text style={[styles.statusLabel, { color: theme.success }]}>{tOffersMade('accepted')}</Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: theme.error }]}>{declinedOffers.length}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="close-circle-outline" size={14} color={theme.error} />
              <Text style={[styles.statusLabel, { color: theme.error }]}>{tOffersMade('declined')}</Text>
            </View>
          </View>
        </View>
      </View>
      {/* Active Offers Section */}
      <View style={styles.section}>
        {renderSectionHeader(
          tOffersMade('active'), 
          activeOffers.length, 
          theme.primary, 
          activeSectionOpen, 
          () => setActiveSectionOpen(!activeSectionOpen)
        )}
        {activeSectionOpen && (
          activeOffers.length > 0 ? (
            <FlatList
              data={activeOffers}
              renderItem={renderOfferItem}
              keyExtractor={(item, index) => `active-${item.id}-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyMessage(tOffersMade('noActiveOffers'))
          )
        )}
      </View>

      {/* Accepted Offers Section */}
      <View style={styles.section}>
        {renderSectionHeader(
          tOffersMade('accepted'), 
          acceptedOffers.length, 
          theme.success, 
          acceptedSectionOpen, 
          () => setAcceptedSectionOpen(!acceptedSectionOpen)
        )}
        {acceptedSectionOpen && (
          acceptedOffers.length > 0 ? (
            <FlatList
              data={acceptedOffers}
              renderItem={renderOfferItem}
              keyExtractor={(item, index) => `accepted-${item.id}-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyMessage(tOffersMade('noAcceptedOffers'))
          )
        )}
      </View>

      {/* Declined Offers Section */}
      <View style={styles.section}>
        {renderSectionHeader(
          tOffersMade('declined'), 
          declinedOffers.length, 
          theme.error, 
          declinedSectionOpen, 
          () => setDeclinedSectionOpen(!declinedSectionOpen)
        )}
        {declinedSectionOpen && (
          declinedOffers.length > 0 ? (
            <FlatList
              data={declinedOffers}
              renderItem={renderOfferItem}
              keyExtractor={(item, index) => `declined-${item.id}-${index}`}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            renderEmptyMessage(tOffersMade('noDeclinedOffers'))
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
  statsSection: {
    marginVertical:20,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  totalNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    marginVertical: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
    marginLeft: 4,
    textAlign: 'center',
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
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
});

export default OffersMadeScreen;
