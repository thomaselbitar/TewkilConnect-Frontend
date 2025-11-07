import React, { useLayoutEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import CategoryItem from '../components/Category/CategoryItem';
import Button from '../components/UI/Button';
import { categories, getCategoryTranslation } from '../Data/CategoryandTag';
import { GlobalStyles } from '../constants/Styles';
import { useTranslation } from '../hooks/useTranslation';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tHome, tCategories } = useTranslation();

  const getCategoryText = (categoryTitle) => {
    return getCategoryTranslation(categoryTitle, tCategories);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingVertical: 20,
    },
    categoriesContainer: {
      
    },
    sectionTitleContainer: {
      marginHorizontal: 15,
      marginBottom: 10,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.textPrimary,
    },
    
    actionButtonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
      marginHorizontal: 15,
    },
    postRequestButton: {
      backgroundColor: theme.primary,
      flex: 1,
    },
    postRequestText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    createGroupWorkButton: {
      backgroundColor: theme.success,
      flex: 1,
    },
    createGroupWorkText: {
      color: theme.background,
      fontSize: 16,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    firstCategoryItem: {
      marginLeft: 15,
    },
  });

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
          {/* Heart Icon for Notifications */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Notification')}
            style={{ marginRight: 15 }}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons name="heart-outline" size={26} color={theme.textPrimary} />
              
              {/* Notification Badge */}
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: theme.error,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  minWidth: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.background, fontSize: 11, fontWeight: 'bold' }}>2</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Message Icon */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Message')}
            style={{ marginRight: 15 }}
          >
            <View style={{ position: 'relative' }}>
              <Ionicons name="mail-outline" size={26} color={theme.textPrimary} />

              {/* Badge */}
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  backgroundColor: theme.error,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                  paddingVertical: 1,
                  minWidth: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: theme.background, fontSize: 11, fontWeight: 'bold' }}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, theme]);


  return (
    <View style={styles.container}>

      {/* Action Buttons Container */}
      <View style={styles.actionButtonsContainer}>
        {/* Post Request Button */}
        <Button
          styleButton={styles.postRequestButton}
          styleText={styles.postRequestText}
          onPress={() => navigation.replace('CategorySelection')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="add-circle-outline" size={24} color="white" />
            <Text style={styles.postRequestText}>{tHome('postRequest')}</Text>
          </View>
        </Button>

        {/* Create Group Work Button */}
        <Button
          styleButton={styles.createGroupWorkButton}
          styleText={styles.createGroupWorkText}
          onPress={() => navigation.replace('CreateGroupWork')}
        >
          <View style={styles.buttonContent}>
            <Ionicons name="folder-open-outline" size={24} color="white" />
            <Text style={styles.createGroupWorkText}>{tHome('createGroupWork')}</Text>
          </View>
        </Button>
      </View>

      {/* Categories Section */}
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{tHome('categories')}</Text>
        </View>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={index === 0 ? styles.firstCategoryItem : null}>
              <CategoryItem
                title={getCategoryText(item.title)}
                iconName={item.iconName}
                onPress={() =>
                  navigation.navigate('CategoryDetails', {
                    categoryTitle: item.title,
                  })
                }
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default Home;
