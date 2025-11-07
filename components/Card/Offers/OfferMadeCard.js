import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../../../utils/helpers';
import RequestCard from '../RequestCards/RequestCard';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const OfferMadeCard = ({ request, userOffer }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tOffers, tCommon } = useTranslation();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return theme.primary;
      case 'accepted':
        return theme.success;
      case 'declined':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'time-outline';
      case 'accepted':
        return 'checkmark-circle-outline';
      case 'declined':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return tOffers('status.active');
      case 'accepted':
        return tOffers('status.accepted');
      case 'declined':
        return tOffers('status.declined');
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
    return tOffers('notSpecified');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCardPress = () => {
    navigation.navigate('RequestDetails', { request });
  };

  const handleWithdrawOffer = () => {
    Alert.alert(
      tOffers('withdrawOffer'),
      tOffers('withdrawConfirmMessage'),
      [
        { text: tCommon('cancel'), style: 'cancel' },
        {
          text: tOffers('withdraw'),
          style: 'destructive',
          onPress: () => {
            // TODO: Implement withdraw offer logic
            Alert.alert(tOffers('success'), tOffers('offerWithdrawnSuccessfully'));
          },
        },
      ],
    );
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          marginBottom: 16,
          marginHorizontal: 16,
        },
        card: {
          backgroundColor: theme.cardBackground,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 5,
          borderWidth: 1,
          borderColor: theme.border,
          overflow: 'hidden',
        },
        offerSection: {
          backgroundColor: theme.cardBackground,
          padding: 12,
          borderWidth: 0,
          borderColor: theme.border,
        },
        offerStatusTop: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 6,
          marginBottom: 8,
          borderWidth: 1,
          borderColor: theme.border,
        },
        offerStatusTextTop: {
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        },
        offerHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        offerIconContainer: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: theme.surfaceLight,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        },
        offerTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: theme.textPrimary,
          flex: 1,
        },
        offerDate: {
          fontSize: 11,
          color: theme.textSecondary,
        },
        offerDetails: {
          marginBottom: 8,
        },
        offerDetailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4,
        },
        offerDetailText: {
          fontSize: 13,
          color: theme.textPrimary,
          marginLeft: 6,
        },
        offerMessage: {
          fontSize: 13,
          color: theme.textPrimary,
          fontStyle: 'italic',
          marginBottom: 8,
          lineHeight: 16,
        },
        withdrawButtonContainer: {
          alignItems: 'flex-end',
          marginTop: 8,
        },
        withdrawButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          paddingHorizontal: 12,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: theme.error,
          backgroundColor: 'transparent',
        },
        withdrawButtonText: {
          color: theme.error,
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        },
      }),
    [theme],
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Request Card */}
        <RequestCard request={request} />

        {/* Your Offer Section */}
        <TouchableOpacity
          style={styles.offerSection}
          onPress={() => navigation.navigate('OfferMadeDetails', { request, userOffer })}
          activeOpacity={0.7}
        >
          {/* Offer Status at Top */}
          <View
            style={[
              styles.offerStatusTop,
              { backgroundColor: getStatusColor(userOffer.status) + '20' },
            ]}
          >
            <Ionicons
              name={getStatusIcon(userOffer.status)}
              size={16}
              color={getStatusColor(userOffer.status)}
            />
            <Text
              style={[
                styles.offerStatusTextTop,
                { color: getStatusColor(userOffer.status) },
              ]}
            >
              {getStatusText(userOffer.status)}
            </Text>
          </View>

          <View style={styles.offerHeader}>
            <View style={styles.offerIconContainer}>
              <Ionicons name="paper-plane" size={16} color={theme.primary} />
            </View>
            <Text style={styles.offerTitle}>{tOffers('yourOffer')}</Text>
            <Text style={styles.offerDate}>{tOffers('submitted')} {formatDate(userOffer.createdAt)}</Text>
          </View>

          <View style={styles.offerDetails}>
            <View style={styles.offerDetailRow}>
              <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
              <Text style={styles.offerDetailText}>
                {tOffers('yourPrice')}: {formatBudget(userOffer.budget)}
              </Text>
            </View>

            {userOffer.timing && (
              <View style={styles.offerDetailRow}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={styles.offerDetailText}>
                  {userOffer.timing.date ? formatDate(userOffer.timing.date) : tOffers('flexibleTiming')}
                </Text>
              </View>
            )}
          </View>

          {userOffer.message && (
            <Text style={styles.offerMessage} numberOfLines={2}>
              "{userOffer.message}"
            </Text>
          )}

          {/* Action Button - Only show for active offers */}
          {userOffer.status === 'active' && (
            <View style={styles.withdrawButtonContainer}>
              <TouchableOpacity style={styles.withdrawButton} onPress={handleWithdrawOffer}>
                <Ionicons name="close-circle-outline" size={16} color={theme.error} />
                <Text style={styles.withdrawButtonText}>{tOffers('withdrawOffer')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfferMadeCard;
