import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRequestGroup } from './RequestGroupContext';
import CategorySelection from '../../components/RequestCreation/CategorySelection';

const GroupCategorySelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params || {};
  const { state, dispatch } = useRequestGroup();

  // Set the group ID when component mounts
  useEffect(() => {
    if (groupId) {
      dispatch({ type: 'SET_GROUP_ID', payload: groupId });
    }
  }, [groupId, dispatch]);

  const handleBackOrCancel = () => {
    // Reset context for safety and navigate back
    dispatch({ type: 'RESET' });
    navigation.replace('GroupWorkDetails', { groupWork: { id: groupId } });
  };

  const handleNext = (category) => {
    // Navigate to the next screen in group request flow
    navigation.replace('GroupRequestDetails', { groupId });
  };

  return (
    <CategorySelection
      contextState={state}
      contextDispatch={dispatch}
      onNext={handleNext}
      onCancel={handleBackOrCancel}
      groupId={groupId}
    />
  );
};

export default GroupCategorySelectionScreen; 