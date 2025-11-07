import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const ProfileSettingsScreen = ({ route }) => {
  const navigation = useNavigation();
  const routeData = useRoute();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, languages, changeLanguage, getCurrentLanguageInfo } = useLanguage();
  const { tSettings, tCommon } = useTranslation();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    contentContainer: {
      flexGrow: 1,
      paddingHorizontal: wp(5),
      paddingTop: Platform.OS === 'android' ? hp(2) : 0,
      paddingBottom: hp(3),
    },
    sectionContainer: {
      marginBottom: hp(3),
    },
    sectionTitle: {
      fontSize: wp(4.5),
      fontWeight: '600',
      marginBottom: hp(1),
      marginLeft: wp(1),
    },
    optionsContainer: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(2.5),
      overflow: 'hidden',
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: hp(2.5),
      paddingHorizontal: wp(4),
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.cardBackground,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    textContainer: {
      flex: 1,
      marginLeft: wp(2),
    },
    disabledOption: {
      opacity: 0.6,
    },
    providerStatus: {
      backgroundColor: theme.surfaceLight,
    },
    optionText: {
      fontSize: wp(4.2),
      color: theme.textPrimary,
      fontWeight: '500',
    },
    disabledText: {
      color: theme.textDisabled,
    },
    disabledSubtext: {
      fontSize: wp(3.2),
      color: theme.textDisabled,
      marginTop: hp(0.5),
    },
    providerSubtext: {
      fontSize: wp(3.2),
      color: theme.success,
      marginTop: hp(0.5),
    },
    icon: {
      marginRight: wp(2),
    },
    logoutContainer: {
      marginTop: 'auto',
      paddingTop: hp(3),
    },
    logout: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(2.5),
      paddingHorizontal: wp(4),
      backgroundColor: theme.cardBackground,
      borderRadius: wp(2.5),
      borderWidth: 1,
      borderColor: theme.error,
    },
    logoutText: {
      fontSize: wp(4.2),
      color: theme.error,
      fontWeight: '500',
    },
  });

  // Get user data from route params or use default
  const user = route?.params?.user || routeData?.params?.user || {
    userType: 'user',
    profileCompleted: false,
    firstName: 'Tommy',
    lastName: 'Bitar',
    email: '',
    profileImage: null,
    bio: '',
    categories: [],
    skills: [],
    links: [],
    phoneNumber: '+961 70 123 456',
  };

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
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginLeft: wp(4) }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
      gestureEnabled: false,
    });
  }, [navigation, theme]);

  const handleBecomeProvider = () => {
    navigation.navigate('BecomeProvider', { 
      user: user
    });
  };

  const handleEditInfo = () => {
    navigation.navigate('EditProfile', { user: user });
  };

  const handleLogout = () => {
    Alert.alert(
      tSettings('confirmLogout'),
      tSettings('logoutMessage'),
      [
        {
          text: tCommon('cancel'),
          style: 'cancel',
        },
        {
          text: tCommon('ok'),
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleLanguageChange = () => {
    const languageOptions = Object.values(languages).map(lang => ({
      text: `${lang.flag} ${lang.name}`,
      onPress: () => changeLanguage(lang.code),
    }));

    Alert.alert(
      tSettings('language'),
      'Choose your preferred language',
      [
        ...languageOptions,
        {
          text: tCommon('cancel'),
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };


  const isProfileCompleted = user.profileCompleted || (user.email && user.email.trim() !== '');

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {/* User Settings Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary, marginTop: hp(1.5) }]}>
          {tSettings('accountSettings')}
        </Text>
        <View style={styles.optionsContainer}>
          {/* Become Provider / Provider Status */}
          {user.userType !== 'provider' ? (
            <TouchableOpacity 
              style={[styles.option, !isProfileCompleted && styles.disabledOption]} 
              onPress={handleBecomeProvider}
              disabled={!isProfileCompleted}
            >
              <View style={styles.optionContent}>
                <Ionicons 
                  name="briefcase-outline" 
                  size={wp(5.5)} 
                  color={isProfileCompleted ? theme.textPrimary : theme.textDisabled} 
                  style={styles.icon} 
                />
                <View style={styles.textContainer}>
                  <Text style={[styles.optionText, !isProfileCompleted && styles.disabledText]}>
                    {tSettings('becomeProvider')}
                  </Text>
                  {!isProfileCompleted && (
                    <Text style={styles.disabledSubtext}>{tSettings('completeProfileFirst')}</Text>
                  )}
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={wp(5)} 
                color={theme.textDisabled} 
              />
            </TouchableOpacity>
          ) : (
            <View style={[styles.option, styles.providerStatus]}>
              <View style={styles.optionContent}>
                <Ionicons name="checkmark-circle" size={wp(5.5)} color={theme.success} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={styles.optionText}>{tSettings('youAreProvider')}</Text>
                  <Text style={styles.providerSubtext}>{tSettings('activeProvider')}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Edit Information */}
          <TouchableOpacity 
            style={[styles.option, !isProfileCompleted && styles.disabledOption]} 
            onPress={handleEditInfo}
            disabled={!isProfileCompleted}
          >
            <View style={styles.optionContent}>
              <Ionicons 
                name="create-outline" 
                size={wp(5.5)} 
                color={isProfileCompleted ? theme.textPrimary : theme.textDisabled} 
                style={styles.icon} 
              />
              <View style={styles.textContainer}>
                <Text style={[styles.optionText, !isProfileCompleted && styles.disabledText]}>
                  {tSettings('editInformation')}
                </Text>
                {!isProfileCompleted && (
                  <Text style={styles.disabledSubtext}>{tSettings('completeProfileFirst')}</Text>
                )}
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={wp(5)} 
              color={theme.textDisabled} 
            />
          </TouchableOpacity>

          {/* Provider Reviews - Only show for providers */}
          {user.userType === 'provider' && (
            <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('ProviderReviews')}>
              <View style={styles.optionContent}>
                <Ionicons name="star-half-outline" size={wp(5.5)} color={theme.textPrimary} style={styles.icon} />
                <View style={styles.textContainer}>
                  <Text style={[styles.optionText, { color: theme.textPrimary }]}>{tSettings('providerReviews')}</Text>
                  <Text style={[styles.disabledSubtext, { color: theme.textSecondary }]}>
                    {tSettings('providerReviewsSubtitle')}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={wp(5)} 
                color={theme.textDisabled} 
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* App Settings Section */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          {tSettings('appSettings')}
        </Text>
        <View style={styles.optionsContainer}>
          {/* Dark Mode Toggle */}
          <View style={styles.option}>
            <View style={styles.optionContent}>
              <Ionicons name="moon-outline" size={wp(5.5)} color={theme.textPrimary} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>{tSettings('darkMode')}</Text>
              </View>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkMode ? theme.background : theme.background}
            />
          </View>

          {/* Language Selection */}
          <TouchableOpacity style={styles.option} onPress={handleLanguageChange}>
            <View style={styles.optionContent}>
              <Ionicons name="language-outline" size={wp(5.5)} color={theme.textPrimary} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>{tSettings('language')}</Text>
                <Text style={[styles.disabledSubtext, { color: theme.textSecondary }]}>
                  {getCurrentLanguageInfo().flag} {getCurrentLanguageInfo().name}
                </Text>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={wp(5)} 
              color={theme.textDisabled} 
            />
          </TouchableOpacity>

          {/* Review App */}
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Review')}>
            <View style={styles.optionContent}>
              <Ionicons name="star-outline" size={wp(5.5)} color={theme.textPrimary} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>Tewkil Connect</Text>
                <Text style={[styles.disabledSubtext, { color: theme.textSecondary }]}>
                  {tSettings('reviewSubtitle')}
                </Text>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={wp(5)} 
              color={theme.textDisabled} 
            />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('AboutUs')}>
            <View style={styles.optionContent}>
              <Ionicons name="information-circle-outline" size={wp(5.5)} color={theme.textPrimary} style={styles.icon} />
              <View style={styles.textContainer}>
                <Text style={[styles.optionText, { color: theme.textPrimary }]}>{tSettings('aboutUs')}</Text>
                <Text style={[styles.disabledSubtext, { color: theme.textSecondary }]}>
                  {tSettings('aboutUsSubtitle')}
                </Text>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={wp(5)} 
              color={theme.textDisabled} 
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={wp(5.5)} color={theme.error} style={styles.icon} />
          <Text style={styles.logoutText}>{tSettings('logOut')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileSettingsScreen;
