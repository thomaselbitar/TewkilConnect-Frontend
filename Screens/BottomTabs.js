import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from './Home';
import Profile from '././Profile/Profile';
import Request from './UserRequestDisplay/RequestDisplayScreen';
import Discover from './Discover/DiscoverScreen';
import PostScreen from './Posts/PostScreen';
import { GlobalStyles } from '../constants/Styles';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from '../hooks/useTranslation';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const requestCount = 11; // Replace with actual logic
  const { theme } = useTheme();
  const { tTabs } = useTranslation();
  const styles = createStyles(theme);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused, color }) => {
          let label;
          switch (route.name) {
            case 'Home':
              label = tTabs('home');
              break;
            case 'Request':
              label = tTabs('request');
              break;
            case 'Discover':
              label = tTabs('discover');
              break;
            case 'Post':
              label = tTabs('post');
              break;
            case 'Profile':
              label = tTabs('profile');
              break;
            default:
              label = route.name;
          }
          return (
            <Text style={{ color, fontSize: 12, fontWeight: focused ? '600' : '400' }}>
              {label}
            </Text>
          );
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Request':
              iconName = focused ? 'send' : 'send-outline';
              break;
            case 'Discover':
              iconName = focused ? 'compass' : 'compass-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Message':
              iconName = focused ? 'mail' : 'mail-outline';
              break;
            case 'Post':
              iconName = focused ? 'create' : 'create-outline';
              break;
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
              {route.name === 'Request' && requestCount > 0 && (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>
                    {requestCount > 9 ? '9+' : requestCount}
                  </Text>
                </View>
              )}
            </View>
          );
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
        },
        headerShown: false,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Home" component={Home} options={{ headerShown: true, headerTitle: tTabs('home') }} />
      <Tab.Screen name="Request" component={Request} options={{ headerShown: true, headerTitle: tTabs('request') }} />
      <Tab.Screen name="Discover" component={Discover} options={{ headerShown: true, headerTitle: tTabs('discover') }} />
      <Tab.Screen name="Post" component={PostScreen} options={{ headerShown: true, headerTitle: tTabs('post') }} />
      <Tab.Screen name="Profile" component={Profile} options={{ headerShown: true, headerTitle: tTabs('profile') }} />
    </Tab.Navigator>
  );
}

const createStyles = (theme) => StyleSheet.create({
  badgeContainer: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: theme.error,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: theme.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
});
