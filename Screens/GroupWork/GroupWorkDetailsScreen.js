import React, { useLayoutEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import RequestUserCard from '../../components/Card/RequestCards/RequestUserCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const GroupWorkDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useTheme();
  const { tGroupWork } = useTranslation();

  const { groupWork } = route.params || {};
  const [requestsExpanded, setRequestsExpanded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // State for status sections within requests
  const [pendingExpanded, setPendingExpanded] = useState(true);
  const [inProgressExpanded, setInProgressExpanded] = useState(true);
  const [finishedExpanded, setFinishedExpanded] = useState(true);
  const [declinedExpanded, setDeclinedExpanded] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: groupWork?.title ? groupWork.title : tGroupWork('groupWork'),
      headerTitleAlign: 'center',
      headerStyle: { backgroundColor: theme.background },
      headerTitleStyle: { color: theme.textPrimary },
      headerTintColor: theme.textPrimary,
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.replace('MainApp', { screen: 'Request' });
            }
          }}
          style={{ paddingHorizontal: 16, paddingVertical: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={theme.textPrimary} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupWork?.title, theme, tGroupWork]);

  // Handle pull to refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      console.log('Group work data refreshed!');
    }, 1500);
  }, []);

  const handleDeleteGroup = useCallback(() => {
    const hasRequests = groupWork.requests && groupWork.requests.length > 0;

    if (hasRequests) {
      Alert.alert(
        '⚠️',
        `${tGroupWork('cannotDeleteGroupWork')}\n\n${tGroupWork('deleteAllRequestsFirst')}`,
        [{ text: tGroupWork('alerts.ok'), style: 'default' }]
      );
      return;
    }

    Alert.alert(tGroupWork('deleteGroupWork'), `${tGroupWork('deleteConfirm')} "${groupWork.title}"?`, [
      { text: tGroupWork('cancel'), style: 'cancel' },
      {
        text: tGroupWork('delete'),
        style: 'destructive',
        onPress: () => {
          console.log('Deleting group work:', groupWork.id);
          navigation.replace('MainApp', { screen: 'Request' });
        },
      },
    ]);
  }, [groupWork, navigation]);

  const handleEditRequest = (request) => {
    const editData = {
      category: request.category,
      location: {
        city: request.location?.city || '',
        street: request.location?.street || '',
        building: request.location?.building || '',
        images: request.location?.images || [],
      },
      providerSelection: {
        // Reset provider selection to "all" if request is declined
        type: request.status === 'Declined' ? 'all' : (request.providerSelection?.type || 'all'),
        selectedProvider: request.status === 'Declined' ? null : (request.providerSelection?.selectedProvider || null),
      },
      title: request.title,
      description: request.description,
      timing: {
        type: request.timing?.type || '',
        day: request.timing?.day || '',
        timeSlot: request.timing?.timeSlot || '',
      },
      budget: request.budget || {
        hasBudget: false,
        type: 'fixed',
        amount: 0,
        hourlyRate: 0,
      },
    };

    navigation.navigate('EditUserRequest', {
      initialData: editData,
      requestId: request.id,
      originalStatus: request.status, // Pass the original status to determine if it's a resend
    });
  };

  const handleDeleteRequest = (request) =>
    Alert.alert(tGroupWork('deleteRequest'), `${tGroupWork('deleteConfirm')} "${request.title}"?`, [
      { text: tGroupWork('cancel'), style: 'cancel' },
      { text: tGroupWork('delete'), style: 'destructive', onPress: () => console.log('Delete request:', request.id) },
    ]);

  // Themed styles (spacing/layout unchanged)
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: { flex: 1, backgroundColor: theme.background },
        contentContainer: { padding: 20 },

        header: { marginBottom: 30 },
        titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
        title: { fontSize: 28, fontWeight: 'bold', color: theme.textPrimary, marginLeft: 12, flex: 1 },
        headerActions: { flexDirection: 'row', alignItems: 'center' },
        editButton: { padding: 8, marginRight: 8 },
        deleteButton: { padding: 8 },
        dateContainer: { marginLeft: 0 },
        createdAt: { fontSize: 14, color: theme.textSecondary },

        descriptionSection: { marginBottom: 30 },
        sectionTitle: { fontSize: 18, fontWeight: '600', color: theme.primary, marginBottom: 12 },
        description: {
          fontSize: 16,
          lineHeight: 24,
          color: theme.textPrimary,
          backgroundColor: theme.surfaceLight,
          padding: 16,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: theme.primary,
          borderBottomWidth: 4,
          borderBottomColor: theme.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },

        statsSection: {
          marginBottom: 30,
          backgroundColor: theme.surfaceLight,
          padding: 20,
          borderRadius: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        },
        totalRequestsRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
          paddingBottom: 15,
          borderBottomWidth: 1,
          borderBottomColor: theme.border,
        },
        totalRequestsLabel: { fontSize: 18, fontWeight: '600', color: theme.textPrimary },
        totalRequestsNumber: { fontSize: 24, fontWeight: 'bold', color: theme.primary },
        statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
        statItem: { alignItems: 'center' },
        statNumber: { fontSize: 20, fontWeight: 'bold' },
        statLabel: { fontSize: 12, marginLeft: 4 },
        statLabelContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

        actionsSection: { gap: 12 },
        actionButton: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.background,
          borderWidth: 1,
          borderColor: theme.primary,
          borderRadius: 8,
          padding: 16,
        },
        actionButtonText: { fontSize: 16, fontWeight: '600', color: theme.primary, marginLeft: 12 },

        requestsSection: { marginTop: 25 },
        requestsHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingVertical: 4,
        },
        requestsHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
        requestsTitle: { fontSize: 18, fontWeight: '600', color: theme.textPrimary, marginLeft: 8 },

        statusSection: { marginBottom: 20 },
        statusSectionHeader: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingVertical: 8,
          paddingHorizontal: 12,
          backgroundColor: theme.surfaceLight,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: theme.primary,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 2,
          elevation: 2,
        },
        statusSectionHeaderLeft: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        statusSectionTitle: { fontSize: 16, fontWeight: '600', marginLeft: 8 },

        emptyStatusContainer: { alignItems: 'center', paddingVertical: 5, paddingHorizontal: 20, marginTop: 10 },
        emptyStatusText: { fontSize: 14, color: theme.textSecondary, fontStyle: 'italic' },

        emptyContainer: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 20 },
        emptyTitle: { fontSize: 16, fontWeight: '600', color: theme.textTertiary, marginTop: 12, marginBottom: 12 },
        createButton: { paddingVertical: 4, paddingHorizontal: 8 },
        createButtonText: { fontSize: 14, fontWeight: '600', color: theme.primary },

        errorText: { fontSize: 16, color: theme.error, textAlign: 'center', marginTop: 50 },
      }),
    [theme]
  );

  if (!groupWork) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{tGroupWork('noDataFound')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} tintColor={theme.primary} />
      }
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="folder-open" size={32} color={theme.primary} />
          <Text style={styles.title}>{groupWork.title}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={() => navigation.replace('EditGroupWork', { groupWork })} style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteGroup} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.createdAt}>{tGroupWork('createdOn')} {new Date(groupWork.createdAt).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.descriptionSection}>
        <Text style={styles.sectionTitle}>{tGroupWork('description')}</Text>
        <Text style={styles.description}>{groupWork.description}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.totalRequestsRow}>
          <Text style={styles.totalRequestsLabel}>{tGroupWork('totalRequests')}</Text>
          <Text style={styles.totalRequestsNumber}>{groupWork.requests?.length || 0}</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.warning }]}>
              {groupWork.requests?.filter((req) => req.status === 'Pending').length || 0}
            </Text>
            <View style={styles.statLabelContainer}>
              <Ionicons name="time-outline" size={14} color={theme.warning} />
              <Text style={[styles.statLabel, { color: theme.warning }]}>{tGroupWork('pending')}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.info }]}>
              {groupWork.requests?.filter((req) => req.status === 'In Progress').length || 0}
            </Text>
            <View style={styles.statLabelContainer}>
              <Ionicons name="play-circle-outline" size={14} color={theme.info} />
              <Text style={[styles.statLabel, { color: theme.info }]}>{tGroupWork('inProgress')}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.success }]}>
              {groupWork.requests?.filter((req) => req.status === 'Finished').length || 0}
            </Text>
            <View style={styles.statLabelContainer}>
              <Ionicons name="checkmark-circle-outline" size={14} color={theme.success} />
              <Text style={[styles.statLabel, { color: theme.success }]}>{tGroupWork('finished')}</Text>
            </View>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#DC3545' }]}>
              {groupWork.requests?.filter((req) => req.status === 'Declined').length || 0}
            </Text>
            <View style={styles.statLabelContainer}>
              <Ionicons name="close-circle-outline" size={14} color="#DC3545" />
              <Text style={[styles.statLabel, { color: '#DC3545' }]}>{tGroupWork('declined')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.replace('GroupCategorySelection', { groupId: groupWork.id })}
        >
          <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
          <Text style={styles.actionButtonText}>{tGroupWork('addRequest')}</Text>
        </TouchableOpacity>
      </View>

      {/* Requests Section */}
      <View style={styles.requestsSection}>
        <TouchableOpacity style={styles.requestsHeader} onPress={() => setRequestsExpanded(!requestsExpanded)}>
          <View style={styles.requestsHeaderLeft}>
            <Ionicons name="document-outline" size={20} color={theme.primary} />
            <Text style={styles.requestsTitle}>{tGroupWork('request')}</Text>
          </View>
          <Ionicons name={requestsExpanded ? 'chevron-up' : 'chevron-down'} size={20} color={theme.primary} />
        </TouchableOpacity>

        {requestsExpanded && (
          <>
            {groupWork.requests && groupWork.requests.length > 0 ? (
              <>
                {/* Pending */}
                <View className="statusSection" style={styles.statusSection}>
                  <TouchableOpacity
                    style={styles.statusSectionHeader}
                    onPress={() => setPendingExpanded(!pendingExpanded)}
                  >
                    <View style={styles.statusSectionHeaderLeft}>
                      <Ionicons name="time-outline" size={18} color={theme.warning} />
                      <Text style={[styles.statusSectionTitle, { color: theme.warning }]}>
                        {tGroupWork('pending')} ({groupWork.requests.filter((req) => req.status === 'Pending').length})
                      </Text>
                    </View>
                    <Ionicons
                      name={pendingExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.warning}
                    />
                  </TouchableOpacity>
                  {pendingExpanded && (
                    <>
                      {groupWork.requests.filter((req) => req.status === 'Pending').length > 0 ? (
                        groupWork.requests
                          .filter((req) => req.status === 'Pending')
                          .map((request) => (
                            <RequestUserCard
                              key={request.id}
                              title={request.title}
                              category={request.category}
                              status={request.status}
                              request={request}
                              onPress={() => navigation.navigate('UserRequestDetails', { request })}
                              onEdit={() => handleEditRequest(request)}
                              onDelete={() => handleDeleteRequest(request)}
                            />
                          ))
                      ) : (
                        <View style={styles.emptyStatusContainer}>
                          <Text style={styles.emptyStatusText}>{tGroupWork('noPendingRequests')}</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {/* In Progress */}
                <View style={styles.statusSection}>
                  <TouchableOpacity
                    style={styles.statusSectionHeader}
                    onPress={() => setInProgressExpanded(!inProgressExpanded)}
                  >
                    <View style={styles.statusSectionHeaderLeft}>
                      <Ionicons name="play-circle-outline" size={18} color={theme.info} />
                      <Text style={[styles.statusSectionTitle, { color: theme.info }]}>
                        {tGroupWork('inProgress')} ({groupWork.requests.filter((req) => req.status === 'In Progress').length})
                      </Text>
                    </View>
                    <Ionicons
                      name={inProgressExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.info}
                    />
                  </TouchableOpacity>
                  {inProgressExpanded && (
                    <>
                      {groupWork.requests.filter((req) => req.status === 'In Progress').length > 0 ? (
                        groupWork.requests
                          .filter((req) => req.status === 'In Progress')
                          .map((request) => (
                            <RequestUserCard
                              key={request.id}
                              title={request.title}
                              category={request.category}
                              status={request.status}
                              request={request}
                              onPress={() => navigation.navigate('UserRequestDetails', { request })}
                              onEdit={() => handleEditRequest(request)}
                              onDelete={() => handleDeleteRequest(request)}
                            />
                          ))
                      ) : (
                        <View style={styles.emptyStatusContainer}>
                          <Text style={styles.emptyStatusText}>{tGroupWork('noInProgressRequests')}</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {/* Finished */}
                <View style={styles.statusSection}>
                  <TouchableOpacity
                    style={styles.statusSectionHeader}
                    onPress={() => setFinishedExpanded(!finishedExpanded)}
                  >
                    <View style={styles.statusSectionHeaderLeft}>
                      <Ionicons name="checkmark-circle-outline" size={18} color={theme.success} />
                      <Text style={[styles.statusSectionTitle, { color: theme.success }]}>
                        {tGroupWork('finished')} ({groupWork.requests.filter((req) => req.status === 'Finished').length})
                      </Text>
                    </View>
                    <Ionicons
                      name={finishedExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={theme.success}
                    />
                  </TouchableOpacity>
                  {finishedExpanded && (
                    <>
                      {groupWork.requests.filter((req) => req.status === 'Finished').length > 0 ? (
                        groupWork.requests
                          .filter((req) => req.status === 'Finished')
                          .map((request) => (
                            <RequestUserCard
                              key={request.id}
                              title={request.title}
                              category={request.category}
                              status={request.status}
                              request={request}
                              onPress={() => navigation.navigate('UserRequestDetails', { request })}
                              onEdit={() => handleEditRequest(request)}
                              onDelete={() => handleDeleteRequest(request)}
                            />
                          ))
                      ) : (
                        <View style={styles.emptyStatusContainer}>
                          <Text style={styles.emptyStatusText}>{tGroupWork('noFinishedRequests')}</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>

                {/* Declined */}
                <View style={styles.statusSection}>
                  <TouchableOpacity
                    style={styles.statusSectionHeader}
                    onPress={() => setDeclinedExpanded(!declinedExpanded)}
                  >
                    <View style={styles.statusSectionHeaderLeft}>
                      <Ionicons name="close-circle-outline" size={18} color="#DC3545" />
                      <Text style={[styles.statusSectionTitle, { color: '#DC3545' }]}>
                        {tGroupWork('declined')} ({groupWork.requests.filter((req) => req.status === 'Declined').length})
                      </Text>
                    </View>
                    <Ionicons
                      name={declinedExpanded ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#DC3545"
                    />
                  </TouchableOpacity>
                  {declinedExpanded && (
                    <>
                      {groupWork.requests.filter((req) => req.status === 'Declined').length > 0 ? (
                        groupWork.requests
                          .filter((req) => req.status === 'Declined')
                          .map((request) => (
                            <RequestUserCard
                              key={request.id}
                              title={request.title}
                              category={request.category}
                              status={request.status}
                              request={request}
                              onPress={() => navigation.navigate('UserRequestDetails', { request })}
                              onEdit={() => handleEditRequest(request)}
                              onDelete={() => handleDeleteRequest(request)}
                            />
                          ))
                      ) : (
                        <View style={styles.emptyStatusContainer}>
                          <Text style={styles.emptyStatusText}>{tGroupWork('noDeclinedRequests')}</Text>
                        </View>
                      )}
                    </>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-outline" size={32} color={theme.textTertiary} />
                <Text style={styles.emptyTitle}>{tGroupWork('noRequestsInGroup')}</Text>
                <TouchableOpacity
                  style={{ paddingVertical: 4, paddingHorizontal: 8 }}
                  onPress={() => navigation.replace('GroupCategorySelection', { groupId: groupWork.id })}
                >
                  <Text style={styles.createButtonText}>{tGroupWork('addARequest')}</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default GroupWorkDetailsScreen;
