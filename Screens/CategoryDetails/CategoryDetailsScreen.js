// Screens/CategoryDetails.js
import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { providers, requests } from '../../Data/Data';
import ProviderCard from '../../components/Card/ProviderCards/ProviderCard';
import RequestCard from '../../components/Card/RequestCards/RequestCard';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const CategoryDetails = ({ route }) => {
  const { categoryTitle } = route.params;
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tProviders, tCategories, tCategoryDetails } = useTranslation();

  const getCategoryText = (categoryTitle) => {
    const categoryMap = {
      'Technician': tCategories('technician'),
      'Electrician': tCategories('electrician'),
      'Mechanic': tCategories('mechanic'),
      'IT Specialist': tCategories('itSpecialist'),
      'Hair Stylist': tCategories('hairStylist'),
      'Personal Trainer': tCategories('personalTrainer'),
      'Plumber': tCategories('plumber'),
      'Baby Sitter': tCategories('babySitter'),
      'Pet Groomer': tCategories('petGroomer'),
      'Mover': tCategories('mover'),
      'Gardener': tCategories('gardener'),
      'Nail Artist': tCategories('nailArtist'),
      'Spa Specialist': tCategories('spaSpecialist'),
      'Cleaner': tCategories('cleaner'),
      'AC Technician': tCategories('acTechnician'),
      'Makeup Artist': tCategories('makeupArtist'),
    };
    return categoryMap[categoryTitle] || categoryTitle;
  };

  const [activeTab, setActiveTab] = useState('providers'); // Default tab
  const [loading, setLoading] = useState(true); // Loading state
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: theme.background,
          paddingHorizontal: 10,
        },
        loaderContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.background,
        },
        tabContainer: {
          alignItems: 'center',
          marginVertical: 16,
          paddingHorizontal: 20,
        },
        tabBackground: {
          flexDirection: 'row',
          backgroundColor: theme.primary,
          borderRadius: 25,
          padding: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        tabButton: {
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 21,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 100,
        },
        activeTabButton: {
          backgroundColor: theme.background,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 2,
        },
        tabText: {
          fontSize: 15,
          color: theme.background, // text over primary pill
          fontWeight: '500',
        },
        activeTabText: {
          fontSize: 15,
          color: theme.textPrimary, // text over light/dark bg
          fontWeight: '600',
        },
        emptyText: {
          textAlign: 'center',
          marginTop: 20,
          fontSize: 16,
          color: theme.textSecondary,
        },
        loadingText: {
          marginTop: 10,
          fontSize: 16,
          color: theme.textPrimary,
          fontWeight: '500',
        },
        headerButton: {
          marginLeft: 16,
          padding: 4,
        },
      }),
    [theme]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: getCategoryText(categoryTitle),
      headerTitleAlign: 'center',
  
      // ✅ make header background follow theme
      headerStyle: { backgroundColor: theme.background },
  
      // ✅ make default nav items (back text/arrow) follow theme
      headerTintColor: theme.textPrimary,
  
      // ✅ make the title text follow theme
      headerTitleStyle: { color: theme.textPrimary, fontWeight: '700' },
  
      // optional: remove the light shadow line on iOS
      headerShadowVisible: false,
  
      // keep your custom back icon (now colored by theme too)
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, categoryTitle, theme, styles, getCategoryText]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5 second loading time

    return () => clearTimeout(timer);
  }, []);

  // Handle refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Filter providers and requests by category
  const filteredProviders = providers.filter((provider) => provider.category === categoryTitle);
  const filteredRequests = requests.filter((request) => request.category === categoryTitle);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{tCategoryDetails('loading')}</Text>
      </View>
    );
    }

  return (
    <View style={styles.container}>
      {/* Beautiful Tab Switcher */}
      <View style={styles.tabContainer}>
        <View style={styles.tabBackground}>
          <TouchableOpacity
            onPress={() => setActiveTab('providers')}
            style={[styles.tabButton, activeTab === 'providers' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'providers' && styles.activeTabText]}>{tCategoryDetails('providers')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('requests')}
            style={[styles.tabButton, activeTab === 'requests' && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === 'requests' && styles.activeTabText]}>{tCategoryDetails('requests')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {activeTab === 'providers' ? (
        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ProviderCard provider={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>{tProviders('noProvidersFound')}</Text>}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      ) : (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard request={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>{tProviders('noRequestsFound')}</Text>}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.primary]}
              tintColor={theme.primary}
            />
          }
        />
      )}
    </View>
  );
};

export default CategoryDetails;
