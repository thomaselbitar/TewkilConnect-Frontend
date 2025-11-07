import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { GlobalStyles } from '../../constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RequestCard from '../../components/Card/RequestCards/RequestCard';
import WorkAppliedUserCard from '../../components/WorkAppliedUser/WorkAppliedUserCard';
import WorkSendUserCard from '../../components/WorkAppliedUser/WorkSendUserCard';
import { userAppliedWorkData, workSentToUserData } from '../../Data/WorkData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

const WorkUserScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { tWorkUser } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [appliedWorkExpanded, setAppliedWorkExpanded] = React.useState(true);
  const [appliedWorkInProgressExpanded, setAppliedWorkInProgressExpanded] = React.useState(true);
  const [appliedWorkFinishedExpanded, setAppliedWorkFinishedExpanded] = React.useState(true);
  const [sentWorkExpanded, setSentWorkExpanded] = React.useState(true);
  const [sentWorkPendingExpanded, setSentWorkPendingExpanded] = React.useState(true);
  const [sentWorkInProgressExpanded, setSentWorkInProgressExpanded] = React.useState(true);
  const [sentWorkFinishedExpanded, setSentWorkFinishedExpanded] = React.useState(true);
  const [sentWorkDeclinedExpanded, setSentWorkDeclinedExpanded] = React.useState(true);

    // Get accepted offers data (offers that user made and were accepted)
  const allOffers = userAppliedWorkData;
  const acceptedOffers = allOffers.filter(offer => offer.userOffer.status === 'accepted');
  
  // Separate accepted offers by work status
  const acceptedOffersInProgress = acceptedOffers.filter(offer => offer.request.status === 'in_progress');
  const acceptedOffersFinished = acceptedOffers.filter(offer => offer.request.status === 'finished');
  
  

  // Separate work sent to user by status
  const sentWorkPending = workSentToUserData.filter(request => request.status === 'pending');
  const sentWorkInProgress = workSentToUserData.filter(request => request.status === 'in_progress');
  const sentWorkFinished = workSentToUserData.filter(request => request.status === 'finished');
  const sentWorkDeclined = workSentToUserData.filter(request => request.status === 'declined');

  // Mock work data - replace with real data from your backend
  const workStats = {
    totalWorkSent: workSentToUserData.length,
    totalWorkApplied: acceptedOffers.length,
    workPending: sentWorkPending.length,
    workInProgress: acceptedOffersInProgress.length,
    workFinished: acceptedOffersFinished.length,
    workDeclined: sentWorkDeclined.length
  };

  // Simulate loading data
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loading for 2 seconds

    return () => clearTimeout(timer);
  }, []);

  // Handle pull to refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    // Simulate refreshing data
    setTimeout(() => {
      setRefreshing(false);
      console.log('Work data refreshed!');
    }, 1500);
  }, []);

  // Handle work status update
  const handleWorkStatusUpdate = (workId, newStatus) => {
    console.log(`Updating work ${workId} status to ${newStatus}`);
    // Here you would typically make an API call to update the status
    // For now, we'll just log the action
  };

  // Handle work press
  const handleWorkPress = (work) => {
    navigation.navigate('RequestDetails', { request: work });
  };



  const styles = createStyles(theme);

  // Show loading spinner
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>{tWorkUser('loadingYourWork')}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
          tintColor={theme.primary}
        />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="briefcase" size={32} color={theme.primary} />
          <Text style={styles.title}>{tWorkUser('yourWork')}</Text>
        </View>
        <Text style={styles.subtitle}>{tWorkUser('trackAndManage')}</Text>
      </View>

      {/* Main Stats Dashboard */}
      <View style={styles.statsSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{tWorkUser('totalWorkSendToYou')}</Text>
          <Text style={styles.totalNumber}>{workStats.totalWorkSent}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{tWorkUser('totalWorkYouApply')}</Text>
          <Text style={styles.totalNumber}>{workStats.totalWorkApplied}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: '#FFA500' }]}>{workStats.workPending}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="time-outline" size={14} color="#FFA500" />
              <Text style={[styles.statusLabel, { color: '#FFA500' }]}>{tWorkUser('pending')}</Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: '#007BFF' }]}>{workStats.workInProgress}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="play-circle-outline" size={14} color="#007BFF" />
              <Text style={[styles.statusLabel, { color: '#007BFF' }]}>{tWorkUser('workInProgress')}</Text>
            </View>
          </View>
          <View style={styles.statusItem}>
            <Text style={[styles.statusNumber, { color: '#28A745' }]}>{workStats.workFinished}</Text>
            <View style={styles.statusLabelContainer}>
              <Ionicons name="checkmark-circle-outline" size={14} color="#28A745" />
              <Text style={[styles.statusLabel, { color: '#28A745' }]}>{tWorkUser('workFinish')}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsSection}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('OffersMadeScreen')}
        >
          <MaterialCommunityIcons name="offer" size={24} color={theme.primary} />
          <Text style={styles.actionButtonText}>{tWorkUser('viewOffersMade')}</Text>
        </TouchableOpacity>
      </View>

      {/* Work You Apply (and Take) Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setAppliedWorkExpanded(!appliedWorkExpanded)}
        >
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="briefcase-outline" size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>{tWorkUser('workYouApply')}</Text>
          </View>
          <Ionicons
            name={appliedWorkExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
        {appliedWorkExpanded && (
          <>
            {/* In Progress Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setAppliedWorkInProgressExpanded(!appliedWorkInProgressExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="play-circle-outline" size={18} color="#007BFF" />
                  <Text style={[styles.statusSectionTitle, { color: '#007BFF' }]}>
                    {tWorkUser('inProgress')} ({acceptedOffersInProgress.length})
                  </Text>
                </View>
                <Ionicons
                  name={appliedWorkInProgressExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#007BFF"
                />
              </TouchableOpacity>
              {appliedWorkInProgressExpanded && (
                <>
                  {acceptedOffersInProgress.length > 0 ? (
                    acceptedOffersInProgress.map((offer) => (
                      <WorkAppliedUserCard key={offer.id} offer={offer} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noWorkInProgress')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Finish Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setAppliedWorkFinishedExpanded(!appliedWorkFinishedExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#28A745" />
                  <Text style={[styles.statusSectionTitle, { color: '#28A745' }]}>
                    {tWorkUser('finish')} ({acceptedOffersFinished.length})
                  </Text>
                </View>
                <Ionicons
                  name={appliedWorkFinishedExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#28A745"
                />
              </TouchableOpacity>
              {appliedWorkFinishedExpanded && (
                <>
                  {acceptedOffersFinished.length > 0 ? (
                    acceptedOffersFinished.map((offer) => (
                      <WorkAppliedUserCard key={offer.id} offer={offer} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noFinishedWork')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </View>

      {/* Work Send to You Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setSentWorkExpanded(!sentWorkExpanded)}
        >
          <View style={styles.sectionHeaderLeft}>
            <Ionicons name="send-outline" size={20} color={theme.primary} />
            <Text style={styles.sectionTitle}>{tWorkUser('workSendToYou')}</Text>
          </View>
          <Ionicons
            name={sentWorkExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color={theme.primary}
          />
        </TouchableOpacity>
        {sentWorkExpanded && (
          <>
            {/* Pending Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setSentWorkPendingExpanded(!sentWorkPendingExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="time-outline" size={18} color="#FFA500" />
                  <Text style={[styles.statusSectionTitle, { color: '#FFA500' }]}>
                    {tWorkUser('pending')} ({sentWorkPending.length})
                  </Text>
                </View>
                <Ionicons
                  name={sentWorkPendingExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFA500"
                />
              </TouchableOpacity>
              {sentWorkPendingExpanded && (
                <>
                  {sentWorkPending.length > 0 ? (
                    sentWorkPending.map((request) => (
                      <WorkSendUserCard key={request.id} request={request} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noPendingWork')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* In Progress Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setSentWorkInProgressExpanded(!sentWorkInProgressExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="play-circle-outline" size={18} color="#007BFF" />
                  <Text style={[styles.statusSectionTitle, { color: '#007BFF' }]}>
                    {tWorkUser('inProgress')} ({sentWorkInProgress.length})
                  </Text>
                </View>
                <Ionicons
                  name={sentWorkInProgressExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#007BFF"
                />
              </TouchableOpacity>
              {sentWorkInProgressExpanded && (
                <>
                  {sentWorkInProgress.length > 0 ? (
                    sentWorkInProgress.map((request) => (
                      <WorkSendUserCard key={request.id} request={request} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noWorkInProgress')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Finish Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setSentWorkFinishedExpanded(!sentWorkFinishedExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="checkmark-circle-outline" size={18} color="#28A745" />
                  <Text style={[styles.statusSectionTitle, { color: '#28A745' }]}>
                    {tWorkUser('finish')} ({sentWorkFinished.length})
                  </Text>
                </View>
                <Ionicons
                  name={sentWorkFinishedExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#28A745"
                />
              </TouchableOpacity>
              {sentWorkFinishedExpanded && (
                <>
                  {sentWorkFinished.length > 0 ? (
                    sentWorkFinished.map((request) => (
                      <WorkSendUserCard key={request.id} request={request} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noFinishedWork')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Declined Subsection */}
            <View style={styles.statusSection}>
              <TouchableOpacity
                style={styles.statusSectionHeader}
                onPress={() => setSentWorkDeclinedExpanded(!sentWorkDeclinedExpanded)}
              >
                <View style={styles.statusSectionHeaderLeft}>
                  <Ionicons name="close-circle-outline" size={18} color="#DC3545" />
                  <Text style={[styles.statusSectionTitle, { color: '#DC3545' }]}>
                    {tWorkUser('declined')} ({sentWorkDeclined.length})
                  </Text>
                </View>
                <Ionicons
                  name={sentWorkDeclinedExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#DC3545"
                />
              </TouchableOpacity>
              {sentWorkDeclinedExpanded && (
                <>
                  {sentWorkDeclined.length > 0 ? (
                    sentWorkDeclined.map((request) => (
                      <WorkSendUserCard key={request.id} request={request} />
                    ))
                  ) : (
                    <View style={styles.emptyStatusContainer}>
                      <Text style={styles.emptyStatusText}>{tWorkUser('noDeclinedWork')}</Text>
                    </View>
                  )}
                </>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const createStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: theme.textPrimary,
    marginTop: 16,
    fontWeight: '500',
  },
  contentContainer: {
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.textPrimary,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  statsSection: {
    marginBottom: 20,
    backgroundColor: theme.cardBackground,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textPrimary,
    flex: 1,
  },
  totalNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  statusLabel: {
    fontSize: 12,
    color: theme.textSecondary,
    marginLeft: 4,
    textAlign: 'center',
  },
  statusLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  actionsSection: {
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
    borderRadius: 8,
    padding: 16,
    width: '100%',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.primary,
    marginLeft: 12,
  },
  sectionContainer: {
    marginTop: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 4,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.textPrimary,
    marginLeft: 8,
  },
  statusSection: {
    marginBottom: 20,
  },
  statusSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.cardBackground,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.border,
  },
  statusSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyStatusContainer: {
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  emptyStatusText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});

export default WorkUserScreen;
