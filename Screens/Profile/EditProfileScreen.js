import React, { useState, useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  BackHandler,
  Keyboard
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import Entypo from '@expo/vector-icons/Entypo';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import { categories, getCategoryTranslation } from '../../Data/CategoryandTag';
import { lebaneseCities } from '../../Data/LocationData';
import Button from '../../components/UI/Button';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';


const EditProfileScreen = () => {
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

  // Get user data from route params (passed from Profile page)
  const userData = route?.params?.user || {
    firstName: 'Tommy',
    lastName: 'Bitar',
    email: '',
    profileImage: null,
    userType: 'provider',
    bio: 'Professional service provider',
    categories: [], // Categories will be set by user selection
    skills: [
      { skill_name: 'House Cleaning', skill_description: 'Professional cleaning services', skill_level: 'Expert' }
    ],
    links: ['https://example.com'],
    phoneNumber: '+961 70 123 456',
    location: 'Beirut',
  };

  const [editing, setEditing] = useState({});
  const [profileImage, setProfileImage] = useState(userData.profileImage);
  const [firstName, setFirstName] = useState(userData.firstName);
  const [lastName, setLastName] = useState(userData.lastName);
  const [email, setEmail] = useState(userData.email);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState(userData.bio);
  // Convert category titles or IDs to IDs for proper selection state
  const getCategoryIdsFromUserData = (userCategories) => {
    if (!Array.isArray(userCategories)) return [];
    
    return userCategories.map(category => {
      // If it's already an ID (string number), return it
      if (typeof category === 'string' && /^\d+$/.test(category)) {
        return category;
      }
      
      // If it's a title, find the corresponding ID
      const foundCategory = categories.find(cat => cat.title === category);
      return foundCategory ? foundCategory.id : null;
    }).filter(Boolean);
  };

  const [selectedCategories, setSelectedCategories] = useState(getCategoryIdsFromUserData(userData.categories));

  // Update selectedCategories when userData changes
  useEffect(() => {
    setSelectedCategories(getCategoryIdsFromUserData(userData.categories));
  }, [userData.categories]);
  const [skills, setSkills] = useState(userData.skills.length > 0 ? userData.skills : [
    { skill_name: '', skill_description: '', skill_level: '' },
  ]);
  const [links, setLinks] = useState(userData.links.length > 0 ? userData.links : ['']);
  const [selectedLocation, setSelectedLocation] = useState(userData.location || '');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          tProfile('cancel'),
          tProfile('cancelConfirm'),
          [
            { text: tProfile('no'), style: 'cancel' },
            {
              text: tProfile('yes'),
              style: 'destructive',
              onPress: () => navigation.goBack(),
            },
          ],
          { cancelable: true }
        );
        return true;
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(tProfile('permissionDenied'), tProfile('mediaLibraryAccessRequired'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert(tProfile('error'), tProfile('imagePickFailed'));
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      tProfile('profilePhoto'),
      tProfile('chooseAction'),
      [
        { text: tProfile('chooseFromLibrary'), onPress: pickImage },
        { text: tProfile('removePhoto'), onPress: () => setProfileImage(null), style: 'destructive' },
        { text: tProfile('cancel'), style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const toggleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const toggleCategory = (id) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories(prev => prev.filter(cat => cat !== id));
      if (id === 'other') setCustomCategory('');
    } else if (selectedCategories.length < 2) {
      setSelectedCategories(prev => [...prev, id]);
    } else {
      Alert.alert(tProfile('limitReached'), tProfile('maxCategoriesReached'));
    }
  };

  const updateSkill = (index, field, value) => {
    const updatedSkills = [...skills];
    updatedSkills[index][field] = value;
    setSkills(updatedSkills);
  };

  const addSkillField = () => {
    setSkills([...skills, { skill_name: '', skill_description: '', skill_level: '' }]);
  };

  const removeSkillField = (index) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
  };

  const updateLink = (index, value) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    setLinks([...links, '']);
  };

  const removeLinkField = (index) => {
    const newLinks = links.filter((_, i) => i !== index);
    setLinks(newLinks);
  };

  const handleSave = () => {
    // Email validation
    if (email && !isValidEmail(email)) {
      setEmailError(tProfile('validEmailRequired'));
      return;
    } else {
      setEmailError('');
    }

    // Password validation
    if (password && password !== confirmPassword) {
      Alert.alert(tProfile('error'), tProfile('passwordsDoNotMatch'));
      return;
    }

    // Provider validation (only if user is already a provider)
    if (userData.userType === 'provider') {
      if (selectedCategories.length === 0) {
        Alert.alert(tProfile('validationError'), tProfile('selectAtLeastOneCategory'));
        return;
      }
      if (skills.length === 0 || skills.some(s => !s.skill_name.trim())) {
        Alert.alert(tProfile('validationError'), tProfile('enterAtLeastOneSkill'));
        return;
      }
      if (!selectedLocation.trim()) {
        Alert.alert(tProfile('validationError'), tProfile('selectLocation'));
        return;
      }
    }

    const selectedTitles = selectedCategories.map(id => {
      const category = categories.find(cat => cat.id === id);
      return category ? category.title : null;
    }).filter(Boolean);

    const updatedProfile = {
      ...userData,
      firstName,
      lastName,
      email,
      password: password || undefined, // Only include if changed
      profileImage,
      bio: userData.userType === 'provider' ? bio : '',
      skills: userData.userType === 'provider' ? skills : [],
      links: userData.userType === 'provider' ? links : [],
      categories: userData.userType === 'provider' ? selectedTitles : [],
      location: selectedLocation,
      profileCompleted: true,
    };

    console.log('Saved profile:', updatedProfile);
    Keyboard.dismiss();
    Alert.alert(tProfile('profileSaved'), tProfile('profileUpdatedSuccessfully'), [
      {
        text: tProfile('ok'),
        onPress: () => {
          navigation.navigate('MainApp', { 
            screen: 'Profile', 
            params: { profile: updatedProfile } 
          });
        }
      }
    ]);
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
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              tProfile('cancel'),
              tProfile('cancelConfirm'),
              [
                { text: tProfile('no'), style: 'cancel' },
                { 
                  text: tProfile('yes'), 
                  style: 'destructive',
                  onPress: () => navigation.goBack()
                },
              ],
              { cancelable: true }
            );
          }}
          style={{ marginLeft: wp(4) }}
        >
          <Text style={styles.cancelText}>{tProfile('cancel')}</Text>
        </TouchableOpacity>
      ),
      gestureEnabled: false,
    });
  }, [navigation, theme]);

  const styles = createStyles(theme);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={hp(2)}
    >
      <ScrollView 
        contentContainerStyle={styles.scroll} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.imageWrapper}>
          <Image 
            source={profileImage ? { uri: profileImage } : require('../../assets/images/Profile/defaultProfile.jpg')} 
            style={styles.image} 
          />
          <TouchableOpacity style={styles.editIcon} onPress={showImageOptions}>
            <Entypo name="pencil" size={wp(5)} color={theme.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Basic Info - Always visible */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>{tProfile('firstName')}</Text>
            <TouchableOpacity onPress={() => toggleEdit('firstName')}>
              <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          {editing.firstName ? (
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <Text style={styles.valueText}>{firstName}</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>{tProfile('lastName')}</Text>
            <TouchableOpacity onPress={() => toggleEdit('lastName')}>
              <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          {editing.lastName ? (
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <Text style={styles.valueText}>{lastName}</Text>
          )}
        </View>

        {/* Email */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>{tProfile('emailOptional')}</Text>
            <TouchableOpacity onPress={() => toggleEdit('email')}>
              <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          {editing.email ? (
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (text && !isValidEmail(text)) {
                  setEmailError(tProfile('validEmailRequired'));
                } else {
                  setEmailError('');
                }
              }}
              keyboardType="email-address"
              placeholder={tProfile('emailPlaceholder')}
              placeholderTextColor={theme.textSecondary}
            />
          ) : (
            <Text style={styles.valueText}>{email || tProfile('notSet')}</Text>
          )}
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        {/* Password Change */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>{tProfile('changePassword')}</Text>
            <TouchableOpacity onPress={() => toggleEdit('password')}>
              <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
            </TouchableOpacity>
          </View>
          {editing.password ? (
            <>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder={tProfile('newPassword')}
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder={tProfile('confirmNewPassword')}
                placeholderTextColor={theme.textSecondary}
                secureTextEntry
              />
            </>
          ) : (
            <Text style={styles.valueText}>••••••••</Text>
          )}
        </View>

        {/* Provider-specific sections - Only show if user is already a provider */}
        {userData.userType === 'provider' && (
          <>
            {/* Bio */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{tProfile('bio')}</Text>
                <TouchableOpacity onPress={() => toggleEdit('bio')}>
                  <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              {editing.bio ? (
                <TextInput 
                  style={[styles.input, styles.bioInput]} 
                  multiline 
                  value={bio} 
                  onChangeText={setBio}
                  placeholder={tProfile('tellUsMore')}
                  placeholderTextColor={theme.textSecondary}
                />
              ) : (
                <Text style={styles.valueText}>{bio || tProfile('notSet')}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{tProfile('location')}</Text>
                <TouchableOpacity onPress={() => toggleEdit('location')}>
                  <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              {editing.location ? (
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setShowLocationDropdown(!showLocationDropdown)}
                  >
                    <Text style={[styles.dropdownText, !selectedLocation && styles.placeholderText]}>
                      {selectedLocation || tProfile('selectLocation')}
                    </Text>
                    <Ionicons 
                      name={showLocationDropdown ? "chevron-up" : "chevron-down"} 
                      size={wp(4)} 
                      color={theme.textSecondary} 
                    />
                  </TouchableOpacity>
                  
                  {showLocationDropdown && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                        {lebaneseCities.map((city, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.dropdownItem,
                              selectedLocation === city && styles.selectedDropdownItem
                            ]}
                            onPress={() => {
                              setSelectedLocation(city);
                              setShowLocationDropdown(false);
                            }}
                          >
                            <Text style={[
                              styles.dropdownItemText,
                              selectedLocation === city && styles.selectedDropdownItemText
                            ]}>
                              {city}
                            </Text>
                            {selectedLocation === city && (
                              <Ionicons 
                                name="checkmark" 
                                size={wp(4)} 
                                color={theme.primary} 
                              />
                            )}
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.valueText}>{selectedLocation || tProfile('notSet')}</Text>
              )}
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{tProfile('categories')}</Text>
                <TouchableOpacity onPress={() => toggleEdit('categories')}>
                  <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              {editing.categories ? (
                <View>
                  <Text style={styles.subLabel}>{tProfile('selectCategories')}</Text>
                  <View style={styles.categoryList}>
                    {categories.map(cat => (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryItem, 
                          selectedCategories.includes(cat.id) && styles.selectedCategory
                        ]}
                        onPress={() => toggleCategory(cat.id)}
                      >
                        <View style={styles.categoryContent}>
                          <Ionicons 
                            name={cat.iconName} 
                            size={wp(5)} 
                            color={selectedCategories.includes(cat.id) ? theme.background : theme.primary} 
                          />
                          <Text style={[
                            styles.categoryText,
                            selectedCategories.includes(cat.id) && styles.selectedCategoryText
                          ]}>
                            {getCategoryName(cat.id)}
                          </Text>
                        </View>
                        {selectedCategories.includes(cat.id) && (
                          <Ionicons 
                            name="checkmark-circle" 
                            size={wp(4.5)} 
                            color={theme.background} 
                            style={styles.checkIcon}
                          />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ) : (
                <Text style={styles.valueText}>
                  {selectedCategories.length > 0 ? selectedCategories.map(id => getCategoryName(id)).join(', ') : tProfile('notSet')}
                </Text>
              )}
            </View>

            {/* Skills */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{tProfile('skills')}</Text>
                <TouchableOpacity onPress={() => toggleEdit('skills')}>
                  <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              {editing.skills ? (
                <>
                  {skills.map((skill, index) => (
                    <View key={index} style={styles.skillContainer}>
                      <TextInput 
                        style={styles.input} 
                        value={skill.skill_name} 
                        placeholder={tProfile('skillName')} 
                        placeholderTextColor={theme.textSecondary}
                        onChangeText={(text) => updateSkill(index, 'skill_name', text)} 
                      />
                      <TextInput 
                        style={styles.input} 
                        value={skill.skill_description} 
                        placeholder={tProfile('skillDescription')} 
                        placeholderTextColor={theme.textSecondary}
                        onChangeText={(text) => updateSkill(index, 'skill_description', text)} 
                      />
                      <View style={styles.levelContainer}>
                        {[tProfile('beginner'), tProfile('intermediate'), tProfile('advanced')].map((level) => (
                          <TouchableOpacity
                            key={level}
                            style={[styles.levelButton, skill.skill_level === level && styles.selectedLevelButton]}
                            onPress={() => updateSkill(index, 'skill_level', level)}
                          >
                            <Text style={[styles.levelText, skill.skill_level === level && styles.selectedLevelText]}>
                              {level}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      {skills.length > 1 && (
                        <TouchableOpacity onPress={() => removeSkillField(index)}>
                          <Text style={styles.removeText}>{tProfile('removeSkill')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity onPress={addSkillField}>
                    <Text style={styles.addText}>{tProfile('addAnotherSkill')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  {skills.length > 0 && skills.some(s => s.skill_name?.trim()) ? (
                    skills.map((skill, index) => {
                      if (!skill.skill_name?.trim()) return null;
                      return (
                        <View key={index} style={styles.skillItem}>
                          <Text style={styles.valueText}>
                            {skill.skill_name}
                            {skill.skill_level ? ` (${skill.skill_level})` : ''}
                          </Text>
                          {skill.skill_description ? (
                            <Text style={styles.skillDescription}>
                              {skill.skill_description}
                            </Text>
                          ) : null}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.valueText}>{tProfile('noSkillsAdded')}</Text>
                  )}
                </View>
              )}
            </View>

            {/* Links */}
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>{tProfile('links')}</Text>
                <TouchableOpacity onPress={() => toggleEdit('links')}>
                  <Ionicons name="create-outline" size={wp(5)} color={theme.textPrimary} />
                </TouchableOpacity>
              </View>
              {editing.links ? (
                <>
                  {links.map((link, index) => (
                    <View key={index} style={styles.linkContainer}>
                      <TextInput 
                        style={styles.input} 
                        value={link} 
                        placeholder={tProfile('enterLink')} 
                        placeholderTextColor={theme.textSecondary}
                        onChangeText={(text) => updateLink(index, text)} 
                      />
                      {links.length > 1 && (
                        <TouchableOpacity onPress={() => removeLinkField(index)}>
                          <Text style={styles.removeText}>{tProfile('removeLink')}</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                  <TouchableOpacity onPress={addLinkField}>
                    <Text style={styles.addText}>{tProfile('addAnotherLink')}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  {links.length > 0 && links.some(link => link.trim()) ? (
                    links.map((link, index) => {
                      if (!link.trim()) return null;
                      return (
                        <Text key={index} style={[styles.valueText, styles.linkText]}>
                          {link}
                        </Text>
                      );
                    })
                  ) : (
                    <Text style={styles.valueText}>{tProfile('noLinksAdded')}</Text>
                  )}
                </View>
              )}
            </View>
          </>
        )}

        <View style={styles.buttonContainer}>
          <Button onPress={handleSave}>{tProfile('saveChanges')}</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen;

const createStyles = (theme) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.background 
  },
  scroll: { 
    padding: wp(5), 
    paddingBottom: hp(10) 
  },
  imageWrapper: { 
    alignItems: 'center', 
    marginBottom: hp(2),
    position: 'relative'
  },
  image: { 
    width: wp(30), 
    height: wp(30), 
    borderRadius: wp(15), 
    borderWidth: 2, 
    borderColor: theme.primary,
    backgroundColor: theme.border,
  },
  editIcon: { 
    position: 'absolute', 
    bottom: 0, 
    right: wp(35), 
    backgroundColor: theme.cardBackground, 
    padding: wp(1.5), 
    borderRadius: wp(5), 
    borderWidth: 1,
    borderColor: theme.textPrimary,
  },
  cancelText: {
    color: theme.textPrimary, 
    fontSize: wp(4), 
    fontWeight: '500'
  },
  section: { 
    marginBottom: hp(2),
    paddingBottom: hp(2),
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  rowBetween: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: hp(1),
  },
  label: { 
    fontSize: wp(4.2), 
    fontWeight: '600',
    color: theme.textPrimary,
  },
  subLabel: {
    fontSize: wp(3.8),
    color: theme.textSecondary,
    marginBottom: hp(1.5),
    fontWeight: '500',
  },
  valueText: {
    fontSize: wp(4),
    color: theme.textPrimary,
    paddingVertical: hp(1),
    lineHeight: hp(2.5),
  },
  input: { 
    borderWidth: 1, 
    borderColor: theme.border, 
    borderRadius: wp(2), 
    padding: wp(3), 
    marginTop: hp(1), 
    marginBottom: hp(1.5),
    fontSize: wp(4),
    color: theme.textPrimary,
    backgroundColor: theme.cardBackground,
  },
  inputError: { 
    borderColor: theme.error 
  },
  errorText: { 
    color: theme.error, 
    fontSize: wp(3.2), 
    marginTop: -hp(0.5), 
    marginBottom: hp(1) 
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2.5),
    marginBottom: hp(2),
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(3),
    backgroundColor: theme.cardBackground,
    borderRadius: wp(2.5),
    borderWidth: 1,
    borderColor: theme.border,
    width: '48%',
    marginBottom: hp(1),
  },
  selectedCategory: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryText: {
    marginLeft: wp(2),
    fontSize: wp(3.5),
    color: theme.textPrimary,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: theme.background,
  },
  checkIcon: {
    marginLeft: wp(2),
  },
  skillContainer: {
    marginBottom: hp(2),
  },
  levelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
    gap: wp(2),
  },
  levelButton: {
    flex: 1,
    paddingVertical: hp(1.2),
    borderRadius: wp(2),
    backgroundColor: theme.cardBackground,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  selectedLevelButton: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  levelText: {
    fontSize: wp(3.5),
    color: theme.textPrimary,
    fontWeight: '500',
  },
  selectedLevelText: {
    color: theme.background,
    fontWeight: 'bold',
  },
  bioInput: {
    height: hp(10),
    textAlignVertical: 'top',
  },
  linkContainer: {
    marginBottom: hp(2),
  },
  removeText: { 
    color: theme.error, 
    marginTop: hp(1),
    fontSize: wp(3.5),
    fontWeight: '500',
  },
  addText: { 
    color: theme.primary, 
    marginBottom: hp(2),
    fontSize: wp(4),
    fontWeight: '600',
  },
  skillItem: {
    marginBottom: hp(1.5),
  },
  skillDescription: {
    marginLeft: wp(2.5),
    fontSize: wp(3.5),
    color: theme.textSecondary,
    marginTop: hp(0.5),
    lineHeight: hp(2.2),
  },
  linkText: {
    color: theme.primary,
    textDecorationLine: 'underline',
  },
  buttonContainer: {
    marginBottom: hp(5),
  },
  dropdownContainer: {
    position: 'relative',
    marginBottom: hp(2),
  },
  dropdownButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.border,
    padding: wp(3),
    borderRadius: wp(2),
    backgroundColor: theme.cardBackground,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: wp(4),
    color: theme.textPrimary,
    flex: 1,
  },
  placeholderText: {
    color: theme.textSecondary,
  },
  dropdownList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: theme.cardBackground,
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: wp(2),
    maxHeight: hp(25),
    zIndex: 1000,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: wp(1),
  },
  dropdownScrollView: {
    maxHeight: hp(25),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: wp(3),
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  selectedDropdownItem: {
    backgroundColor: theme.primary + '20',
  },
  dropdownItemText: {
    fontSize: wp(4),
    color: theme.textPrimary,
    flex: 1,
  },
  selectedDropdownItemText: {
    color: theme.primary,
    fontWeight: '600',
  },
});
