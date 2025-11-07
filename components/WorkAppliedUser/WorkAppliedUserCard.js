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
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';
import RequestCard from '../Card/RequestCards/RequestCard';

const WorkAppliedUserCard = ({ offer }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tWorkCards } = useTranslation();

  const inProgressColor = theme.primary;
  const finishedColor = '#28A745';

  const formatBudget = (budget) => {
    if (budget?.type === 'hourly') {
      return `$${budget.hourlyRate}/hour`;
    } else if (budget?.type === 'fixed') {
      return `$${budget.amount}`;
    }
    return tWorkCards('notSpecified');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleCardPress = () => {
    navigation.navigate('RequestDetails', { request: offer.request });
  };

  const handleOfferPress = () => {
    navigation.navigate('OfferMadeDetails', { request: offer.request, userOffer: offer.userOffer });
  };

  const handleTakeWork = () => {
    Alert.alert(
      tWorkCards('alerts.takeWorkTitle'),
      tWorkCards('alerts.takeWorkMessage'),
      [
        { text: tWorkCards('alerts.cancel'), style: 'cancel' },
        { 
          text: tWorkCards('alerts.startWork'), 
          onPress: () => {
            console.log('Work started!');
            // TODO: Update work status to 'in_progress'
          }
        }
      ]
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
        acceptedOfferSection: {
          backgroundColor: theme.cardBackground,
          padding: 12,
          borderRadius: 12,
          borderWidth: 0,
          borderColor: theme.border,
        },
        acceptedOfferHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 8,
        },
        acceptedOfferIconContainer: {
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#28A74520',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 8,
        },
        acceptedOfferTitle: {
          fontSize: 14,
          fontWeight: '600',
          color: theme.textPrimary,
          flex: 1,
        },
        acceptedOfferDate: {
          fontSize: 11,
          color: theme.textSecondary,
        },
        acceptedOfferDetails: {
          marginBottom: 8,
        },
        acceptedOfferDetailRow: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 4,
        },
        acceptedOfferDetailText: {
          fontSize: 13,
          color: theme.textPrimary,
          marginLeft: 6,
        },
        acceptedOfferMessage: {
          fontSize: 13,
          color: theme.textPrimary,
          fontStyle: 'italic',
          marginBottom: 8,
          lineHeight: 16,
        },
        takeWorkButton: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 6,
          borderWidth: 1,
          borderColor: finishedColor,
          backgroundColor: '#28A74520',
          alignSelf: 'flex-start',
        },
        takeWorkButtonText: {
          color: finishedColor,
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        },
        workStatusContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 6,
          paddingHorizontal: 10,
          borderRadius: 6,
          backgroundColor: theme.surfaceLight,
          alignSelf: 'flex-start',
        },
        workStatusText: {
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        },
      }),
    [theme]
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Request Card */}
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
          <RequestCard request={offer.request} disableNavigation={true} />
        </TouchableOpacity>

        {/* Accepted Offer Section */}
        <TouchableOpacity 
          style={styles.acceptedOfferSection}
          onPress={handleOfferPress}
          activeOpacity={0.7}
        >
          <View style={styles.acceptedOfferHeader}>
            <View style={styles.acceptedOfferIconContainer}>
              <Ionicons name="checkmark-circle" size={16} color={finishedColor} />
            </View>
            <Text style={styles.acceptedOfferTitle}>{tWorkCards('yourAcceptedOffer')}</Text>
            <Text style={styles.acceptedOfferDate}>{tWorkCards('accepted')} {formatDate(offer.userOffer.createdAt)}</Text>
          </View>

          <View style={styles.acceptedOfferDetails}>
            <View style={styles.acceptedOfferDetailRow}>
              <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
              <Text style={styles.acceptedOfferDetailText}>
                {tWorkCards('yourPrice')} {formatBudget(offer.userOffer.budget)}
              </Text>
            </View>
            
            {offer.userOffer.timing && (
              <View style={styles.acceptedOfferDetailRow}>
                <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
                <Text style={styles.acceptedOfferDetailText}>
                  {offer.userOffer.timing.date ? formatDate(offer.userOffer.timing.date) : tWorkCards('flexibleTiming')}
                </Text>
              </View>
            )}
          </View>

          {offer.userOffer.message && (
            <Text style={styles.acceptedOfferMessage} numberOfLines={2}>
              "{offer.userOffer.message}"
            </Text>
          )}

          {/* Take Work Button - Only show for pending accepted offers */}
          {offer.request.status === 'pending' && (
            <TouchableOpacity 
              style={styles.takeWorkButton} 
              onPress={handleTakeWork}
            >
              <Ionicons name="play-circle-outline" size={16} color={finishedColor} />
              <Text style={styles.takeWorkButtonText}>{tWorkCards('takeWork')}</Text>
            </TouchableOpacity>
          )}

          {/* Work Status - Show for in progress and finished work */}
          {(offer.request.status === 'in_progress' || offer.request.status === 'finished') && (
            <View style={styles.workStatusContainer}>
              <Ionicons 
                name={offer.request.status === 'in_progress' ? 'play-circle-outline' : 'checkmark-circle-outline'} 
                size={16} 
                color={offer.request.status === 'in_progress' ? inProgressColor : finishedColor} 
              />
              <Text
                style={[
                  styles.workStatusText,
                  { color: offer.request.status === 'in_progress' ? inProgressColor : finishedColor }
                ]}
              >
                {offer.request.status === 'in_progress' ? tWorkCards('workInProgress') : tWorkCards('workCompleted')}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WorkAppliedUserCard;
