import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GlobalStyles } from '../../constants/Styles';
import { wp, hp } from '../../utils/helpers';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'request_update',
      title: 'Request Status Updated',
      message: 'Your "Website Development" request is now In Progress',
      time: '2 hours ago',
      isRead: false,
      icon: 'checkmark-circle',
      iconColor: '#4CAF50',
    },
    {
      id: '2',
      type: 'message',
      title: 'New Message from Provider',
      message: 'Ahmed Hassan sent you a message about your request',
      time: '4 hours ago',
      isRead: false,
      icon: 'chatbubble',
      iconColor: '#2196F3',
    },
    {
      id: '3',
      type: 'system',
      title: 'Welcome to Our Platform',
      message: 'Thank you for joining! Explore our services and create your first request.',
      time: '1 day ago',
      isRead: true,
      icon: 'information-circle',
      iconColor: '#FF9800',
    },
    {
      id: '4',
      type: 'request_update',
      title: 'Request Completed',
      message: 'Your "Logo Design" request has been completed successfully',
      time: '2 days ago',
      isRead: true,
      icon: 'checkmark-done-circle',
      iconColor: '#4CAF50',
    },
    {
      id: '5',
      type: 'message',
      title: 'Provider Available',
      message: 'Sarah Johnson is now available for your project',
      time: '3 days ago',
      isRead: true,
      icon: 'person-add',
      iconColor: '#9C27B0',
    },
    {
      id: '6',
      type: 'system',
      title: 'App Update Available',
      message: 'A new version of the app is available with improved features',
      time: '1 week ago',
      isRead: true,
      icon: 'download',
      iconColor: '#607D8B',
    },
  ]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate refreshing notifications
    setTimeout(() => {
      // Update read status for unread notifications
      setNotifications(prevNotifications =>
        prevNotifications.map(notification =>
          !notification.isRead ? { ...notification, isRead: true } : notification
        )
      );
      setRefreshing(false);
      console.log('Notifications refreshed!');
    }, 1500);
  }, []);

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prevNotifications =>
      prevNotifications.map(n =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate based on notification type
    switch (notification.type) {
      case 'request_update':
        navigation.navigate('MainApp', { screen: 'Request' });
        break;
      case 'message':
        navigation.navigate('Message');
        break;
      case 'system':
        // System notifications don't navigate anywhere
        break;
      default:
        break;
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.isRead).length;
  };

  // Set header options with unread count badge
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        getUnreadCount() > 0 ? (
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{getUnreadCount()}</Text>
          </View>
        ) : null
      ),
    });
  }, [navigation, notifications]);

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.isRead && styles.unreadNotification
      ]}
      onPress={() => handleNotificationPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={item.iconColor} 
          />
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[
            styles.notificationTitle,
            !item.isRead && styles.unreadTitle
          ]}>
            {item.title}
          </Text>
          <Text style={styles.notificationMessage}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {item.time}
          </Text>
        </View>
        
        <Ionicons 
          name="chevron-forward" 
          size={16} 
          color="#ccc" 
          style={styles.chevron}
        />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="notifications-off" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! Check back later for new updates.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[GlobalStyles.colors.primary3]}
            tintColor={GlobalStyles.colors.primary3}
            title="Pull to refresh"
            titleColor={GlobalStyles.colors.primary1}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.primary2,
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  notificationItem: {
    backgroundColor: GlobalStyles.colors.primary2,
    borderRadius: 12,
    marginVertical: 6,
    padding: 16,
    borderWidth: 1,
    borderColor: GlobalStyles.colors.primary4,
  },
  unreadNotification: {
    backgroundColor: '#F8F9FF',
    borderColor: GlobalStyles.colors.primary3,
    borderWidth: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF4444',
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary2,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: GlobalStyles.colors.primary1,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: 'bold',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  chevron: {
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  headerBadge: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginRight: 15,
  },
  headerBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default NotificationScreen;
