import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const ReviewScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { tSettings, tCommon, tReview } = useTranslation();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const scrollViewRef = useRef(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: wp(5),
      paddingTop: hp(2),
      paddingBottom: hp(4),
    },
    header: {
      alignItems: 'center',
      marginBottom: hp(4),
    },
    title: {
      fontSize: wp(6),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: hp(1),
      textAlign: 'center',
    },
    subtitle: {
      fontSize: wp(4),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: wp(5),
    },
    ratingSection: {
      alignItems: 'center',
      marginBottom: hp(4),
    },
    ratingTitle: {
      fontSize: wp(5),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: hp(2),
    },
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: hp(2),
    },
    star: {
      marginHorizontal: wp(1),
    },
    ratingText: {
      fontSize: wp(4),
      color: theme.textSecondary,
      textAlign: 'center',
    },
    actionButtons: {
      marginTop: hp(3),
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: hp(1.5),
      paddingHorizontal: wp(6),
      borderRadius: wp(2),
      alignItems: 'center',
      marginBottom: hp(2),
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: wp(4.5),
      fontWeight: '600',
    },
    buttonDisabled: {
      backgroundColor: isDarkMode ? theme.disabled : '#e0e0e0',
      opacity: 0.7,
      borderWidth: 1,
      borderColor: isDarkMode ? theme.border : '#d0d0d0',
    },
    buttonTextDisabled: {
      color: isDarkMode ? theme.textDisabled : '#9e9e9e',
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    secondaryButtonText: {
      color: theme.primary,
    },
    infoSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(3),
      padding: wp(4),
      marginTop: hp(2),
      marginBottom:hp(10),
    },
    infoTitle: {
      fontSize: wp(4.5),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: hp(1.5),
    },
    infoText: {
      fontSize: wp(4),
      color: theme.textSecondary,
      lineHeight: wp(5.5),
      marginBottom: hp(1),
    },
    thankYouMessage: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(4),
      padding: wp(5),
      marginTop: hp(3),
      marginHorizontal: wp(2),
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      shadowColor: theme.textPrimary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    thankYouHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(1.5),
    },
    thankYouIcon: {
      marginRight: wp(3),
    },
    thankYouTitle: {
      fontSize: wp(4.5),
      fontWeight: '600',
      color: theme.textPrimary,
      flex: 1,
    },
    thankYouText: {
      fontSize: wp(4),
      color: theme.textSecondary,
      textAlign: 'left',
      lineHeight: wp(5.5),
      marginBottom: hp(1),
    },
    thankYouSubText: {
      fontSize: wp(3.5),
      color: theme.textTertiary,
      fontStyle: 'italic',
      textAlign: 'left',
    },
    feedbackSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(4),
      padding: wp(5),
      marginTop: hp(2),
      marginHorizontal: wp(2),
      borderLeftWidth: 4,
      borderLeftColor: theme.primary,
      shadowColor: theme.textPrimary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    feedbackTitle: {
      fontSize: wp(4.5),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: hp(1.5),
    },
    feedbackInput: {
      backgroundColor: theme.background,
      borderRadius: wp(3),
      borderWidth: 1,
      borderColor: theme.border,
      padding: wp(4),
      fontSize: wp(4),
      color: theme.textPrimary,
      textAlignVertical: 'top',
      minHeight: hp(12),
      maxHeight: hp(20),
      fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
      lineHeight: wp(5.5),
    },
    feedbackFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: hp(2),
    },
    characterCount: {
      fontSize: wp(3.5),
      color: theme.textTertiary,
      fontStyle: 'italic',
    },
    feedbackHint: {
      fontSize: wp(3.5),
      color: theme.warning,
      fontStyle: 'italic',
      textAlign: 'right',
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: tReview('title'),
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: {
        color: theme.textPrimary,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: wp(4) }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      gestureEnabled: false,
    });
  }, [navigation, theme, tReview]);

  const handleStarPress = (starRating) => {
    setRating(starRating);
  };

  const openAppStore = () => {
    const appStoreUrl = Platform.OS === 'ios' 
      ? 'https://apps.apple.com/app/id123456789' // Replace with actual App Store URL
      : 'https://play.google.com/store/apps/details?id=com.yourapp'; // Replace with actual Play Store URL
    
    Linking.openURL(appStoreUrl).catch(() => {
      Alert.alert(
        tCommon('error'),
        tReview('unableToOpenStore')
      );
    });
  };

  const handleRateApp = () => {
    if (rating === 0) {
      Alert.alert(
        tCommon('warning'),
        tReview('selectRatingFirst')
      );
      return;
    }

    if (rating >= 4) {
      // High rating - direct to app store
      openAppStore();
    } else {
      // Low rating - require feedback before submission
      if (feedback.trim().length === 0) {
        Alert.alert(
          tReview('feedbackRequired'),
          tReview('feedbackRequiredMessage')
        );
        return;
      }
      
      // Submit feedback
      handleSubmitFeedback();
    }
  };

  const handleSubmitFeedback = () => {
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', { rating, feedback });
    
    Alert.alert(
      tReview('feedbackSubmitted'),
      tReview('feedbackSubmittedMessage'),
      [
        {
          text: tCommon('ok'),
          onPress: () => {
            // Reset form and go back
            setRating(0);
            setFeedback('');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleFeedbackFocus = () => {
    // Scroll to the feedback section when focused
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starNumber = index + 1;
      return (
        <TouchableOpacity
          key={index}
          style={styles.star}
          onPress={() => handleStarPress(starNumber)}
        >
          <Ionicons
            name={starNumber <= rating ? 'star' : 'star-outline'}
            size={wp(8)}
            color={starNumber <= rating ? '#FFD700' : theme.textDisabled}
          />
        </TouchableOpacity>
      );
    });
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Tap a star to rate';
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView 
          ref={scrollViewRef}
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
        <View style={styles.header}>
          <Text style={styles.title}>{tReview('rateApp')}</Text>
          <Text style={styles.subtitle}>
            {tReview('rateDescription')}
          </Text>
        </View>

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>{tReview('rateApp')}</Text>
          <View style={styles.starsContainer}>
            {renderStars()}
          </View>
          <Text style={styles.ratingText}>{getRatingText()}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[
              styles.button,
              rating > 0 && rating < 4 && feedback.trim().length === 0 && styles.buttonDisabled
            ]} 
            onPress={handleRateApp}
            disabled={rating > 0 && rating < 4 && feedback.trim().length === 0}
          >
            <Text style={[
              styles.buttonText,
              rating > 0 && rating < 4 && feedback.trim().length === 0 && styles.buttonTextDisabled
            ]}>
              {rating >= 4 ? tReview('rateOnAppStore') : tReview('submitRating')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              {tReview('maybeLater')}
            </Text>
          </TouchableOpacity>
        </View>

        {rating > 0 && rating < 4 && (
          <View style={styles.thankYouMessage}>
            <View style={styles.thankYouHeader}>
              <Ionicons 
                name="heart-outline" 
                size={wp(6)} 
                color={theme.primary} 
                style={styles.thankYouIcon}
              />
              <Text style={styles.thankYouTitle}>
                {tReview('weValueYourFeedback')}
              </Text>
            </View>
            <Text style={styles.thankYouText}>
              {tReview('thankYouMessage')}
            </Text>
            <Text style={styles.thankYouSubText}>
              {tReview('feedbackHelpsUsImprove')}
            </Text>
          </View>
        )}

        {rating > 0 && rating < 4 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.feedbackTitle}>
              {tReview('shareYourFeedback')}
            </Text>
            <TextInput
              style={styles.feedbackInput}
              placeholder={tReview('feedbackPlaceholder')}
              placeholderTextColor={theme.textTertiary}
              value={feedback}
              onChangeText={setFeedback}
              onFocus={handleFeedbackFocus}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              selectionColor={theme.primary}
              keyboardAppearance={isDarkMode ? 'dark' : 'light'}
              autoCapitalize="sentences"
              autoCorrect={true}
              returnKeyType="default"
              blurOnSubmit={false}
              maxLength={500}
            />
            <View style={styles.feedbackFooter}>
              <Text style={styles.characterCount}>
                {feedback.length}/500
              </Text>
              <Text style={styles.feedbackHint}>
                {tReview('feedbackRequiredHint')}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>{tReview('whyRateApp')}</Text>
          <Text style={styles.infoText}>
            • {tReview('helpUsersDiscover')}
          </Text>
          <Text style={styles.infoText}>
            • {tReview('motivateTeam')}
          </Text>
          <Text style={styles.infoText}>
            • {tReview('shareExperienceCommunity')}
          </Text>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ReviewScreen;
