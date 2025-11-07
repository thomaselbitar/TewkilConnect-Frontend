import React, { useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp } from '../../utils/helpers';
import RequestCard from '../../components/Card/RequestCards/RequestCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

const OfferMadeDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { request, userOffer } = route.params;
  const { theme } = useTheme();
  const { tOfferMadeDetails } = useTranslation();

  // Set up header options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      title: tOfferMadeDetails('title'),
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
  }, [navigation, theme, tOfferMadeDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return theme.primary;
      case 'accepted': return theme.success;
      case 'declined': return theme.error;
      default: return theme.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return 'time-outline';
      case 'accepted': return 'checkmark-circle-outline';
      case 'declined': return 'close-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return tOfferMadeDetails('status.active');
      case 'accepted':
        return tOfferMadeDetails('status.accepted');
      case 'declined':
        return tOfferMadeDetails('status.declined');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatBudget = (budget) => {
    if (budget?.type === 'hourly') {
      return `$${budget.hourlyRate}/hour`;
    } else if (budget?.type === 'fixed') {
      return `$${budget.amount}`;
    }
    return 'Not specified';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleWithdrawOffer = () => {
    Alert.alert(
      tOfferMadeDetails('alerts.withdrawOffer'),
      tOfferMadeDetails('alerts.withdrawConfirm'),
      [
        { text: tOfferMadeDetails('alerts.cancel'), style: 'cancel' },
        { 
          text: tOfferMadeDetails('alerts.withdraw'), 
          style: 'destructive',
          onPress: () => {
            // TODO: Implement withdraw offer logic
            Alert.alert(tOfferMadeDetails('alerts.success'), tOfferMadeDetails('alerts.offerWithdrawn'));
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Request Card Section */}
      <View style={styles.requestSection}>
        <RequestCard request={request} disableNavigation={true} />
      </View>

      {/* Offer Details Section */}
      <View style={styles.offerSection}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tOfferMadeDetails('yourOffer')}</Text>
        
        {/* Offer Status */}
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(userOffer.status) + '20', borderColor: theme.border }]}>
          <Ionicons
            name={getStatusIcon(userOffer.status)}
            size={24}
            color={getStatusColor(userOffer.status)}
          />
          <Text style={[styles.statusText, { color: getStatusColor(userOffer.status) }]}>
            {getStatusText(userOffer.status)}
          </Text>
        </View>

        {/* Offer Submission Date */}
        <View style={[styles.detailCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.detailHeader}>
            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
            <Text style={[styles.detailTitle, { color: theme.primary }]}>{tOfferMadeDetails('submittedOn')}</Text>
          </View>
          <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{formatDate(userOffer.createdAt)}</Text>
        </View>

        {/* Offer Price */}
        <View style={[styles.detailCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.detailHeader}>
            <Ionicons name="pricetag-outline" size={20} color={theme.primary} />
            <Text style={[styles.detailTitle, { color: theme.primary }]}>{tOfferMadeDetails('yourPrice')}</Text>
          </View>
          <Text style={[styles.detailValue, { color: theme.textPrimary }]}>{formatBudget(userOffer.budget)}</Text>
        </View>

        {/* Offer Timing */}
        {userOffer.timing && (
          <View style={[styles.detailCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.detailHeader}>
              <Ionicons name="time-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailTitle, { color: theme.primary }]}>{tOfferMadeDetails('timing')}</Text>
            </View>
            <Text style={[styles.detailValue, { color: theme.textPrimary }]}>
              {userOffer.timing.date ? formatDate(userOffer.timing.date) : tOfferMadeDetails('flexibleTiming')}
            </Text>
          </View>
        )}

        {/* Offer Message */}
        {userOffer.message && (
          <View style={[styles.detailCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.detailHeader}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
              <Text style={[styles.detailTitle, { color: theme.primary }]}>{tOfferMadeDetails('yourMessage')}</Text>
            </View>
            <Text style={[styles.messageText, { color: theme.textPrimary }]}>"{userOffer.message}"</Text>
          </View>
        )}

        {/* Action Button - Only show for active offers */}
        {userOffer.status === 'active' && (
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[styles.withdrawButton, { borderColor: theme.error }]} 
              onPress={handleWithdrawOffer}
            >
              <Ionicons name="close-circle-outline" size={20} color={theme.error} />
              <Text style={[styles.withdrawButtonText, { color: theme.error }]}>{tOfferMadeDetails('withdrawOffer')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  requestSection: {
    marginBottom: 16,
    marginTop: 20,
  },
  offerSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  detailCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    opacity: 0.8,
  },
  actionContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: 'transparent',
    width: '100%',
  },
  withdrawButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default OfferMadeDetailsScreen;
