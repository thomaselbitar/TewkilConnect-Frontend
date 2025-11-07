import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const LikesUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { tPosts, tCommon } = useTranslation();

  const { postId, likesCount } = route.params || {};

  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Set up header options like RequestDetailsScreen
  useLayoutEffect(() => {
    navigation.setOptions({
      title: tPosts('likes'),
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: {
        color: theme.textPrimary,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 16 }}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, tPosts]);

  // Mock data for likes - replace with actual API call
  const mockLikes = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      profileImage: 'https://via.placeholder.com/50',
      userType: 'user',
      likedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      profileImage: 'https://via.placeholder.com/50',
      userType: 'provider',
      likedAt: '2024-01-15T09:15:00Z',
    },
    {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      profileImage: 'https://via.placeholder.com/50',
      userType: 'user',
      likedAt: '2024-01-15T08:45:00Z',
    },
    {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      profileImage: 'https://via.placeholder.com/50',
      userType: 'provider',
      likedAt: '2024-01-15T07:20:00Z',
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Brown',
      profileImage: 'https://via.placeholder.com/50',
      userType: 'user',
      likedAt: '2024-01-15T06:10:00Z',
    },
  ];

  useEffect(() => {
    fetchLikes();
  }, [postId]);

  const fetchLikes = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLikes(mockLikes);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLikes();
    setRefreshing(false);
  };

  const formatLikedTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now - date;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (date.getFullYear() === now.getFullYear()) {
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    }
    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
  };

  const handleProfilePress = (user) => {
    // Navigate to the user's profile screen
    navigation.navigate('ProviderProfile', {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        userType: user.userType,
        // Add other user data as needed
      }
    });
  };

  const renderLikeItem = ({ item }) => {
    const borderColor = item.userType === 'provider' ? theme.success : theme.primary;
    
    return (
      <TouchableOpacity 
        style={[styles.likeItem, { borderBottomColor: theme.border }]}
        onPress={() => handleProfilePress(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: item.profileImage }}
          style={[styles.profileImage, { borderColor, borderWidth: 2 }]}
        />
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color={theme.textSecondary} />
      <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
        {tPosts('noLikesYet')}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {tPosts('beTheFirstToLike')}
      </Text>
    </View>
  );

  const renderLikesCount = () => (
    <View style={[styles.likesCountContainer, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Text style={[styles.likesCountText, { color: theme.textPrimary }]}>
        {likesCount} {tPosts('likesCount')}
      </Text>
    </View>
  );


  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            {tPosts('loadingLikes')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {renderLikesCount()}
      <FlatList
        data={likes}
        keyExtractor={(item) => item.id}
        renderItem={renderLikeItem}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  likesCountContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  likesCountText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContainer: {
    flexGrow: 1,
  },
  likeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LikesUserScreen;
