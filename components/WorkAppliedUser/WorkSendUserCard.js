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
import { wp, hp } from '../../utils/helpers';

const WorkSendUserCard = ({ request }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tWorkCards } = useTranslation();

  const handleCardPress = () => {
    navigation.navigate('RequestDetails', { request });
  };

  const handleDecline = () => {
    Alert.alert(
      tWorkCards('alerts.declineRequestTitle'),
      tWorkCards('alerts.declineRequestMessage'),
      [
        { text: tWorkCards('alerts.cancel'), style: 'cancel' },
        { 
          text: tWorkCards('alerts.decline'), 
          style: 'destructive',
          onPress: () => {
            console.log('Request declined:', request.id);
            // TODO: Implement decline logic
          }
        }
      ]
    );
  };

  const handleAccept = () => {
    Alert.alert(
      tWorkCards('alerts.acceptRequestTitle'),
      tWorkCards('alerts.acceptRequestMessage'),
      [
        { text: tWorkCards('alerts.cancel'), style: 'cancel' },
        { 
          text: tWorkCards('alerts.accept'), 
          onPress: () => {
            console.log('Request accepted:', request.id);
            // TODO: Implement accept logic
          }
        }
      ]
    );
  };

  const handleChat = () => {
    console.log('Open chat for request:', request.id);
    // TODO: Navigate to chat screen
    // navigation.navigate('Chat', { request });
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
        actionButtonsSection: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          paddingHorizontal: wp(4),
          paddingVertical: hp(2),
          borderTopWidth: 1,
          borderTopColor: theme.border,
          backgroundColor: theme.surfaceLight,
          borderBottomLeftRadius: 12,
          borderBottomRightRadius: 12,
        },
        actionButtonsRow: {
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          flex: 1,
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
        chatIconColor: {
          color: theme.primary,
        },
      }),
    [theme]
  );

  return (
    <>
      {request.status === 'pending' ? (
        <View style={styles.container}>
          <View style={styles.card}>
            {/* Request Card */}
            <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
              <RequestCard request={request} disableNavigation={true} />
            </TouchableOpacity>

            {/* Action Buttons Section */}
            <View style={styles.actionButtonsSection}>
              <View style={styles.actionButtonsRow}>
                {/* Decline Button */}
                <TouchableOpacity 
                  style={styles.declineButton} 
                  onPress={handleDecline}
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>

                {/* Accept Button */}
                <TouchableOpacity 
                  style={styles.acceptButton} 
                  onPress={handleAccept}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>

                {/* Chat Button */}
                <TouchableOpacity 
                  style={styles.chatButton} 
                  onPress={handleChat}
                >
                  <Ionicons name="chatbubble-outline" size={20} style={styles.chatIconColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        /* For in-progress and finished requests, show only the RequestCard */
        <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
          <RequestCard request={request} disableNavigation={true} />
        </TouchableOpacity>
      )}
    </>
  );
};

export default WorkSendUserCard;
