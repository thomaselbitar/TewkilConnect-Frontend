import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ProviderCard from '../ProviderCards/ProviderCard';
import { wp, hp } from '../../../utils/helpers';
import { useTheme } from '../../../contexts/ThemeContext';
import { useTranslation } from '../../../hooks/useTranslation';

const OfferCardUser = ({ offer, request, onAccept, onDecline, isAccepted = false, isDeclined = false }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tOffers } = useTranslation();

  const formatBudget = (budget) => {
    if (!budget || !budget.hasBudget) return tOffers('noBudgetSpecified');
    if (budget.type === 'hourly') return `$${budget.hourlyRate}/hour (${tOffers('hourly')})`;
    if (budget.type === 'fixed') return `$${budget.amount} (${tOffers('fixed')})`;
    return tOffers('budgetNotSpecified');
  };

  const formatDate = (date) => {
    if (!date) return tOffers('dateNotSpecified');
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTime = (time) => {
    if (!time) return tOffers('timeNotSpecified');
    return new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const handleAccept = () => { if (onAccept) onAccept(offer); };
  const handleDecline = () => { if (onDecline) onDecline(offer); };

  const handleChat = () => {
    navigation.navigate('Message', { provider: offer.provider, request });
  };

  const getStatusColor = () => {
    if (isAccepted) return theme.success;
    if (isDeclined) return theme.error;
    return theme.primary;
  };

  const getStatusText = () => {
    if (isAccepted) return tOffers('accepted');
    if (isDeclined) return tOffers('declined');
    return tOffers('active');
  };

  const getStatusIcon = () => {
    if (isAccepted) return 'checkmark-circle';
    if (isDeclined) return 'close-circle';
    return 'time';
  };

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          backgroundColor: theme.cardBackground,
          borderRadius: 10,
          marginHorizontal: wp(4),
          marginVertical: hp(1),
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          borderWidth: 1,
          borderColor: theme.border,
          position: 'relative',
        },
        declinedContainer: {
          opacity: 0.7,
          borderColor: theme.error,
        },
        statusBadge: {
          position: 'absolute',
          top: wp(2),
          right: wp(2),
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: wp(2),
          paddingVertical: hp(0.5),
          borderRadius: 12,
          zIndex: 1,
        },
        statusText: {
          color: '#FFFFFF',
          fontSize: 10,
          fontWeight: '600',
          marginLeft: wp(1),
        },
        providerSection: {
          paddingHorizontal: wp(3),
          paddingTop: wp(3),
        },
        offerDetails: {
          paddingHorizontal: wp(4),
          paddingVertical: hp(2),
          borderTopWidth: 1,
          borderTopColor: theme.border,
        },
        offerTitle: {
          fontSize: 16,
          fontWeight: '600',
          color: theme.textPrimary,
          marginBottom: hp(1.5),
        },
        detailRow: {
          flexDirection: 'row',
          marginBottom: hp(1.5),
          alignItems: 'flex-start',
        },
        detailIcon: {
          width: 24,
          alignItems: 'center',
          marginRight: wp(2),
          marginTop: 2,
        },
        detailContent: { flex: 1 },
        detailLabel: {
          fontSize: 12,
          color: theme.textSecondary,
          marginBottom: hp(0.2),
          fontWeight: '500',
        },
        detailValue: {
          fontSize: 14,
          color: theme.textPrimary,
          fontWeight: '500',
          lineHeight: 20,
        },
        actionButtons: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: wp(4),
          paddingVertical: hp(2),
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.surfaceLight,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
        },
        declineButton: {
          backgroundColor: theme.error,
          width: wp(12),
          height: wp(12),
          borderRadius: wp(6),
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 3,
        },
        acceptButton: {
          backgroundColor: theme.success,
          width: wp(12),
          height: wp(12),
          borderRadius: wp(6),
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 3,
        },
        chatButton: {
          backgroundColor: theme.cardBackground,
          width: wp(12),
          height: wp(12),
          borderRadius: wp(6),
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: theme.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3.84,
          elevation: 3,
        },
        disabledButton: {
          opacity: 0.5,
          backgroundColor: theme.disabled,
        },
      }),
    [theme]
  );

  return (
    <View style={[styles.container, isDeclined && styles.declinedContainer]}>
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
        <Ionicons name={getStatusIcon()} size={16} color="#FFFFFF" />
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      {/* Provider Card */}
      <View style={styles.providerSection}>
        <ProviderCard provider={offer.provider} />
      </View>

      {/* Offer Details */}
      <View style={styles.offerDetails}>
        <Text style={styles.offerTitle}>{tOffers('offerDetails')}</Text>

        {/* Budget */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="pricetag-outline" size={16} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{tOffers('budget')}</Text>
            <Text style={styles.detailValue}>{formatBudget(offer.budget)}</Text>
          </View>
        </View>

        {/* Timing */}
        <View style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Ionicons name="time-outline" size={16} color={theme.primary} />
          </View>
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{tOffers('startDateAndTime')}</Text>
            <Text style={styles.detailValue}>
              {formatDate(offer.timing.date)} at {formatTime(offer.timing.time)}
            </Text>
          </View>
        </View>

        {/* Message */}
        {!!offer.message && (
          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.primary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>{tOffers('message')}</Text>
              <Text style={styles.detailValue}>{offer.message}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Decline */}
        <TouchableOpacity
          style={[styles.declineButton, (!onDecline || isAccepted) && styles.disabledButton]}
          onPress={handleDecline}
          disabled={!onDecline || isAccepted}
        >
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Accept */}
        <TouchableOpacity
          style={[styles.acceptButton, (!onAccept || isDeclined) && styles.disabledButton]}
          onPress={handleAccept}
          disabled={!onAccept || isDeclined}
        >
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Chat */}
        <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
          <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OfferCardUser;
