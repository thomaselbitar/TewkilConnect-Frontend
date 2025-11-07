import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import PostCard from '../../components/Card/PostCards/PostCard';
import AddContentModal from '../../components/Modal/AddContentModal';
import { samplePosts } from '../../Data/Data';
import { wp, hp } from '../../utils/helpers';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../../contexts/ThemeContext';

const PostScreen = () => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const viewabilityConfig = { itemVisiblePercentThreshold: 60 };
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems && viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerStyle: {
                backgroundColor: theme.background,
                borderBottomColor: theme.border,
                borderBottomWidth: 1,
            },
            headerTitleStyle: {
                color: theme.textPrimary,
            },
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{ marginRight: 8 }}
                >
                    <Ionicons name="add-outline" size={26} color={theme.textPrimary} />
                </TouchableOpacity>
            ),
        });
    }, [navigation, theme]);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setPosts(samplePosts);
            setLoading(false);
        }, 1200);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setPosts(samplePosts); // You can randomize or fetch new data here
            setRefreshing(false);
        }, 1200);
    };

    const onLikeToggle = (postId) => {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const isLiked = !post.isLiked;
                const likesCount = isLiked ? post.likesCount + 1 : post.likesCount - 1;
                return { ...post, isLiked, likesCount };
            }
            return post;
        }));
    };

    const renderPost = ({ item, index }) => (
        <PostCard
            post={item}
            isActive={index === activeIndex}
            isLiked={item.isLiked}
            likesCount={item.likesCount}
            onLikeToggle={() => onLikeToggle(item.id)}
            isFollowed={true} // All posts in PostScreen are from followed users
        />
    );

    if (loading) {
        return (
            <View style={[styles.spinnerContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={[...posts].sort((a, b) => {
                  const dateA = (typeof a.timestamp === 'string' || typeof a.timestamp === 'number') ? new Date(a.timestamp) : a.timestamp;
                  const dateB = (typeof b.timestamp === 'string' || typeof b.timestamp === 'number') ? new Date(b.timestamp) : b.timestamp;
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
            
            {/* Add Content Modal */}
            <AddContentModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onAddPost={() => navigation.navigate('AddPost')}
                onAddReel={() => navigation.navigate('AddReel')}
                position="center"
            />
        </View>
    )
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    spinnerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})