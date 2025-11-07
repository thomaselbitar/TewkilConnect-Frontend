import React, { useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const AboutUsScreen = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const { tSettings, tCommon, tAboutUs } = useTranslation();
  const [imageLoading, setImageLoading] = useState({
    thomas: true,
    jobran: true,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: wp(5),
      paddingTop: hp(2),
    },
    header: {
      alignItems: 'center',
      marginBottom: hp(4),
    },
    logo: {
      width: wp(40),
      height: wp(40),
      borderRadius: wp(20),
      borderWidth: 3,
      borderColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: hp(2),
    },
    logoImage: {
      width: wp(35),
      height: wp(35),
    },
    appName: {
      fontSize: wp(6),
      fontWeight: 'bold',
      color: theme.textPrimary,
      marginBottom: hp(0.5),
    },
    version: {
      fontSize: wp(4),
      color: theme.textSecondary,
      marginBottom: hp(2),
    },
    tagline: {
      fontSize: wp(4.5),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: wp(6),
      fontStyle: 'italic',
    },
    section: {
      marginBottom: hp(3),
    },
    sectionTitle: {
      fontSize: wp(5),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: hp(1.5),
    },
    sectionText: {
      fontSize: wp(4),
      color: theme.textSecondary,
      lineHeight: wp(5.5),
      marginBottom: hp(1),
    },
    contactSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(3),
      padding: wp(4),
      marginBottom: hp(2),
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: hp(1),
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor || theme.textDisabled + '20',
    },
    contactItemLast: {
      borderBottomWidth: 0,
    },
    contactIcon: {
      marginRight: wp(3),
    },
    contactText: {
      fontSize: wp(4),
      color: theme.textPrimary,
      flex: 1,
    },
    contactSubtext: {
      fontSize: wp(3.5),
      color: theme.textSecondary,
      marginTop: hp(0.5),
    },
    socialSection: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(3),
      padding: wp(4),
      marginBottom: hp(2),
    },
    socialButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: hp(1),
    },
    socialButton: {
      alignItems: 'center',
      padding: wp(3),
    },
    socialButtonText: {
      fontSize: wp(3.5),
      color: theme.textSecondary,
      marginTop: hp(0.5),
    },
    disabledButton: {
      opacity: 0.5,
    },
    disabledText: {
      color: theme.textDisabled,
    },
    footer: {
      alignItems: 'center',
      paddingVertical: hp(3),
      borderTopWidth: 1,
      borderTopColor: theme.borderColor || theme.textDisabled + '20',
      marginTop: hp(2),
    },
    footerText: {
      fontSize: wp(3.5),
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: wp(4.5),
    },
    link: {
      color: theme.primary,
      textDecorationLine: 'underline',
    },
    developerSection: {
      marginTop: hp(3),
      paddingTop: hp(2),
      borderTopWidth: 1,
      borderTopColor: theme.borderColor || theme.textDisabled + '20',
    },
    developerSectionTitle: {
      fontSize: wp(5),
      fontWeight: '600',
      color: theme.textPrimary,
      textAlign: 'center',
      marginBottom: hp(3),
    },
    developerCard: {
      backgroundColor: theme.cardBackground,
      borderRadius: wp(3),
      padding: wp(4),
      marginBottom: hp(2),
      flexDirection: 'column',
      alignItems: 'center',
    },
    developerImageContainer: {
      marginBottom: hp(2),
    },
    developerImage: {
      width: wp(30),
      height: wp(30),
      borderRadius: wp(15),
    },
    developerInfo: {
      alignItems: 'center',
    },
    developerName: {
      fontSize: wp(4.5),
      fontWeight: '600',
      color: theme.textPrimary,
      marginBottom: hp(0.5),
      textAlign: 'center',
    },
    developerEducation: {
      fontSize: wp(3.8),
      color: theme.textSecondary,
      marginBottom: hp(0.5),
      textAlign: 'center',
    },
    developerPosition: {
      fontSize: wp(3.8),
      color: theme.primary,
      fontWeight: '500',
      marginBottom: hp(1.5),
      textAlign: 'center',
    },
    developerLinks: {
      flexDirection: 'row',
      gap: wp(3),
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceLight || theme.background,
      paddingHorizontal: wp(3),
      paddingVertical: hp(0.8),
      borderRadius: wp(2),
      borderWidth: 1,
      borderColor: theme.borderColor || theme.textDisabled + '30',
    },
    linkText: {
      fontSize: wp(3.5),
      color: theme.textPrimary,
      marginLeft: wp(1.5),
      fontWeight: '500',
    },
    imageLoadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: wp(15),
    },
    imageErrorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.cardBackground,
      borderRadius: wp(15),
    },
    imageErrorText: {
      fontSize: wp(3),
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: tAboutUs('title'),
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
  }, [navigation, theme, tAboutUs]);

  const handleContactPress = (type, value) => {
    switch (type) {
      case 'email':
        Linking.openURL(`mailto:${value}`).catch(() => {
          Alert.alert('Error', 'Unable to open email client.');
        });
        break;
      case 'phone':
        Linking.openURL(`tel:${value}`).catch(() => {
          Alert.alert('Error', 'Unable to open phone dialer.');
        });
        break;
      case 'website':
        Linking.openURL(value).catch(() => {
          Alert.alert('Error', 'Unable to open website.');
        });
        break;
      default:
        break;
    }
  };

  const handleSocialPress = (platform) => {
    const socialLinks = {
      facebook: 'https://www.facebook.com/share/1J5fone6c5/?mibextid=wwXIfr',
      twitter: 'https://twitter.com/yourapp',
      instagram: 'https://instagram.com/tewkilconnect',
      linkedin: 'https://linkedin.com/company/yourapp',
    };

    const url = socialLinks[platform];
    if (url) {
      Linking.openURL(url).catch(() => {
        Alert.alert('Error', `Unable to open ${platform}.`);
      });
    }
  };

  const handleImageLoad = (developer) => {
    setImageLoading(prev => ({
      ...prev,
      [developer]: false,
    }));
  };

  const handleImageError = (developer) => {
    setImageLoading(prev => ({
      ...prev,
      [developer]: false,
    }));
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logo}>
            <Image 
              source={isDarkMode ? require('../../assets/images/Logo/DarkLogo.png') : require('../../assets/images/Logo/LightLogo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
            <Text style={styles.appName}>Tewkil Connect</Text>
          <Text style={styles.version}>{tAboutUs('version')}</Text>
          <Text style={styles.tagline}>
            {tAboutUs('tagline')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tAboutUs('aboutUsTitle')}</Text>
          <Text style={styles.sectionText}>
            {tAboutUs('aboutUsContent')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{tAboutUs('missionTitle')}</Text>
          <Text style={styles.sectionText}>
            {tAboutUs('missionContent')}
          </Text>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>{tAboutUs('contactUs')}</Text>
          
          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContactPress('email', 'tewkilconnect@gmail.com')}
          >
            <Ionicons 
              name="mail-outline" 
              size={wp(5)} 
              color={theme.primary} 
              style={styles.contactIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactText}>{tAboutUs('emailSupport')}</Text>
              <Text style={styles.contactSubtext}>tewkilconnect@gmail.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp(4)} color={theme.textDisabled} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.contactItem}
            onPress={() => handleContactPress('phone', '+96181690063')}
          >
            <Ionicons 
              name="call-outline" 
              size={wp(5)} 
              color={theme.primary} 
              style={styles.contactIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactText}>{tAboutUs('phoneSupport')}</Text>
              <Text style={styles.contactSubtext}>+961 81 690 063</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp(4)} color={theme.textDisabled} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.contactItem, styles.contactItemLast]}
            onPress={() => handleContactPress('website', 'https://tewkilconnect.com')}
          >
            <Ionicons 
              name="globe-outline" 
              size={wp(5)} 
              color={theme.primary} 
              style={styles.contactIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.contactText}>{tAboutUs('website')}</Text>
              <Text style={styles.contactSubtext}>www.tewkilconnect.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={wp(4)} color={theme.textDisabled} />
          </TouchableOpacity>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.sectionTitle}>{tAboutUs('followUs')}</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('facebook')}
            >
              <Ionicons name="logo-facebook" size={wp(6)} color="#1877F2" />
              <Text style={styles.socialButtonText}>{tAboutUs('facebook')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, styles.disabledButton]}
              disabled={true}
            >
              <Ionicons name="logo-twitter" size={wp(6)} color="#1DA1F2" />
              <Text style={[styles.socialButtonText, styles.disabledText]}>{tAboutUs('twitter')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => handleSocialPress('instagram')}
            >
              <Ionicons name="logo-instagram" size={wp(6)} color="#E4405F" />
              <Text style={styles.socialButtonText}>{tAboutUs('instagram')}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.socialButton, styles.disabledButton]}
              disabled={true}
            >
              <Ionicons name="logo-linkedin" size={wp(6)} color="#0077B5" />
              <Text style={[styles.socialButtonText, styles.disabledText]}>{tAboutUs('linkedin')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Developer Section */}
        <View style={styles.developerSection}>
          <Text style={styles.developerSectionTitle}>{tAboutUs('meetDevelopers')}</Text>
          
          {/* Thomas Card */}
          <View style={styles.developerCard}>
            <View style={styles.developerImageContainer}>
              <Image 
                source={require('../../assets/images/Dev/Thomas.png')}
                style={styles.developerImage}
                resizeMode="cover"
                onLoad={() => handleImageLoad('thomas')}
                onError={() => handleImageError('thomas')}
                fadeDuration={300}
              />
              {imageLoading.thomas && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              )}
            </View>
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>Thomas El-Bitar</Text>
              <Text style={styles.developerEducation}>Computer Science and Software Engineering</Text>
              <Text style={styles.developerPosition}>Role in App: Frontend Developer</Text>
              <View style={styles.developerLinks}>
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => Linking.openURL('https://github.com/thomaselbitar')}
                >
                  <Ionicons name="logo-github" size={wp(5)} color={theme.textPrimary} />
                  <Text style={styles.linkText}>GitHub</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => Linking.openURL('https://linkedin.com/in/thomas-el-bitar')}
                >
                  <Ionicons name="logo-linkedin" size={wp(5)} color="#0077B5" />
                  <Text style={styles.linkText}>LinkedIn</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Jobran Card */}
          <View style={styles.developerCard}>
            <View style={styles.developerImageContainer}>
              <Image 
                source={require('../../assets/images/Dev/Jobran.png')}
                style={styles.developerImage}
                resizeMode="cover"
                onLoad={() => handleImageLoad('jobran')}
                onError={() => handleImageError('jobran')}
                fadeDuration={300}
              />
              {imageLoading.jobran && (
                <View style={styles.imageLoadingContainer}>
                  <ActivityIndicator size="small" color={theme.primary} />
                </View>
              )}
            </View>
            <View style={styles.developerInfo}>
              <Text style={styles.developerName}>Jobran Zaiter</Text>
              <Text style={styles.developerEducation}>Computer Science and Master in AI</Text>
              <Text style={styles.developerPosition}>Role in App: Backend Developer</Text>
              <View style={styles.developerLinks}>
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => Linking.openURL('https://github.com/JobranZaiter')}
                >
                  <Ionicons name="logo-github" size={wp(5)} color={theme.textPrimary} />
                  <Text style={styles.linkText}>GitHub</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.linkButton}
                  onPress={() => Linking.openURL('https://linkedin.com/in/jobran-zaiter')}
                >
                  <Ionicons name="logo-linkedin" size={wp(5)} color="#0077B5" />
                  <Text style={styles.linkText}>LinkedIn</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {tAboutUs('copyright')}
          </Text>
          <Text style={styles.footerText}>
            {tAboutUs('madeWithLove')}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutUsScreen;
