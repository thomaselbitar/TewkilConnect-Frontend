// Screens/ProviderProfile.js
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
    Linking,
    FlatList,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';
import { wp, hp } from '../utils/helpers';
import Button from '../components/UI/Button';
import PostCardStable, { PostCardStableBus } from '../components/Card/PostCards/PostCardStable';

const getSkillLevelColor = (skillLevel) => {
    switch (skillLevel?.toLowerCase()) {
        case 'beginner':
            return '#FF4500'; // Red
        case 'intermediate':
            return '#FFD700'; // Yellow
        case 'expert':
        case 'advanced':
            return '#32CD32'; // Green
        default:
            return '#6c757d'; // Default gray for unknown levels
    }
};

const ProviderProfile = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { tProfile, tCommon, tAuth, tRequest, tNavigation, tPosts } = useTranslation();
    const { provider } = route.params;

    // State management
    const [selectedTab, setSelectedTab] = useState('data');
    const [isFollowing, setIsFollowing] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);


    const viewabilityConfig = { itemVisiblePercentThreshold: 60 };
    const onViewableItemsChanged = React.useRef(({ viewableItems }) => {
        if (viewableItems?.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    });
    // Mock current user data - replace with actual user context
    const currentUser = {
        userType: 'user', // 'user' or 'provider'
    };

    // Mock contact information - replace with actual provider data
    const contactInfo = {
        phoneNumber: '+961 70 123 456',
        email: 'rami.said@example.com',
    };

    // Mock skills data - replace with actual provider data
    const providerSkills = [
        {
            skill_name: 'General Repair',
            skill_level: 'Expert',
            skill_description: 'Expert in general repair and maintenance services'
        },
        {
            skill_name: 'Electrical Work',
            skill_level: 'Intermediate',
            skill_description: 'Intermediate level electrical repairs and installations'
        },
        {
            skill_name: 'Plumbing',
            skill_level: 'Beginner',
            skill_description: 'Basic plumbing repairs and maintenance'
        }
    ];

    // Mock links data - replace with actual provider data
    const providerLinks = [
        {
            link_name: 'Portfolio Website',
            link_url: 'https://rami-said-portfolio.com',
            link_type: 'website'
        },
        {
            link_name: 'LinkedIn Profile',
            link_url: 'https://linkedin.com/in/rami-said',
            link_type: 'linkedin'
        },
        {
            link_name: 'Instagram',
            link_url: 'https://instagram.com/rami_said_repairs',
            link_type: 'instagram'
        }
    ];

    // Mock data for followers and posts counts
    const followersCount = Math.floor(Math.random() * 500) + 50;
    const postsCount = Math.floor(Math.random() * 100) + 10;
    const followingCount = Math.floor(Math.random() * 200) + 20;

    // Mock posts data for the provider
    const providerPosts = [
        {
            id: '1',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Just finished an amazing home renovation project! The before and after is incredible. #homeimprovement #renovation',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            isLiked: true,
            likesCount: 42,
            media: [
                {
                    type: 'image',
                    url: require('../assets/images/Posts/TestPost.jpg')
                }
            ]
        },
        {
            id: '2',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Working on some new techniques in the workshop today. Always learning something new! 🔨 #diy #workshop #learning',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            isLiked: false,
            likesCount: 18,
            media: [
                {
                    type: 'video',
                    url: require('../assets/images/Videos/v1.mp4'),
                    aspectRatio: 'square'
                }
            ]
        },
        {
            id: '3',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Before and after of a complete kitchen makeover! The transformation is stunning. #kitchenrenovation #beforeandafter',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            isLiked: true,
            likesCount: 89,
            media: [
                {
                    type: 'image',
                    url: require('../assets/images/Posts/TestPost.jpg')
                },
                {
                    type: 'image',
                    url: require('../assets/images/Posts/TestPost.jpg')
                }
            ]
        },
        {
            id: '4',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Quick tutorial on how to fix a leaky faucet! Watch and learn 💧 #plumbing #tutorial #diy',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            isLiked: false,
            likesCount: 156,
            media: [
                {
                    type: 'video',
                    url: require('../assets/images/Videos/v2.mp4'),
                    aspectRatio: 'vertical'
                }
            ]
        },
        {
            id: '5',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Electrical work in progress! Safety first ⚡ #electrical #safety #construction',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
            isLiked: true,
            likesCount: 73,
            media: [
                {
                    type: 'video',
                    url: require('../assets/images/Videos/v6.mp4'),
                    aspectRatio: 'landscape'
                }
            ]
        },
        {
            id: '6',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Time-lapse of a complete bathroom renovation! 3 days of work condensed into 30 seconds 🚿 #renovation #timelapse',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
            isLiked: false,
            likesCount: 234,
            media: [
                {
                    type: 'video',
                    url: require('../assets/images/Videos/v4.mp4'),
                    aspectRatio: 'square'
                }
            ]
        },
        {
            id: '7',
            user: {
                firstName: provider.name.split(' ')[0] || 'Provider',
                lastName: provider.name.split(' ')[1] || 'User',
                profileImage: provider.profilePicture,
                userType: 'provider'
            },
            caption: 'Woodworking skills in action! Creating custom furniture pieces 🪚 #woodworking #furniture #craftsmanship',
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
            isLiked: true,
            likesCount: 98,
            media: [
                {
                    type: 'video',
                    url: require('../assets/images/Videos/v8.mp4'),
                    aspectRatio: 'vertical'
                }
            ]
        }
    ];

    // Handle like toggle for posts
    const handleLikeToggle = (postId) => {
        setLikedPosts(prev => {
            const newLikedPosts = new Set(prev);
            if (newLikedPosts.has(postId)) {
                newLikedPosts.delete(postId);
            } else {
                newLikedPosts.add(postId);
            }
            return newLikedPosts;
        });
    };

    // Hide the default header and use custom header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    // Simulate loading data
    useEffect(() => {
        const loadData = async () => {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsLoading(false);
        };
        
        loadData();
    }, []);


    // Handle follow/unfollow
    const handleFollowToggle = () => {
        if (isFollowing) {
            // Show confirmation alert for unfollow
            Alert.alert(
                tProfile('unfollowConfirm'),
                `${tAuth('alerts.areYouSure')} ${tProfile('unfollowConfirm')} ${provider.name}?`,
                [
                    {
                        text: tCommon('cancel'),
                        style: 'cancel',
                    },
                    {
                        text: tProfile('unfollowConfirm'),
                        style: 'destructive',
                        onPress: () => {
                            setIsFollowing(false);
                            // Here you would make API call to unfollow
                        },
                    },
                ]
            );
        } else {
            // Follow the user
            setIsFollowing(true);
            // Here you would make API call to follow
        }
    };

    // Handle message
    const handleMessage = () => {
        // Navigate to message screen
        navigation.navigate('Message', { provider });
    };

    // Handle request service
    const handleRequestService = () => {
        navigation.navigate('ProviderRequestType', { provider });
    };

    // Handle phone call
    const handlePhoneCall = () => {
        const phoneUrl = `tel:${contactInfo.phoneNumber}`;
        Linking.openURL(phoneUrl).catch(err => {
            Alert.alert('Error', 'Unable to make phone call');
        });
    };

    // Handle email
    const handleEmail = () => {
        const emailUrl = `mailto:${contactInfo.email}`;
        Linking.openURL(emailUrl).catch(err => {
            Alert.alert('Error', 'Unable to open email client');
        });
    };

    // Handle pull to refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            // Simulate API call to refresh data
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Here you would typically refetch provider data, posts, etc.
            // For now, we'll just simulate the refresh
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };


    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
          {/* Custom Header */}
          <View style={[styles.customHeader, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackButton}>
              <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{tNavigation('profile')}</Text>
            <View style={styles.headerRight} />
          </View>

          {/* Loading Spinner */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                {tProfile('loadingProfile')}
              </Text>
            </View>
          )}

          {/* Main Content */}
          {!isLoading && (
            <>
              {selectedTab === 'posts' ? (
            /* ---------------------- POSTS TAB (FlatList root) ---------------------- */
            <FlatList
              data={[...providerPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
              keyExtractor={(item) => item.id.toString()}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.primary]}
                  tintColor={theme.primary}
                />
              }
              renderItem={({ item, index }) => (
                <PostCardStable
                  post={item}
                  isActive={index === activeIndex}
                  isLiked={likedPosts.has(item.id)}
                  likesCount={item.likesCount}
                  onLikeToggle={() => handleLikeToggle(item.id)}
                  isFollowed={isFollowing}
                  onFollowToggle={handleFollowToggle}
                />
              )}
              ListHeaderComponent={
                <View>
                  {/* header row, actions, and tabs stay visible above the list */}
                  <View style={styles.headerRow}>
                    <View style={styles.profileSection}>
                      <Image
                        source={{ uri: provider.profilePicture }}
                        style={[styles.profilePic, { borderColor: theme.primary }]}
                      />
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={[styles.username, { color: theme.textPrimary }]}>
                        {provider.name}
                      </Text>
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>{postsCount}</Text>
                          <Text style={styles.statLabel}>{tProfile('posts')}</Text>
                        </View>
                        <View className="followers" style={styles.statItem}>
                          <Text style={styles.statNumber}>{followersCount}</Text>
                          <Text style={styles.statLabel}>{tProfile('followers')}</Text>
                        </View>
                        <View style={styles.statItem}>
                          <Text style={styles.statNumber}>{followingCount}</Text>
                          <Text style={styles.statLabel}>{tProfile('following')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
      
                  <View style={styles.actionButtonsContainer}>
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.followButton, isFollowing && styles.followingButton]}
                        onPress={handleFollowToggle}
                      >
                        <Ionicons
                          name={isFollowing ? 'checkmark' : 'add'}
                          size={20}
                          color={isFollowing ? theme.background : theme.primary}
                        />
                        <Text style={[styles.actionButtonText, isFollowing && styles.followingButtonText]}>
                          {isFollowing ? tPosts('unfollow') : tPosts('follow')}
                        </Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessage}>
                        <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
                        <Text style={[styles.actionButtonText, { color: theme.primary }]}>{tProfile('message')}</Text>
                      </TouchableOpacity>
                    </View>
      
                    {currentUser.userType !== 'provider' && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.requestButton, styles.requestButtonFullWidth]}
                        onPress={handleRequestService}
                      >
                        <Ionicons name="briefcase-outline" size={20} color="#fff" />
                        <Text style={[styles.actionButtonText, { color: '#fff' }]}>{tRequest('createRequest')}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
      
                  {/* tabs */}
                  <View style={styles.tabRow}>
                    <TouchableOpacity
                      onPress={() => setSelectedTab('data')}
                      style={[styles.tab, selectedTab === 'data' && styles.activeTab]}
                    >
                      <Ionicons
                        name="information-circle-outline"
                        size={wp(6)}
                        style={selectedTab === 'data' ? styles.activeTabIcon : styles.tabIcon}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setSelectedTab('posts')}
                      style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
                    >
                      <Ionicons
                        name="grid-outline"
                        size={wp(6)}
                        style={selectedTab === 'posts' ? styles.activeTabIcon : styles.tabIcon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              }
              ListEmptyComponent={
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="grid-outline" size={wp(12)} color={theme.textSecondary} />
                  <Text style={styles.emptyStateText}>{tProfile('noPostsYet')}</Text>
                </View>
              }
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged.current}
              viewabilityConfig={viewabilityConfig}
              /* pause during flings */
              onScrollBeginDrag={() => PostCardStableBus.scrolling(true)}
              onMomentumScrollBegin={() => PostCardStableBus.scrolling(true)}
              onScrollEndDrag={() => PostCardStableBus.scrolling(false)}
              onMomentumScrollEnd={() => PostCardStableBus.scrolling(false)}
              /* perf */
              windowSize={7}
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              removeClippedSubviews
              contentContainerStyle={{ paddingBottom: hp(4) }}
            />
          ) : (
            /* ---------------------- DATA TAB (ScrollView root) ---------------------- */
            <ScrollView 
              style={styles.scrollContainer} 
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  colors={[theme.primary]}
                  tintColor={theme.primary}
                />
              }
            >
              {/* header row */}
              <View style={styles.headerRow}>
                <View style={styles.profileSection}>
                  <Image
                    source={{ uri: provider.profilePicture }}
                    style={[styles.profilePic, { borderColor: theme.primary }]}
                  />
                </View>
                <View style={styles.statsContainer}>
                  <Text style={[styles.username, { color: theme.textPrimary }]}>{provider.name}</Text>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{postsCount}</Text>
                      <Text style={styles.statLabel}>{tProfile('posts')}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{followersCount}</Text>
                      <Text style={styles.statLabel}>{tProfile('followers')}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{followingCount}</Text>
                      <Text style={styles.statLabel}>{tProfile('following')}</Text>
                    </View>
                  </View>
                </View>
              </View>
      
              {/* actions */}
              <View style={styles.actionButtonsContainer}>
                <View style={styles.actionButtonsRow}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.followButton, isFollowing && styles.followingButton]}
                    onPress={handleFollowToggle}
                  >
                    <Ionicons
                      name={isFollowing ? 'checkmark' : 'add'}
                      size={20}
                      color={isFollowing ? theme.background : theme.primary}
                    />
                    <Text style={[styles.actionButtonText, isFollowing && styles.followingButtonText]}>
                      {isFollowing ? tPosts('unfollow') : tPosts('follow')}
                    </Text>
                  </TouchableOpacity>
      
                  <TouchableOpacity style={[styles.actionButton, styles.messageButton]} onPress={handleMessage}>
                    <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
                    <Text style={[styles.actionButtonText, { color: theme.primary }]}>{tProfile('message')}</Text>
                  </TouchableOpacity>
                </View>
      
                {currentUser.userType !== 'provider' && (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.requestButton, styles.requestButtonFullWidth]}
                    onPress={handleRequestService}
                  >
                    <Ionicons name="briefcase-outline" size={20} color="#fff" />
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>{tRequest('createRequest')}</Text>
                  </TouchableOpacity>
                )}
              </View>
      
              {/* tabs */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  onPress={() => setSelectedTab('data')}
                  style={[styles.tab, selectedTab === 'data' && styles.activeTab]}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={wp(6)}
                    style={selectedTab === 'data' ? styles.activeTabIcon : styles.tabIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSelectedTab('posts')}
                  style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
                >
                  <Ionicons
                    name="grid-outline"
                    size={wp(6)}
                    style={selectedTab === 'posts' ? styles.activeTabIcon : styles.tabIcon}
                  />
                </TouchableOpacity>
              </View>
      
              {/* Section Content */}
              {selectedTab === 'data' && (
                <View style={styles.infoSection}>
                  <View style={styles.infoContent}>
                    {/* Contact Information */}
                    {(contactInfo.phoneNumber || contactInfo.email) && (
                      <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                          <Ionicons name="call-outline" size={wp(5)} color={theme.primary} />
                          <Text style={styles.cardTitle}>{tProfile('contactInfo')}</Text>
                        </View>
                        {contactInfo.phoneNumber && (
                          <TouchableOpacity style={styles.contactItem} onPress={handlePhoneCall}>
                            <Ionicons name="call" size={wp(4)} color={theme.primary} />
                            <Text style={[styles.contactText, { color: theme.primary }]}>
                              {contactInfo.phoneNumber}
                            </Text>
                          </TouchableOpacity>
                        )}
                        {contactInfo.email && (
                          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
                            <Ionicons name="mail" size={wp(4)} color={theme.primary} />
                            <Text style={[styles.contactText, { color: theme.primary }]}>
                              {contactInfo.email}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}

                    {/* Location */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('location')}</Text>
                      </View>
                      <View style={styles.contactItem}>
                        <Ionicons name="location" size={wp(4)} color={theme.textSecondary} />
                        <Text style={styles.contactText}>{provider.location}</Text>
                      </View>
                    </View>

                    {/* Categories */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="grid-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('categories')}</Text>
                      </View>
                      <View style={styles.tagsContainer}>
                        <View style={styles.tag}>
                          <Text style={styles.tagText}>{provider.category}</Text>
                        </View>
                      </View>
                    </View>

                    {/* About Section */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="person-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('about')}</Text>
                      </View>
                      <Text style={styles.cardContent}>
                        Professional {provider.category.toLowerCase()} with {provider.rating.toFixed(1)} star rating. Located in {provider.location}. Available for service requests.
                      </Text>
                    </View>

                    {/* Skills */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="star-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('skills')}</Text>
                      </View>
                      {providerSkills.map((skill, index) => (
                        <View key={index} style={styles.skillItem}>
                          <View style={styles.skillHeader}>
                            <Text style={styles.skillName}>{skill.skill_name}</Text>
                            <View style={[styles.skillLevel, { backgroundColor: getSkillLevelColor(skill.skill_level) + '20' }]}>
                              <Text style={[styles.skillLevelText, { color: getSkillLevelColor(skill.skill_level) }]}>
                                {skill.skill_level}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.skillDescription}>
                            {skill.skill_description}
                          </Text>
                        </View>
                      ))}
                    </View>

                    {/* Links */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="link-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('links')}</Text>
                      </View>
                      {providerLinks.map((link, index) => (
                        <TouchableOpacity 
                          key={index} 
                          style={styles.linkItem} 
                          onPress={() => Linking.openURL(link.link_url)}
                        >
                          <View style={styles.linkContent}>
                            <Ionicons 
                              name={
                                link.link_type === 'website' ? 'globe-outline' : 
                                link.link_type === 'linkedin' ? 'logo-linkedin' : 
                                link.link_type === 'instagram' ? 'logo-instagram' : 
                                'link-outline'
                              } 
                              size={wp(5)} 
                              color={theme.primary} 
                            />
                            <Text style={[styles.linkText, { color: theme.textPrimary }]}>
                              {link.link_name}
                            </Text>
                          </View>
                          <Ionicons name="chevron-forward" size={wp(4)} color={theme.textSecondary} />
                        </TouchableOpacity>
                      ))}
                    </View>

                    {/* Reviews */}
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="star-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('review')}</Text>
                        <TouchableOpacity 
                          style={styles.viewAllButton} 
                          onPress={() => navigation.navigate('ProviderReviews', { provider })}
                        >
                          <Text style={[styles.viewAllText, { color: theme.primary }]}>{tProfile('viewAll')}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.reviewContainer}>
                        <Text style={[styles.reviewRating, { color: theme.textPrimary }]}>
                          {provider.rating.toFixed(1)}
                        </Text>
                        <View style={styles.reviewStarsRow}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Ionicons 
                              key={i} 
                              name={i < Math.floor(provider.rating) ? "star" : "star-outline"} 
                              size={24} 
                              color="#FFD700" 
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Posts Section */}
              {selectedTab === 'posts' && (
                <View style={styles.postsSection}>
                  {providerPosts.length > 0 ? (
                    <FlatList
                      data={[...providerPosts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))}
                      keyExtractor={(item) => item.id.toString()}
                      renderItem={({ item, index }) => (
                        <PostCardStable
                          post={item}
                          isActive={index === activeIndex}
                          isLiked={likedPosts.has(item.id)}
                          likesCount={item.likesCount}
                          onLikeToggle={() => handleLikeToggle(item.id)}
                          isFollowed={isFollowing}
                          onFollowToggle={handleFollowToggle}
                        />
                      )}
                      showsVerticalScrollIndicator={false}
                      onViewableItemsChanged={onViewableItemsChanged.current}
                      viewabilityConfig={viewabilityConfig}
                      onScrollBeginDrag={() => PostCardStableBus.scrolling(true)}
                      onMomentumScrollBegin={() => PostCardStableBus.scrolling(true)}
                      onScrollEndDrag={() => PostCardStableBus.scrolling(false)}
                      onMomentumScrollEnd={() => PostCardStableBus.scrolling(false)}
                      windowSize={7}
                      initialNumToRender={3}
                      maxToRenderPerBatch={3}
                      removeClippedSubviews
                      scrollEnabled={false}
                      contentContainerStyle={{ paddingBottom: hp(4) }}
                    />
                  ) : (
                    <View style={styles.emptyStateContainer}>
                      <Ionicons name="grid-outline" size={wp(12)} color={theme.textSecondary} />
                      <Text style={styles.emptyStateText}>{tProfile('noPostsYet')}</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          )}
            </>
          )}
        </View>
      );
      
};

export default ProviderProfile;

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    customHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: hp(6), // Account for status bar
        paddingBottom: 12,
        height: 56 + hp(5), // Standard header height + status bar
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border || '#e0e0e0',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    headerBackButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 16,
    },
    headerRight: {
        width: 40, // Standard width for back button area
    },
    scrollContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(5),
        paddingTop: hp(2),
        paddingBottom: hp(1),
    },
    profileSection: {
        alignItems: 'center',
        marginRight: wp(4),
    },
    profilePic: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        borderWidth: 3,
        marginBottom: hp(1),
    },
    username: {
        fontSize: wp(4.5),
        fontWeight: '600',
        textAlign: 'left',
        marginBottom: hp(1.5),
        marginLeft: wp(7),
    },
    statsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: wp(4.5),
        fontWeight: 'bold',
        color: theme.textPrimary,
    },
    statLabel: {
        fontSize: wp(3.2),
        color: theme.textSecondary,
        marginTop: hp(0.5),
    },
    actionButtonsContainer: {
        paddingHorizontal: wp(5),
        marginBottom: hp(2),
    },
    actionButtonsRow: {
        flexDirection: 'row',
        gap: wp(2),
        marginBottom: hp(1.5),
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(1.5),
        borderRadius: wp(2),
        borderWidth: 1,
        gap: wp(2),
    },
    followButton: {
        borderColor: theme.primary,
        backgroundColor: 'transparent',
    },
    followingButton: {
        backgroundColor: theme.primary,
    },
    messageButton: {
        borderColor: theme.primary,
        backgroundColor: 'transparent',
    },
    requestButton: {
        borderColor: theme.primary,
        backgroundColor: theme.primary,
    },
    requestButtonFullWidth: {
        width: '100%',
    },
    actionButtonText: {
        fontSize: wp(3.5),
        fontWeight: '600',
        color: theme.primary,
    },
    followingButtonText: {
        color: theme.background,
    },
    tabRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.border,
        marginBottom: hp(2),
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hp(2),
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: theme.primary,
    },
    tabIcon: {
        color: theme.textSecondary,
    },
    activeTabIcon: {
        color: theme.primary,
    },
    infoSection: {
        paddingHorizontal: wp(5),
    },
    infoContent: {
        marginTop: hp(1),
    },
    infoCard: {
        backgroundColor: theme.cardBackground,
        borderRadius: wp(3),
        marginBottom: hp(2),
        padding: wp(4),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    cardTitle: {
        fontSize: wp(4.5),
        fontWeight: '700',
        color: theme.textPrimary,
        marginLeft: wp(3),
        flex: 1,
    },
    viewAllButton: {
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
    },
    viewAllText: {
        fontSize: wp(3.5),
        fontWeight: '600',
    },
    cardContent: {
        fontSize: wp(4),
        color: theme.textSecondary,
        lineHeight: hp(2.8),
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    contactText: {
        fontSize: wp(4),
        color: theme.textSecondary,
        marginLeft: wp(3),
        flex: 1,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp(1),
    },
    tag: {
        backgroundColor: theme.primary + '15',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        marginRight: wp(2),
        marginBottom: hp(1),
    },
    tagText: {
        fontSize: wp(3.5),
        color: theme.primary,
        fontWeight: '500',
    },
    skillItem: {
        marginBottom: hp(2),
        paddingBottom: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: theme.border + '30',
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
    },
    skillName: {
        fontSize: wp(4),
        fontWeight: '600',
        color: theme.textPrimary,
        flex: 1,
    },
    skillLevel: {
        borderRadius: wp(1.5),
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.3),
    },
    skillLevelText: {
        fontSize: wp(3),
        fontWeight: '600',
    },
    skillDescription: {
        fontSize: wp(3.5),
        color: theme.textSecondary,
        lineHeight: hp(2.2),
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1.5),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border + '30',
    },
    linkContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    linkText: {
        fontSize: wp(4),
        marginLeft: wp(3),
        flex: 1,
    },
    reviewContainer: {
        alignItems: 'center',
        marginTop: hp(1),
    },
    reviewRating: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    reviewStarsRow: {
        flexDirection: 'row',
    },
    postsSection: {
        flex: 1,
    },
    postCard: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(2),
    },
    cardTitle: {
        fontSize: wp(4.5),
        fontWeight: '700',
        color: theme.textPrimary,
        marginLeft: wp(3),
        flex: 1,
    },
    viewAllButton: {
        paddingVertical: hp(0.5),
        paddingHorizontal: wp(2),
    },
    viewAllText: {
        fontSize: wp(3.5),
        fontWeight: '600',
    },
    cardContent: {
        fontSize: wp(4),
        color: theme.textSecondary,
        lineHeight: hp(2.8),
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: hp(1.5),
    },
    contactText: {
        fontSize: wp(4),
        color: theme.textSecondary,
        marginLeft: wp(3),
        flex: 1,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: hp(1),
    },
    tag: {
        backgroundColor: theme.primary + '15',
        borderRadius: wp(2),
        paddingHorizontal: wp(3),
        paddingVertical: hp(0.8),
        marginRight: wp(2),
        marginBottom: hp(1),
    },
    tagText: {
        fontSize: wp(3.5),
        color: theme.primary,
        fontWeight: '500',
    },
    skillItem: {
        marginBottom: hp(2),
        paddingBottom: hp(1.5),
        borderBottomWidth: 1,
        borderBottomColor: theme.border + '30',
    },
    skillHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(0.5),
    },
    skillName: {
        fontSize: wp(4),
        fontWeight: '600',
        color: theme.textPrimary,
        flex: 1,
    },
    skillLevel: {
        borderRadius: wp(1.5),
        paddingHorizontal: wp(2.5),
        paddingVertical: hp(0.3),
    },
    skillLevelText: {
        fontSize: wp(3),
        fontWeight: '600',
    },
    skillDescription: {
        fontSize: wp(3.5),
        color: theme.textSecondary,
        lineHeight: hp(2.2),
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(1.5),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.border + '30',
    },
    linkContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    linkText: {
        fontSize: wp(4),
        marginLeft: wp(3),
        flex: 1,
    },
    reviewContainer: {
        alignItems: 'center',
        marginTop: hp(1),
    },
    reviewRating: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: hp(1),
    },
    reviewStarsRow: {
        flexDirection: 'row',
    },
    postsSection: {
        flex: 1,
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginTop: hp(10),
        paddingHorizontal: wp(5),
    },
    emptyStateText: {
        textAlign: 'center',
        color: theme.textSecondary,
        marginTop: hp(2),
        fontSize: wp(4),
        marginBottom: hp(3),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.background,
    },
    loadingText: {
        marginTop: hp(2),
        fontSize: wp(4),
        textAlign: 'center',
    },
});