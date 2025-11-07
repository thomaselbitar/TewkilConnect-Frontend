import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Button from '../../components/UI/Button';
import AddContentModal from '../../components/Modal/AddContentModal';
import PostUserCard, { __VideoControlBus } from '../../components/Card/PostCards/PostUserCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';
import { sampleUsers } from '../../Data/Data';
import { categories, getCategoryTranslation } from '../../Data/CategoryandTag';
import { getUserPosts, getUserPostsCount, deleteUserPost } from '../../Data/UserPostsData';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const openSafeLink = (link) => {
  const url = link.startsWith('http://') || link.startsWith('https://')
    ? link
    : `https://${link}`;
  Linking.openURL(url);
};

const getSkillLevelColor = (skillLevel) => {
  if (!skillLevel) return '#666666'; // Default gray
  
  const level = skillLevel.toLowerCase();
  if (level.includes('beginner') || level.includes('basic') || level.includes('novice')) {
    return '#DC3545'; // Red
  } else if (level.includes('intermediate') || level.includes('medium') || level.includes('average')) {
    return '#FFA500'; // Yellow/Orange
  } else if (level.includes('expert') || level.includes('advanced') || level.includes('pro') || level.includes('senior')) {
    return '#28A745'; // Green
  }
  return '#666666'; // Default gray for unknown levels
};

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { tProfile, tCategories } = useTranslation();

  // Get category name by ID or title from centralized categories
  const getCategoryName = (categoryIdOrTitle) => {
    // First try to find by ID
    let category = categories.find(cat => cat.id === categoryIdOrTitle);
    
    // If not found by ID, try to find by title
    if (!category) {
      category = categories.find(cat => cat.title === categoryIdOrTitle);
    }
    
    // If still not found, return the original value or 'Other'
    if (!category) {
      return categoryIdOrTitle || 'Other';
    }
    
    // Use centralized category translation function
    return getCategoryTranslation(category.title, tCategories);
  };

  const [selectedTab, setSelectedTab] = useState('data');
  const [modalVisible, setModalVisible] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsCount, setPostsCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [infoLoading, setInfoLoading] = useState(false);

  const passedData = route.params?.profile;

  const user = passedData || {
    firstName: 'Tommy',
    lastName: 'Bitar',
    phoneNumber: '+961 70 123 456',
    email: '',
    categories: [],
    skills: [],
    profileCompleted: false,
    profileImage: null,
    userType: 'user',
    bio: '',
    links: [],
    rating: 0,
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
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {user.profileCompleted && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginRight: wp(4) }}
            >
              <Ionicons name="add-outline" size={24} color={theme.textPrimary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings', { user: user })}
            style={{ marginRight: wp(2) }}
          >
            <Ionicons name="settings-outline" size={24} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>
      ),
      gestureEnabled: false,
    });
  }, [navigation, user, theme]);

  const handleCompleteProfile = () => {
    navigation.replace('CompleteProfile');
  };

  const borderColor = user.userType === 'provider' ? 'green' : theme.primary;

  // Calculate followers and following counts
  const followersCount = sampleUsers.filter(u => u.isFollowingMe).length;
  const followingCount = sampleUsers.filter(u => u.iFollow).length;

  // Load user posts
  const loadUserPosts = async (isRefresh = false) => {
    if (selectedTab === 'posts' && (userPosts.length === 0 || isRefresh)) {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setPostsLoading(true);
      }
      try {
        const posts = await getUserPosts();
        setUserPosts(posts);
        setPostsCount(posts.length);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setPostsLoading(false);
        }
      }
    }
  };

  // Load profile information
  const loadProfileInfo = async () => {
    if (selectedTab === 'data') {
      setInfoLoading(true);
      try {
        // Simulate loading time for profile information
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error loading profile info:', error);
      } finally {
        setInfoLoading(false);
      }
    }
  };

  // Load posts when posts tab is selected, load profile info when data tab is selected
  useEffect(() => {
    if (selectedTab === 'posts') {
      loadUserPosts();
    } else if (selectedTab === 'data') {
      loadProfileInfo();
    }
  }, [selectedTab]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    loadUserPosts(true);
  }, [selectedTab]);


  // Handle post deletion
  const handleDeletePost = async (post) => {
    try {
      const result = await deleteUserPost(post.id);
      if (result.success) {
        // Remove post from local state
        setUserPosts(prevPosts => prevPosts.filter(p => p.id !== post.id));
        setPostsCount(prevCount => prevCount - 1);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const styles = createStyles(theme);

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      onScroll={() => __VideoControlBus.pauseAll('SCROLL')}
      scrollEventThrottle={16}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]} // Android
          tintColor={theme.primary} // iOS
          progressBackgroundColor={theme.background} // Android background
          titleColor={theme.textPrimary} // iOS text color
          title={refreshing ? tProfile('refreshing') : ''} // iOS title
        />
      }
    >
      {/* Profile Header Row: Image left, stats right */}
      {user.profileCompleted ? (
        <View style={styles.headerRow}>
          <Image
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require('../../assets/images/Profile/defaultProfile.jpg')
            }
            style={[styles.profilePic, { borderColor }]}
          />
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{postsCount}</Text>
                <Text style={styles.statLabel}>{tProfile('posts')}</Text>
              </View>
              <TouchableOpacity 
                style={styles.statItem} 
                onPress={() => navigation.navigate('FollowersFollowingScreen', { initialTab: 'followers' })}
              >
                <Text style={styles.statNumber}>{followersCount}</Text>
                <Text style={styles.statLabel}>{tProfile('followers')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.statItem} 
                onPress={() => navigation.navigate('FollowersFollowingScreen', { initialTab: 'following' })}
              >
                <Text style={styles.statNumber}>{followingCount}</Text>
                <Text style={styles.statLabel}>{tProfile('following')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.header}>
          <Image
            source={
              user.profileImage
                ? { uri: user.profileImage }
                : require('../../assets/images/Profile/defaultProfile.jpg')
            }
            style={[styles.avatar, { borderColor }]}
          />
          <Text style={[styles.name, styles.centeredText]}>{user.firstName} {user.lastName}</Text>
          <Text style={[styles.phone, styles.centeredText]}>{user.phoneNumber}</Text>
        </View>
      )}
      
      {/* Name and phone number always below header row */}
      {user.profileCompleted && (
        <View style={styles.userInfoContainer}>
          <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.phone}>{user.phoneNumber}</Text>
        </View>
      )}

      {/* Only show sections if profile is completed */}
      {user.profileCompleted ? (
        <>
          {/* Tab Switcher */}
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
              {infoLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={styles.loadingText}>{tProfile('loadingInfo')}</Text>
                </View>
              ) : !(user.email ||
                user.phoneNumber ||
                user.location ||
                (Array.isArray(user.categories) && user.categories.length > 0) ||
                (Array.isArray(user.skills) && user.skills.some(s => s.skill_name?.trim())) ||
                user.bio ||
                (Array.isArray(user.links) && user.links.some(link => link.trim()))
              ) ? (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="information-circle-outline" size={wp(12)} color={theme.textSecondary} />
                  <Text style={styles.emptyStateText}>
                    {tProfile('emptyInfo')}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('EditProfile', { user: user })}
                  >
                    <Text style={styles.editProfileText}>{tProfile('editProfile')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.infoContent}>
                  {/* Contact Information */}
                  {(!!user.email || !!user.phoneNumber) && (
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="mail-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('contactInfo')}</Text>
                      </View>
                      {!!user.email && (
                        <View style={styles.contactItem}>
                          <Ionicons name="mail" size={wp(4)} color={theme.textSecondary} />
                          <Text style={styles.contactText}>{user.email}</Text>
                        </View>
                      )}
                      {!!user.phoneNumber && (
                        <View style={styles.contactItem}>
                          <Ionicons name="call" size={wp(4)} color={theme.textSecondary} />
                          <Text style={styles.contactText}>{user.phoneNumber}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Location */}
                  {!!user.location && (
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="location-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('location')}</Text>
                      </View>
                      <View style={styles.contactItem}>
                        <Ionicons name="location" size={wp(4)} color={theme.textSecondary} />
                        <Text style={styles.contactText}>{user.location}</Text>
                      </View>
                    </View>
                  )}

                  {/* Categories */}
                  {Array.isArray(user.categories) && user.categories.length > 0 && (
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="grid-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('categories')}</Text>
                      </View>
                      <View style={styles.tagsContainer}>
                        {user.categories.map((category, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>
                              {getCategoryName(category)}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* About Section */}
                  {!!user.bio && (
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="person-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('about')}</Text>
                      </View>
                      <Text style={styles.cardContent}>{user.bio}</Text>
                    </View>
                  )}

                  {/* Skills */}
                  {Array.isArray(user.skills) &&
                    user.skills.some(s => s.skill_name?.trim()) && (
                      <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                          <Ionicons name="star-outline" size={wp(5)} color={theme.primary} />
                          <Text style={styles.cardTitle}>{tProfile('skills')}</Text>
                        </View>
                        {user.skills.map((skill, index) => {
                          if (!skill.skill_name?.trim()) return null;
                          return (
                            <View key={index} style={styles.skillItem}>
                              <View style={styles.skillHeader}>
                                <Text style={styles.skillName}>{skill.skill_name}</Text>
                                {skill.skill_level && (
                                  <View style={[styles.skillLevel, { backgroundColor: getSkillLevelColor(skill.skill_level) + '20' }]}>
                                    <Text style={[styles.skillLevelText, { color: getSkillLevelColor(skill.skill_level) }]}>
                                      {skill.skill_level}
                                    </Text>
                                  </View>
                                )}
                              </View>
                              {skill.skill_description && (
                                <Text style={styles.skillDescription}>
                                  {skill.skill_description}
                                </Text>
                              )}
                            </View>
                          );
                        })}
                      </View>
                    )}

                  {/* Links */}
                  {Array.isArray(user.links) &&
                    user.links.some(link => link.trim()) && (
                      <View style={styles.infoCard}>
                        <View style={styles.cardHeader}>
                          <Ionicons name="link-outline" size={wp(5)} color={theme.primary} />
                          <Text style={styles.cardTitle}>{tProfile('links')}</Text>
                        </View>
                        {user.links.map((link, index) => {
                          if (!link.trim()) return null;
                          return (
                            <TouchableOpacity
                              key={index}
                              style={styles.linkItem}
                              onPress={() => openSafeLink(link)}
                            >
                              <Ionicons name="link" size={wp(4)} color={theme.primary} />
                              <Text style={styles.linkText} numberOfLines={1}>
                                {link}
                              </Text>
                              <Ionicons name="chevron-forward" size={wp(4)} color={theme.textSecondary} />
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}

                  {/* Reviews - Only show for providers */}
                  {user.userType === 'provider' && (
                    <View style={styles.infoCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name="star-outline" size={wp(5)} color={theme.primary} />
                        <Text style={styles.cardTitle}>{tProfile('review')}</Text>
                        <TouchableOpacity 
                          style={styles.viewAllButton} 
                          onPress={() => navigation.navigate('ReviewScreen', { user })}
                        >
                          <Text style={[styles.viewAllText, { color: theme.primary }]}>{tProfile('viewAll')}</Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.reviewContainer}>
                        <Text style={[styles.reviewRating, { color: theme.textPrimary }]}>
                          {user.rating ? user.rating.toFixed(1) : '0.0'}
                        </Text>
                        <View style={styles.reviewStarsRow}>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Ionicons 
                              key={i} 
                              name={i < Math.floor(user.rating || 0) ? "star" : "star-outline"} 
                              size={24} 
                              color="#FFD700" 
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
          
          {selectedTab === 'posts' && (
            <View style={styles.postsSection}>
              {postsLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={theme.primary} />
                  <Text style={styles.loadingText}>{tProfile('loadingPosts')}</Text>
                </View>
              ) : userPosts.length > 0 ? (
                <View>
                  {userPosts.map((post, index) => (
                    <PostUserCard
                      key={post.id}
                      post={post}
                      isActive={false} // Disable auto-play for all videos in profile
                      isLiked={post.isLiked}
                      likesCount={post.likesCount}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="grid-outline" size={wp(12)} color={theme.textSecondary} />
                  <Text style={styles.emptyStateText}>
                    {tProfile('noPostsYet')}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={styles.createPostText}>{tProfile('createFirstPost')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </>
      ) : (
        // If not completed, only show the button
        <View style={styles.buttonWrapper}>
          <Button onPress={handleCompleteProfile}>
            {tProfile('completeYourProfile')}
          </Button>
        </View>
      )}

      {/* Add Content Modal */}
      <AddContentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddPost={() => navigation.navigate('AddPost')}
        onAddReel={() => navigation.navigate('AddReel')}
        position="center"
      />
    </ScrollView>
  );
};

export default Profile;

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    alignItems: 'center',
    marginVertical: hp(2.5),
    paddingHorizontal: wp(5),
  },
  avatar: {
    width: wp(25),
    height: wp(25),
    borderRadius: wp(12.5),
    backgroundColor: theme.border,
    marginBottom: hp(1.5),
    borderWidth: 2,
  },
  name: {
    fontSize: wp(5),
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginBottom: hp(0.5),
  },
  phone: {
    fontSize: wp(4),
    color: theme.textSecondary,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp(2.5),
    paddingHorizontal: wp(5),
  },
  profilePic: {
    width: wp(17.5),
    height: wp(17.5),
    borderRadius: wp(8.75),
    backgroundColor: theme.border,
    borderWidth: 2,
    marginRight: wp(7),
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
  userInfoContainer: {
    paddingHorizontal: wp(5),
    marginBottom: hp(2),
  },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: theme.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.5),
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: theme.primary,
  },
  tabIcon: {
    color: theme.textSecondary,
  },
  activeTabIcon: {
    color: theme.primary,
  },
  infoSection: {
    flex: 1,
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },
  postsSection: {
    flex: 1,
    // No padding for posts section to allow full-width display
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
  infoContent: {
    marginTop: hp(1),
  },
  infoCard: {
    backgroundColor: theme.cardBackground,
    borderRadius: wp(3),
    marginBottom: hp(2),
    padding: wp(4),
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
    marginBottom: hp(2),
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: '700',
    color: theme.textPrimary,
    marginLeft: wp(3),
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
    marginTop: hp(0.5),
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp(1.2),
    borderBottomWidth: 1,
    borderBottomColor: theme.border + '30',
  },
  linkText: {
    fontSize: wp(4),
    color: theme.primary,
    marginLeft: wp(3),
    flex: 1,
  },
  buttonWrapper: {
    marginTop: hp(10),
    paddingHorizontal: wp(5),
  },
  editProfileText: {
    color: theme.primary,
    fontSize: wp(4),
    fontWeight: '600',
  },
  createPostText: {
    color: theme.primary,
    fontSize: wp(4),
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: hp(10),
    paddingHorizontal: wp(5),
  },
  loadingText: {
    color: theme.textSecondary,
    marginTop: hp(2),
    fontSize: wp(4),
  },
  centeredText: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  viewAllButton: {
    marginLeft: 'auto',
  },
  viewAllText: {
    fontSize: wp(3.5),
    fontWeight: '600',
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
});
