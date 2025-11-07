// Screens/DiscoverScreen.js
import React, { useState, useLayoutEffect, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import PostCard from '../../components/Card/PostCards/PostCard';
import { discoverPosts } from '../../Data/DiscoverData';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tDiscover } = useTranslation();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const viewabilityConfig = { itemVisiblePercentThreshold: 60 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tDiscover('title'),
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.textPrimary,
      headerTitleStyle: { color: theme.textPrimary, fontWeight: '700' },
      headerShadowVisible: false,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="search-outline" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, tDiscover]);

  useEffect(() => {
    // Simulate loading
    const t = setTimeout(() => {
      setPosts(discoverPosts);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPosts(discoverPosts);
      setRefreshing(false);
    }, 1200);
  };

  const onLikeToggle = (postId) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          const likesCount = isLiked ? post.likesCount + 1 : post.likesCount - 1;
          return { ...post, isLiked, likesCount };
        }
        return post;
      })
    );
  };

  const onFollowToggle = (postId) => {
    console.log('Follow pressed for post:', postId);
  };

  const renderPost = ({ item, index }) => (
    <PostCard
      post={item}
      isActive={index === activeIndex}
      isLiked={item.isLiked}
      likesCount={item.likesCount}
      onLikeToggle={() => onLikeToggle(item.id)}
      isFollowed={false}
      onFollowToggle={() => onFollowToggle(item.id)}
    />
  );

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
        },
        spinnerContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        },
      }),
    [theme]
  );

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={[...posts].sort((a, b) => {
          const dateA =
            typeof a.timestamp === 'string' || typeof a.timestamp === 'number'
              ? new Date(a.timestamp)
              : a.timestamp;
          const dateB =
            typeof b.timestamp === 'string' || typeof b.timestamp === 'number'
              ? new Date(b.timestamp)
              : b.timestamp;
          return dateB - dateA;
        })}
        renderItem={renderPost}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewabilityConfig}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

export default DiscoverScreen;
