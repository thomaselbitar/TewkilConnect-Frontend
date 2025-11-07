import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { wp, hp } from '../../utils/helpers';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const MakeOfferScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { request } = route.params;
  const { theme } = useTheme();
  const { tMakeOffer, t } = useTranslation();

  // Budget state
  const [hasBudget, setHasBudget] = useState(false);
  const [budgetType, setBudgetType] = useState(null); // null until user chooses
  const [budgetAmount, setBudgetAmount] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');

  // Timing state
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Additional offer details
  const [message, setMessage] = useState('');

  // Translation functions
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return t('requestCard.status.pending');
      case 'in_progress':
        return t('requestCard.status.inProgress');
      case 'finished':
        return t('requestCard.status.finished');
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getCategoryText = (category) => {
    const categoryMap = {
      'Technician': t('categories.technician'),
      'Electrician': t('categories.electrician'),
      'Mechanic': t('categories.mechanic'),
      'IT Specialist': t('categories.itSpecialist'),
      'Hair Stylist': t('categories.hairStylist'),
      'Personal Trainer': t('categories.personalTrainer'),
      'Plumber': t('categories.plumber'),
      'Baby Sitter': t('categories.babySitter'),
      'Pet Groomer': t('categories.petGroomer'),
      'Mover': t('categories.mover'),
      'Gardener': t('categories.gardener'),
      'Nail Artist': t('categories.nailArtist'),
      'Spa Specialist': t('categories.spaSpecialist'),
      'Cleaner': t('categories.cleaner'),
      'AC Technician': t('categories.acTechnician'),
      'Makeup Artist': t('categories.makeupArtist'),
      'Other': t('categories.other'),
    };
    return categoryMap[category] || category;
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: tMakeOffer('title'),
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.textPrimary,
      },
      headerStyle: {
        backgroundColor: theme.background,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomColor: theme.border,
        borderBottomWidth: 1,
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme.textPrimary} 
          />
        </TouchableOpacity>
      ),
      
      gestureEnabled: false,
    });
  }, [navigation, theme, tMakeOffer]);

  const formatBudget = (budget) => {
    if (budget?.type === 'hourly') {
      return `$${budget.hourlyRate}${t('requestCard.budget.hourly')}`;
    } else if (budget?.type === 'fixed') {
      return `$${budget.amount} ${t('requestCard.budget.fixed')}`;
    }
    return t('requestCard.budget.notSpecified');
  };

  const getTimingText = (timing) => {
    if (timing?.type === 'urgent') {
      return t('requestCard.timing.urgent');
    }
    return t('requestCard.timing.flexible');
  };

  const formatDate = (date) => {
    if (!date) return tMakeOffer('selectDate');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    if (!date) return tMakeOffer('selectTime');
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDateChange = (event, date) => {
    console.log('Date change event:', event.type, date);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate(date);
      }
    } else {
      // For iOS, update temp value
      if (date) {
        setTempDate(date);
      }
    }
  };

  const handleTimeChange = (event, time) => {
    console.log('Time change event:', event.type, time);
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (time) {
        setSelectedTime(time);
      }
    } else {
      // For iOS, update temp value
      if (time) {
        setTempTime(time);
      }
    }
  };

  const validateForm = () => {
    // ✅ Only validate budget if user selected "Set Budget"
    if (hasBudget) {
      if (!budgetType) {
        Alert.alert(tMakeOffer('alerts.budgetTypeRequired'), tMakeOffer('alerts.chooseFixedOrHourly'));
        return false;
      }
  
      if (budgetType === 'fixed' && (!budgetAmount || parseFloat(budgetAmount) <= 0)) {
        Alert.alert(tMakeOffer('alerts.invalidAmount'), tMakeOffer('alerts.enterValidFixedAmount'));
        return false;
      }
  
      if (budgetType === 'hourly' && (!hourlyRate || parseFloat(hourlyRate) <= 0)) {
        Alert.alert(tMakeOffer('alerts.invalidRate'), tMakeOffer('alerts.enterValidHourlyRate'));
        return false;
      }
    }
  
    // ✅ Always require date & time
    if (!selectedDate) {
      Alert.alert(tMakeOffer('alerts.dateRequired'), tMakeOffer('alerts.selectDate'));
      return false;
    }
  
    if (!selectedTime) {
      Alert.alert(tMakeOffer('alerts.timeRequired'), tMakeOffer('alerts.selectTime'));
      return false;
    }
  
    // message is optional
    return true;
  };

  const handleSubmitOffer = () => {
    if (!validateForm()) return;
  
    const offerData = {
      requestId: request.id,
      budget: hasBudget
        ? {
            hasBudget: true,
            type: budgetType,
            amount: budgetType === 'fixed' ? parseFloat(budgetAmount) : 0,
            hourlyRate: budgetType === 'hourly' ? parseFloat(hourlyRate) : 0,
          }
        : { hasBudget: false },
      timing: {
        date: selectedDate,
        time: selectedTime,
      },
      message: message.trim(),
    };
  
    console.log('Submitting offer:', offerData);
  
    Alert.alert(tMakeOffer('alerts.offerSubmitted'), tMakeOffer('alerts.offerSubmittedSuccess'), [
      { text: tMakeOffer('alerts.ok'), onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Request Card Section */}
        <View style={styles.requestCardSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tMakeOffer('requestDetails')}</Text>
          <View style={[styles.requestCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={styles.requestHeader}>
              <View style={styles.categoryContainer}>
                <Ionicons name="briefcase-outline" size={16} color={theme.primary} />
                <Text style={[styles.categoryText, { color: theme.primary }]}>{getCategoryText(request.category)}</Text>
              </View>
              <View style={styles.statusContainer}>
                <Ionicons name="time-outline" size={16} color={theme.warning} />
                <Text style={[styles.statusText, { color: theme.warning }]}>
                  {getStatusText(request.status)}
                </Text>
              </View>
            </View>

            <Text style={[styles.requestTitle, { color: theme.textPrimary }]}>{request.title}</Text>
            <Text style={[styles.requestDescription, { color: theme.textSecondary }]} numberOfLines={3}>
              {request.description}
            </Text>

                         {/* Image Preview */}
             {request.location?.images && request.location.images.length > 0 && (
               <View style={styles.imageContainer}>
                 <Image 
                   source={{ uri: request.location.images[0] }} 
                   style={styles.image}
                   resizeMode="cover"
                 />
                 {request.location.images.length > 1 && (
                   <View style={styles.imageCount}>
                     <Text style={styles.imageCountText}>+{request.location.images.length - 1}</Text>
                   </View>
                 )}
               </View>
             )}

            <View style={styles.requestDetails}>
              <View style={styles.detailItem}>
                <Ionicons name="location-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                  {request.location?.city || t('requestCard.location.notSpecified')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.detailText, { color: theme.textSecondary }]}>
                  {formatBudget(request.budget)}
                </Text>
              </View>
            </View>

            <View style={styles.timingContainer}>
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={[styles.timingText, { color: theme.textSecondary }]}>
                {getTimingText(request.timing)}
              </Text>
              {request.timing?.type === 'urgent' && (
                <Ionicons name="warning" size={14} color={theme.star} style={styles.urgentIcon} />
              )}
            </View>
          </View>
        </View>

        {/* Budget Section */}
        <View style={styles.budgetSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tMakeOffer('yourOfferBudget')}</Text>
          
                     {/* Budget Toggle */}
           <View style={styles.budgetToggleContainer}>
             <TouchableOpacity
               style={[
                 styles.budgetToggleCard,
                 { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                 hasBudget && { backgroundColor: theme.primary, borderColor: theme.primary }
               ]}
               onPress={() => setHasBudget(true)}
             >
               <View style={styles.budgetToggleContent}>
                 <View style={[
                   styles.budgetToggleIcon,
                   { backgroundColor: theme.background },
                   hasBudget && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                 ]}>
                   <Ionicons 
                     name="cash-outline" 
                     size={24} 
                     color={hasBudget ? 'white' : theme.primary} 
                   />
                 </View>
                 <View style={styles.budgetToggleTextContainer}>
                   <Text style={[
                     styles.budgetToggleTitle,
                     { color: theme.textPrimary },
                     hasBudget && styles.budgetToggleTitleActive
                   ]}>
                     {tMakeOffer('setBudget')}
                   </Text>
                   <Text style={[
                     styles.budgetToggleSubtitle,
                     { color: theme.textSecondary },
                     hasBudget && styles.budgetToggleSubtitleActive
                   ]}>
                     {tMakeOffer('specifyOfferAmount')}
                   </Text>
                 </View>
                 {hasBudget && (
                   <View style={styles.budgetToggleCheck}>
                     <Ionicons name="checkmark" size={16} color="white" />
                   </View>
                 )}
               </View>
             </TouchableOpacity>

             <TouchableOpacity
               style={[
                 styles.budgetToggleCard,
                 { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                 !hasBudget && { backgroundColor: theme.primary, borderColor: theme.primary }
               ]}
               onPress={() => setHasBudget(false)}
             >
               <View style={styles.budgetToggleContent}>
                 <View style={[
                   styles.budgetToggleIcon,
                   { backgroundColor: theme.background },
                   !hasBudget && { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                 ]}>
                   <Ionicons 
                     name="close-circle-outline" 
                     size={24} 
                     color={!hasBudget ? 'white' : theme.textSecondary} 
                   />
                 </View>
                 <View style={styles.budgetToggleTextContainer}>
                   <Text style={[
                     styles.budgetToggleTitle,
                     { color: theme.textPrimary },
                     !hasBudget && styles.budgetToggleTitleActive
                   ]}>
                     {tMakeOffer('noBudget')}
                   </Text>
                   <View style={styles.budgetWarningContainer}>
                     <View style={styles.budgetWarningIconContainer}>
                       <Ionicons 
                         name="warning" 
                         size={14} 
                         color={!hasBudget ? theme.error : 'rgba(255, 255, 255, 0.8)'} 
                       />
                     </View>
                     <View style={styles.budgetWarningTextContainer}>
                       <Text style={[
                         styles.budgetToggleSubtitle,
                         { color: theme.textSecondary },
                         !hasBudget && styles.budgetToggleSubtitleActive,
                         !hasBudget && { color: theme.error, fontWeight: '500' }
                       ]}>
                         {tMakeOffer('acceptingPriceSet')}
                       </Text>
                     </View>
                   </View>
                 </View>
                 {!hasBudget && (
                   <View style={styles.budgetToggleCheck}>
                     <Ionicons name="checkmark" size={16} color="white" />
                   </View>
                 )}
               </View>
             </TouchableOpacity>
           </View>

          {hasBudget && (
            <>
              {/* Budget Type Selection */}
              <View style={styles.budgetTypeContainer}>
                <TouchableOpacity
                  style={[
                    styles.budgetTypeCard,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    budgetType === 'fixed' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setBudgetType('fixed')}
                >
                  <View style={styles.budgetTypeHeader}>
                    <Ionicons 
                      name="cash-outline" 
                      size={20} 
                      color={budgetType === 'fixed' ? 'white' : theme.primary} 
                    />
                    <Text style={[
                      styles.budgetTypeTitle,
                      { color: theme.textPrimary },
                      budgetType === 'fixed' && styles.selectedBudgetTypeText
                    ]}>
                      {tMakeOffer('fixedAmount')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.budgetTypeDescription,
                    { color: theme.textSecondary },
                    budgetType === 'fixed' && styles.selectedBudgetTypeDescription
                  ]}>
                    {tMakeOffer('setTotalAmount')}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.budgetTypeCard,
                    { backgroundColor: theme.surfaceLight, borderColor: theme.border },
                    budgetType === 'hourly' && { backgroundColor: theme.primary, borderColor: theme.primary }
                  ]}
                  onPress={() => setBudgetType('hourly')}
                >
                  <View style={styles.budgetTypeHeader}>
                    <Ionicons 
                      name="time-outline" 
                      size={20} 
                      color={budgetType === 'hourly' ? 'white' : theme.primary} 
                    />
                    <Text style={[
                      styles.budgetTypeTitle,
                      { color: theme.textPrimary },
                      budgetType === 'hourly' && styles.selectedBudgetTypeText
                    ]}>
                      {tMakeOffer('hourlyRate')}
                    </Text>
                  </View>
                  <Text style={[
                    styles.budgetTypeDescription,
                    { color: theme.textSecondary },
                    budgetType === 'hourly' && styles.selectedBudgetTypeDescription
                  ]}>
                    {tMakeOffer('setRatePerHour')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Fixed Budget Input */}
              {budgetType === 'fixed' && (
                <View style={styles.budgetInputContainer}>
                  <Text style={[styles.label, { color: theme.textPrimary }]}>{tMakeOffer('totalAmount')}</Text>
                  <View style={[styles.amountInputContainer, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}>
                    <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>$</Text>
                    <TextInput
                      style={[styles.amountInput, { color: theme.textPrimary }]}
                      value={budgetAmount}
                      onChangeText={setBudgetAmount}
                      placeholder="0.00"
                      placeholderTextColor={theme.textTertiary}
                      keyboardType="numeric"
                    />
                  </View>
                  <Text style={[styles.budgetNote, { color: theme.textSecondary }]}>
                    {tMakeOffer('totalAmountNote')}
                  </Text>
                </View>
              )}

              {/* Hourly Rate Input */}
              {budgetType === 'hourly' && (
                <View style={styles.budgetInputContainer}>
                  <Text style={[styles.label, { color: theme.textPrimary }]}>{tMakeOffer('hourlyRateLabel')}</Text>
                  <View style={[styles.amountInputContainer, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}>
                    <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>$</Text>
                    <TextInput
                      style={[styles.amountInput, { color: theme.textPrimary }]}
                      value={hourlyRate}
                      onChangeText={setHourlyRate}
                      placeholder="0.00"
                      placeholderTextColor={theme.textTertiary}
                      keyboardType="numeric"
                    />
                    <Text style={[styles.perHourText, { color: theme.textSecondary }]}>/hour</Text>
                  </View>
                  <Text style={[styles.budgetNote, { color: theme.textSecondary }]}>
                    {tMakeOffer('hourlyRateNote')}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* Timing Section */}
        <View style={styles.timingSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tMakeOffer('whenCanYouStart')}</Text>
          
          <View style={styles.timingOptions}>
            <TouchableOpacity
              style={[styles.timingOption, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.timingOptionHeader}>
                <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                <Text style={[styles.timingOptionTitle, { color: theme.textPrimary }]}>{tMakeOffer('date')}</Text>
              </View>
              <Text style={[
                styles.timingOptionValue,
                { color: theme.primary },
                !selectedDate && { color: theme.textTertiary, fontStyle: 'italic' }
              ]}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.timingOption, { backgroundColor: theme.surfaceLight, borderColor: theme.border }]}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.timingOptionHeader}>
                <Ionicons name="time-outline" size={20} color={theme.primary} />
                <Text style={[styles.timingOptionTitle, { color: theme.textPrimary }]}>{tMakeOffer('time')}</Text>
              </View>
              <Text style={[
                styles.timingOptionValue,
                { color: theme.primary },
                !selectedTime && { color: theme.textTertiary, fontStyle: 'italic' }
              ]}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Message Section */}
        <View style={styles.messageSection}>
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>{tMakeOffer('additionalMessage')}</Text>
          <TextInput
            style={[styles.messageInput, { backgroundColor: theme.surfaceLight, borderColor: theme.border, color: theme.textPrimary }]}
            value={message}
            onChangeText={setMessage}
            placeholder={tMakeOffer('addAdditionalDetails')}
            placeholderTextColor={theme.textTertiary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.primary }]} onPress={handleSubmitOffer}>
          <Text style={styles.submitButtonText}>{tMakeOffer('submitOffer')}</Text>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>

             {/* Date Picker */}
       {showDatePicker && (
         Platform.OS === 'ios' ? (
           <Modal
             visible={showDatePicker}
             transparent={true}
             animationType="slide"
           >
             <View style={styles.modalOverlay}>
               <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                 <View style={styles.modalHeader}>
                   <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{tMakeOffer('selectDateModal')}</Text>
                   <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                     <Ionicons name="close" size={24} color={theme.textPrimary} />
                   </TouchableOpacity>
                 </View>
                 <View style={styles.pickerContainer}>
                   <DateTimePicker
                     value={tempDate}
                     mode="date"
                     display="spinner"
                     onChange={handleDateChange}
                     style={styles.dateTimePicker}
                     textColor={theme.textPrimary}
                     backgroundColor={theme.background}
                   />
                   <TouchableOpacity 
                     style={[styles.pickerButton, { backgroundColor: theme.primary }]}
                     onPress={() => {
                       console.log('Done button pressed for date');
                       setSelectedDate(tempDate);
                       setShowDatePicker(false);
                     }}
                   >
                     <Text style={styles.pickerButtonText}>{tMakeOffer('done')}</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           </Modal>
         ) : (
                        <DateTimePicker
               value={tempDate}
               mode="date"
               display="default"
               onChange={handleDateChange}
               style={styles.dateTimePicker}
             />
         )
       )}

       {/* Time Picker */}
       {showTimePicker && (
         Platform.OS === 'ios' ? (
           <Modal
             visible={showTimePicker}
             transparent={true}
             animationType="slide"
           >
             <View style={styles.modalOverlay}>
               <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                 <View style={styles.modalHeader}>
                   <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{tMakeOffer('selectTimeModal')}</Text>
                   <TouchableOpacity onPress={() => setShowTimePicker(false)}>
                     <Ionicons name="close" size={24} color={theme.textPrimary} />
                   </TouchableOpacity>
                 </View>
                 <View style={styles.pickerContainer}>
                   <DateTimePicker
                     value={tempTime}
                     mode="time"
                     display="spinner"
                     onChange={handleTimeChange}
                     style={styles.dateTimePicker}
                     textColor={theme.textPrimary}
                     backgroundColor={theme.background}
                   />
                   <TouchableOpacity 
                     style={[styles.pickerButton, { backgroundColor: theme.primary }]}
                     onPress={() => {
                       console.log('Done button pressed for time');
                       setSelectedTime(tempTime);
                       setShowTimePicker(false);
                     }}
                   >
                     <Text style={styles.pickerButtonText}>{tMakeOffer('done')}</Text>
                   </TouchableOpacity>
                 </View>
               </View>
             </View>
           </Modal>
         ) : (
                        <DateTimePicker
               value={tempTime}
               mode="time"
               display="default"
               onChange={handleTimeChange}
               style={styles.dateTimePicker}
             />
         )
       )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  requestCardSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(2),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: hp(2),
  },
  requestCard: {
    padding: wp(4),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: hp(1),
    lineHeight: 20,
  },
  requestDescription: {
    fontSize: 14,
    marginBottom: hp(2),
    lineHeight: 18,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: hp(2),
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  imageCount: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  imageCountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(1),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  urgentIcon: {
    marginLeft: 4,
  },
  budgetSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },
  budgetToggleContainer: {
    gap: hp(1.5),
    marginBottom: hp(2),
  },
  budgetToggleCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: wp(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  budgetToggleCardActive: {
    shadowOpacity: 0.2,
    elevation: 5,
  },
  budgetToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetToggleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(3),
  },
  budgetToggleIconActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  budgetToggleTextContainer: {
    flex: 1,
  },
  budgetToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: hp(0.5),
  },
  budgetToggleTitleActive: {
    color: 'white',
  },
  budgetToggleSubtitle: {
    fontSize: 13,
    lineHeight: 16,
  },
  budgetToggleSubtitleActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  budgetToggleCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetWarningContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(0.5),
  },
  budgetWarningIconContainer: {
    width: 20,
    marginRight: wp(1),
    marginTop: 1,
    alignItems: 'center',
  },
  budgetWarningTextContainer: {
    flex: 1,
  },
  budgetWarningText: {
    color: '#FF4444',
    fontWeight: '500',
  },
  budgetTypeContainer: {
    flexDirection: 'row',
    gap: wp(2),
    marginBottom: hp(2),
  },
  budgetTypeCard: {
    flex: 1,
    padding: wp(3),
    borderRadius: 8,
    borderWidth: 1,
  },
  selectedBudgetTypeCard: {
    // Will be handled by inline styles
  },
  budgetTypeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  budgetTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  selectedBudgetTypeText: {
    color: 'white',
  },
  budgetTypeDescription: {
    fontSize: 12,
  },
  selectedBudgetTypeDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  budgetInputContainer: {
    marginTop: hp(1),
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: hp(1),
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: wp(3),
    marginBottom: hp(1),
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: wp(1),
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: hp(1.5),
  },
  perHourText: {
    fontSize: 14,
    marginLeft: wp(1),
  },
  budgetNote: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  timingSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },
  timingOptions: {
    gap: hp(1.5),
  },
  timingOption: {
    padding: wp(3),
    borderRadius: 8,
    borderWidth: 1,
  },
  timingOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(0.5),
  },
  timingOptionTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  timingOptionValue: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 26,
  },
  messageSection: {
    paddingHorizontal: wp(4),
    paddingTop: hp(3),
  },
  messageInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: wp(3),
    fontSize: 14,
    minHeight: hp(12),
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(4),
    marginTop: hp(4),
    paddingVertical: hp(2),
    borderRadius: 8,
    gap: wp(2),
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 12,
    padding: wp(4),
    width: wp(90),
    maxHeight: hp(50),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  pickerContainer: {
    alignItems: 'center',
    paddingVertical: hp(2),
  },
  pickerText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: hp(2),
  },
  pickerButton: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    borderRadius: 6,
  },
  pickerButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  dateTimePicker: {
    width: wp(70),
    height: hp(20),
  },
  placeholderText: {
    fontStyle: 'italic',
  },
});

export default MakeOfferScreen;
