import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/UI/SearchBar';
import { GlobalStyles } from '../../constants/Styles';
import { searchableUsers } from '../../Data/SearchData';
import ResultSearch from '../../components/Search/ResultSearch';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const SearchScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tSearch } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef();

  // Filter users based on search query
  const filteredUsers = searchableUsers.filter(user => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return true;
    
    return user.firstName.toLowerCase().includes(searchTerm) ||
           user.lastName.toLowerCase().includes(searchTerm);
  });

  // Search logic with spinner
  useEffect(() => {
    setIsSearching(true);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setIsSearching(false);
    }, 400); // 400ms search delay
    return () => clearTimeout(searchTimeout.current);
  }, [searchQuery]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: tSearch('title'),
      headerTitleAlign: 'center',
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
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, tSearch]);



  const handleUserPress = (user) => {
    // Navigate to user profile
    if (user.userType === 'provider') {
      navigation.navigate('ProviderProfile', { provider: user });
    } else {
      navigation.navigate('Profile', { profile: user });
    }
  };

  const renderUserCard = ({ item }) => {
    return (
      <ResultSearch 
        user={item} 
        onPress={handleUserPress}
      />
    );
  };

  const styles = createStyles(theme);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
                   <SearchBar
             placeholder={tSearch('placeholder')}
             value={searchQuery}
             onChangeText={setSearchQuery}
             onSubmitEditing={() => {}}
           />
        </View>

               {/* Search Results or Empty State */}
         <View style={styles.contentContainer}>
           {searchQuery.length === 0 ? (
             <View style={styles.emptyState}>
               <Ionicons name="search-outline" size={64} color={theme.textSecondary} />
               <Text style={styles.emptyStateText}>{tSearch('emptyState.title')}</Text>
               <Text style={styles.emptyStateSubText}>{tSearch('emptyState.subtitle')}</Text>
             </View>
           ) : isSearching ? (
             <View style={styles.loadingContainer}>
               <ActivityIndicator size="small" color={theme.primary} />
               <Text style={styles.loadingText}>{tSearch('searching')}</Text>
             </View>
           ) : filteredUsers.length > 0 ? (
             <FlatList
               data={filteredUsers}
               keyExtractor={(item) => item.id}
               renderItem={renderUserCard}
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.resultsList}
             />
           ) : (
             <View style={styles.noResultsContainer}>
               <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
               <Text style={styles.noResultsText}>{tSearch('noResults.title')}</Text>
               <Text style={styles.noResultsSubText}>{tSearch('noResults.subtitle')}</Text>
             </View>
           )}
         </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.primary,
  },
  resultsList: {
    paddingTop: 8,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    paddingHorizontal: 40,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  noResultsSubText: {
    fontSize: 14,
    color: theme.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default SearchScreen;
