import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequestGroup } from './RequestGroupContext';
import RequestDetails from '../../components/RequestCreation/RequestDetails';
import { useTranslation } from '../../hooks/useTranslation';

const GroupRequestDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params || {};
  const { state, dispatch } = useRequestGroup();
  const { tRequestCreation } = useTranslation();

  // Set the group ID when component mounts (if not already set)
  useEffect(() => {
    if (groupId && !state.groupId) {
      dispatch({ type: 'SET_GROUP_ID', payload: groupId });
    }
  }, [groupId, state.groupId, dispatch]);

  const handleBack = () => {
    // Navigate back to the group category selection
    navigation.replace('GroupCategorySelection', { groupId });
  };

  const handleNext = (formData) => {
    // Navigate to the next screen in group request flow
    navigation.replace('GroupLocation', { groupId });
  };

  const handleCancel = () => {
    Alert.alert(
      tRequestCreation('cancelGroupRequest'),
      tRequestCreation('cancelGroupConfirm'),
      [
        { text: tRequestCreation('keepEditing'), style: 'cancel' },
        { 
          text: tRequestCreation('cancelRequestButton'), 
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'RESET' });
            navigation.replace('GroupWorkDetails', { groupWork: { id: groupId } });
          }
        }
      ]
    );
  };

  return (
    <RequestDetails
      contextState={state}
      contextDispatch={dispatch}
      onBack={handleBack}
      onNext={handleNext}
      onCancel={handleCancel}
      groupId={groupId}
    />
  );
};

export default GroupRequestDetailsScreen; 