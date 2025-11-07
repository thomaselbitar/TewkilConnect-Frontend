import React, { useState, useLayoutEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    BackHandler,
    Keyboard
} from 'react-native';
import Button from '../../components/UI/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { wp, hp } from '../../utils/helpers';
import { GlobalStyles } from '../../constants/Styles';
import { categories, getCategoryTranslation } from '../../Data/CategoryandTag';
import { lebaneseCities } from '../../Data/LocationData';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const BecomeProviderScreen = () => {
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

    // Get current user data from route params
    const currentUser = route?.params?.user || {
        firstName: 'Tommy',
        lastName: 'Bitar',
        email: '',
        profileImage: null,
        phoneNumber: '+961 70 123 456',
    };

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [skills, setSkills] = useState([
        { skill_name: '', skill_description: '', skill_level: '' },
    ]);
    const [bio, setBio] = useState('');
    const [links, setLinks] = useState(currentUser.links?.length > 0 ? currentUser.links : ['']);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    tProfile('becomeProvider.cancel'),
                    tProfile('becomeProvider.cancelConfirm'),
                    [
                        { text: tProfile('becomeProvider.no'), style: 'cancel' },
                        {
                            text: tProfile('becomeProvider.yes'),
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
                            tProfile('becomeProvider.cancel'),
                            tProfile('becomeProvider.cancelConfirm'),
                            [
                                { text: tProfile('becomeProvider.no'), style: 'cancel' },
                                { 
                                    text: tProfile('becomeProvider.yes'), 
                                    style: 'destructive',
                                    onPress: () => navigation.goBack()
                                },
                            ],
                            { cancelable: true }
                        );
                    }}
                    style={{ marginLeft: wp(4) }}
                >
                    <Text style={styles.cancelText}>{tProfile('becomeProvider.cancel')}</Text>
                </TouchableOpacity>
            ),
            gestureEnabled: false,
        });
    }, [navigation, theme]);

    const toggleCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(prev => prev.filter(cat => cat !== id));
            if (id === 'other') setCustomCategory('');
        } else if (selectedCategories.length < 2) {
            setSelectedCategories(prev => [...prev, id]);
        } else {
            Alert.alert(tProfile('becomeProvider.limitReached'), tProfile('becomeProvider.selectUpTo2Categories'));
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

    const handleSubmit = () => {
        // Validation
        if (selectedCategories.length === 0) {
            Alert.alert(tProfile('becomeProvider.validationError'), tProfile('becomeProvider.selectAtLeastOneCategory'));
            return;
        }
        if (skills.length === 0 || skills.some(s => !s.skill_name.trim())) {
            Alert.alert(tProfile('becomeProvider.validationError'), tProfile('becomeProvider.enterAtLeastOneSkill'));
            return;
        }
        if (!selectedLocation.trim()) {
            Alert.alert(tProfile('becomeProvider.validationError'), tProfile('selectLocation'));
            return;
        }

        const selectedTitles = selectedCategories.map(id => {
            return getCategoryName(id);
        }).filter(Boolean);

        const updatedProfile = {
            ...currentUser,
            userType: 'provider',
            categories: selectedTitles,
            skills,
            bio,
            links,
            location: selectedLocation,
            profileCompleted: true,
        };

        console.log('Became Provider:', updatedProfile);
        Keyboard.dismiss();
        Alert.alert(tProfile('becomeProvider.success'), tProfile('becomeProvider.nowProvider'), [
          {
            text: tProfile('becomeProvider.ok'),
            onPress: () => {
              navigation.navigate('MainApp', { 
                screen: 'Profile', 
                params: { profile: updatedProfile } 
              });
            }
          }
        ]);
    };

    const styles = createStyles(theme);

    return (
        <KeyboardAvoidingView
            style={styles.fullScreen}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={hp(2)}
        >
            <ScrollView 
                contentContainerStyle={styles.container} 
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>{tProfile('becomeProvider.title')}</Text>
                    <Text style={styles.subtitle}>{tProfile('becomeProvider.subtitle')}</Text>
                </View>

                <Text style={styles.label}>{tProfile('becomeProvider.selectCategories')}</Text>
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

                <Text style={styles.label}>{tProfile('skills')}</Text>
                {skills.map((skill, index) => (
                    <View key={index} style={styles.skillContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={tProfile('becomeProvider.skillName')}
                            placeholderTextColor={theme.textSecondary}
                            value={skill.skill_name}
                            onChangeText={(text) => updateSkill(index, 'skill_name', text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={tProfile('becomeProvider.skillDescription')}
                            placeholderTextColor={theme.textSecondary}
                            value={skill.skill_description}
                            onChangeText={(text) => updateSkill(index, 'skill_description', text)}
                        />
                        <View style={styles.levelContainer}>
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    style={[styles.levelButton, skill.skill_level === level && styles.selectedLevelButton]}
                                    onPress={() => updateSkill(index, 'skill_level', level)}
                                >
                                    <Text style={[styles.levelText, skill.skill_level === level && styles.selectedLevelText]}>
                                        {level === 'Beginner' ? tProfile('becomeProvider.beginner') : 
                                         level === 'Intermediate' ? tProfile('becomeProvider.intermediate') : 
                                         tProfile('becomeProvider.advanced')}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        {skills.length > 1 && (
                            <TouchableOpacity onPress={() => removeSkillField(index)}>
                                <Text style={styles.removeText}>{tProfile('becomeProvider.removeSkill')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                <TouchableOpacity onPress={addSkillField}>
                    <Text style={styles.addText}>{tProfile('becomeProvider.addAnotherSkill')}</Text>
                </TouchableOpacity>

                <Text style={styles.label}>{tProfile('becomeProvider.shortBio')}</Text>
                <TextInput
                    style={[styles.input, styles.bioInput]}
                    placeholder={tProfile('becomeProvider.tellUsMore')}
                    placeholderTextColor={theme.textSecondary}
                    value={bio}
                    onChangeText={setBio}
                    multiline
                />

                <Text style={styles.label}>{tProfile('location')}</Text>
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

                <Text style={styles.label}>{tProfile('links')}</Text>
                {links.map((link, index) => (
                    <View key={index} style={styles.linkContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder={tProfile('becomeProvider.enterLink')}
                            placeholderTextColor={theme.textSecondary}
                            value={link}
                            onChangeText={(text) => updateLink(index, text)}
                        />
                        {links.length > 1 && (
                            <TouchableOpacity onPress={() => removeLinkField(index)}>
                                <Text style={styles.removeText}>{tProfile('becomeProvider.removeLink')}</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                ))}
                <TouchableOpacity onPress={addLinkField}>
                    <Text style={styles.addText}>{tProfile('becomeProvider.addAnotherLink')}</Text>
                </TouchableOpacity>

                <View style={styles.buttonContainer}>
                    <Button onPress={handleSubmit}>{tProfile('becomeProvider.becomeProviderButton')}</Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default BecomeProviderScreen;

const createStyles = (theme) => StyleSheet.create({
    fullScreen: { 
        flex: 1, 
        backgroundColor: theme.background 
    },
    container: { 
        padding: wp(5), 
        paddingBottom: hp(5) 
    },
    header: {
        alignItems: 'center',
        marginBottom: hp(3),
    },
    title: {
        fontSize: wp(6),
        fontWeight: 'bold',
        color: theme.textPrimary,
        marginBottom: hp(1),
    },
    subtitle: {
        fontSize: wp(4),
        color: theme.textSecondary,
        textAlign: 'center',
        lineHeight: hp(2.5),
    },
    cancelText: {
        color: theme.textPrimary, 
        fontSize: wp(4), 
        fontWeight: '500'
    },
    label: { 
        fontSize: wp(4.2), 
        marginTop: hp(2), 
        marginBottom: hp(1), 
        fontWeight: '600',
        color: theme.textPrimary
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: theme.border,
        padding: wp(3),
        borderRadius: wp(2),
        marginBottom: hp(2),
        fontSize: wp(4),
        color: theme.textPrimary,
        backgroundColor: theme.cardBackground,
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