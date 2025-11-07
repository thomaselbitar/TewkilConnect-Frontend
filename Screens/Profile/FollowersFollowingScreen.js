import React, { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { sampleUsers } from '../../Data/Data';
import { useRoute, useNavigation } from '@react-navigation/native';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const FollowersFollowingScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tProfile } = useTranslation();

  const TABS = [
    { key: 'followers', label: tProfile('followers') },
    { key: 'following', label: tProfile('following') },
  ];
  const initialTab = route.params?.initialTab || 'followers';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [filteredFollowers, setFilteredFollowers] = useState(sampleUsers);
  const [filteredFollowing, setFilteredFollowing] = useState(sampleUsers);
  const searchTimeout = React.useRef();

  // For demo, use the same sampleUsers for both
  const followers = sampleUsers;
  const following = sampleUsers;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      gestureEnabled: false,
    });
  }, [navigation]);

  const showClear = search.length > 0;

  // Search logic
  React.useEffect(() => {
    setSearching(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const q = search.trim().toLowerCase();
      if (q === '') {
        setFilteredFollowers(followers);
        setFilteredFollowing(following);
      } else {
        setFilteredFollowers(
          followers.filter(u =>
            (`${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
             u.firstName.toLowerCase().includes(q) ||
             u.lastName.toLowerCase().includes(q))
          )
        );
        setFilteredFollowing(
          following.filter(u =>
            (`${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
             u.firstName.toLowerCase().includes(q) ||
             u.lastName.toLowerCase().includes(q))
          )
        );
      }
      setSearching(false);
    }, 400);
    return () => clearTimeout(searchTimeout.current);
  }, [search, activeTab]);

  const renderUser = ({ item }) => (
    <View style={styles.userRow}>
      <Image
        source={
          item.profileImage && typeof item.profileImage === 'string'
            ? { uri: item.profileImage }
            : item.profileImage || require('../../assets/images/Profile/defaultProfile.jpg')
        }
        style={[
          styles.avatar, 
          { 
            borderColor: item.userType === 'provider' ? 'green' : theme.primary, 
            borderWidth: 2 
          }
        ]} 
      />
      <View style={styles.userInfo}>
        <View style={styles.userDetails}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.type}>{item.userType}</Text>
        </View>
        {activeTab === 'followers' && (
          <View style={styles.followerActions}>
            {item.iFollow ? (
              <TouchableOpacity style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>{tProfile('message')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.actionBtn, styles.followBackBtn]}>
                <Text style={[styles.actionBtnText, styles.followBackBtnText]}>{tProfile('followBack')}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => {
                Alert.alert(
                  tProfile('removeFollower'),
                  `${tProfile('removeFollowerConfirm')} ${item.firstName} ${item.lastName}?`,
                  [
                    { text: tProfile('cancel'), style: 'cancel' },
                    { text: tProfile('remove'), style: 'destructive', onPress: () => {/* Remove logic here */} },
                  ]
                );
              }}
            >
              <Ionicons name="close" size={wp(5.5)} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
        {activeTab === 'following' && (
          <View style={styles.followerActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>{tProfile('message')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => {
                Alert.alert(
                  tProfile('unfollow'),
                  `${tProfile('unfollowConfirm')} ${item.firstName} ${item.lastName}?`,
                  [
                    { text: tProfile('cancel'), style: 'cancel' },
                    { text: tProfile('unfollow'), style: 'destructive', onPress: () => {/* Unfollow logic here */} },
                  ]
                );
              }}
            >
              <Ionicons name="close" size={wp(5.5)} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={wp(6)} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tProfile('followersAndFollowing')}</Text>
        <View style={{ width: wp(7.5) }} />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => { setActiveTab(tab.key); setSearch(''); }}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.activeTabLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={wp(5)} color={theme.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchBar}
            placeholder={activeTab === 'followers' ? tProfile('searchFollowers') : tProfile('searchFollowing')}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor={theme.textSecondary}
          />
          {showClear && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearIconBtn}>
              <Ionicons name="close-circle" size={wp(5)} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {/* Spinner under search bar when searching */}
      {searching && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
      
      {/* List or No Results */}
      {!searching && (
        (activeTab === 'followers' ? filteredFollowers : filteredFollowing).length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="people-outline" 
              size={wp(15)} 
              color={theme.textSecondary} 
            />
            <Text style={styles.emptyText}>
              {search.trim() ? tProfile('noResultsFound') : (activeTab === 'followers' ? tProfile('noFollowersToShow') : tProfile('noFollowingToShow'))}
            </Text>
          </View>
        ) : (
          <FlatList
            data={activeTab === 'followers' ? filteredFollowers : filteredFollowing}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={renderUser}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )
      )}
    </View>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: hp(6),
    paddingBottom: hp(2.5),
    paddingHorizontal: wp(5),
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  backBtn: {
    width: wp(7.5),
    height: wp(7.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: wp(4.5),
    fontWeight: 'bold',
    color: theme.textPrimary,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp(1.5),
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  tabLabel: {
    fontSize: wp(4),
    color: theme.textSecondary,
    fontWeight: '500',
  },
  activeTabLabel: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  searchBarWrapper: {
    paddingHorizontal: wp(5),
    marginBottom: hp(1.5),
    marginTop: hp(2),
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.cardBackground,
    borderRadius: wp(2),
    borderWidth: 1,
    borderColor: theme.border,
    paddingHorizontal: wp(2),
  },
  searchIcon: {
    marginRight: wp(1),
  },
  clearIconBtn: {
    marginLeft: wp(1),
  },
  searchBar: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingVertical: hp(1.5),
    fontSize: wp(4),
    borderWidth: 0,
    color: theme.textPrimary,
  },
  loadingContainer: {
    alignItems: 'center', 
    marginVertical: hp(3)
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: hp(15),
    paddingHorizontal: wp(5),
  },
  emptyText: {
    textAlign: 'center',
    color: theme.textSecondary,
    marginTop: hp(2),
    fontSize: wp(4),
  },
  listContainer: {
    padding: wp(4)
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2.5),
    backgroundColor: theme.cardBackground,
    borderRadius: wp(2.5),
    padding: wp(3),
    borderWidth: 1,
    borderColor: theme.border,
  },
  avatar: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    marginRight: wp(3.5),
    backgroundColor: theme.border,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetails: {
    flex: 1,
  },
  name: {
    fontSize: wp(4),
    fontWeight: '600',
    color: theme.textPrimary,
  },
  type: {
    fontSize: wp(3.2),
    color: theme.textSecondary,
    marginTop: hp(0.5),
  },
  followerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },
  actionBtn: {
    minWidth: wp(25),
    backgroundColor: theme.primary,
    borderRadius: wp(1.5),
    paddingVertical: hp(1.5),
    alignItems: 'center',
    marginLeft: wp(2),
  },
  actionBtnText: {
    color: theme.background,
    fontWeight: 'bold',
    fontSize: wp(3.5),
  },
  followBackBtn: {
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  followBackBtnText: {
    color: theme.primary,
  },
  removeBtn: {
    marginLeft: wp(2),
    padding: wp(1),
  },
  iconBtn: {
    marginLeft: wp(2),
    padding: wp(1),
  },
});

export default FollowersFollowingScreen; 