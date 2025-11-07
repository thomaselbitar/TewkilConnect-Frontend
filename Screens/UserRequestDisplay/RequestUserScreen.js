import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { GlobalStyles } from '../../constants/Styles';
import Ionicons from '@expo/vector-icons/Ionicons';
import GroupUserCard from '../../components/Card/GroupCards/GroupUserCard';
import RequestUserCard from '../../components/Card/RequestCards/RequestUserCard';
import { 
    userIndividualRequests, 
    userGroupWorks, 
    getUserDashboardStats 
} from '../../Data/UserData';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');
const wp = (percentage) => (width * percentage) / 100;

const RequestUserScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { tRequestUser, tCommon } = useTranslation();
    const [individualExpanded, setIndividualExpanded] = React.useState(true);
    const [groupExpanded, setGroupExpanded] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    
    // State for individual request status sections
    const [pendingExpanded, setPendingExpanded] = React.useState(true);
    const [inProgressExpanded, setInProgressExpanded] = React.useState(true);
    const [finishedExpanded, setFinishedExpanded] = React.useState(true);
    const [declinedExpanded, setDeclinedExpanded] = React.useState(true);

    // Get dashboard statistics from UserData
    const dashboardData = getUserDashboardStats();

    // Use real user data
    const individualRequests = userIndividualRequests;
    const groupRequests = userGroupWorks;

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
      console.log('Data refreshed!');
    }, 1500);
  }, []);

  // Navigation functions
  const handleCreateRequest = () => {
    navigation.replace('CategorySelection');
  };

  const handleCreateGroup = () => {
    navigation.replace('CreateGroupWork');
  };

  const handleGroupPress = (groupData) => {
    navigation.navigate('GroupWorkDetails', { groupWork: groupData });
  };

    const handleEditRequest = (request) => {
        // Prepare the data in the format expected by EditUserRequest
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

    const handleDeleteRequest = (request) => {
        Alert.alert(
            tRequestUser('deleteRequest'),
            `${tRequestUser('deleteConfirmMessage')} "${request.title}"?`,
            [
                { text: tCommon('cancel'), style: 'cancel' },
                { 
                    text: tRequestUser('delete'), 
                    style: 'destructive', 
                    onPress: () => console.log('Delete request:', request.id) 
                }
            ]
        );
    };

    const styles = createStyles(theme);

    // Show loading spinner
    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.primary} />
                <Text style={styles.loadingText}>{tRequestUser('loadingRequests')}</Text>
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
                    <Ionicons name="document-text" size={32} color={theme.primary} />
                    <Text style={styles.title}>{tRequestUser('yourRequests')}</Text>
                </View>
                <Text style={styles.subtitle}>{tRequestUser('manageRequests')}</Text>
            </View>

            {/* Main Stats Dashboard */}
            <View style={styles.statsSection}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{tRequestUser('totalRequest')}</Text>
                    <Text style={styles.totalNumber}>{dashboardData.totalRequests}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>{tRequestUser('totalGroupWork')}</Text>
                    <Text style={styles.totalNumber}>{dashboardData.totalGroups}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.statusRow}>
                    <View style={styles.statusItem}>
                        <Text style={[styles.statusNumber, { color: '#FFA500' }]}>{dashboardData.pending}</Text>
                        <View style={styles.statusLabelContainer}>
                            <Ionicons name="time-outline" size={14} color="#FFA500" />
                            <Text style={[styles.statusLabel, { color: '#FFA500' }]}>{tRequestUser('pending')}</Text>
                        </View>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={[styles.statusNumber, { color: '#007BFF' }]}>{dashboardData.inProgress}</Text>
                        <View style={styles.statusLabelContainer}>
                            <Ionicons name="play-circle-outline" size={14} color="#007BFF" />
                            <Text style={[styles.statusLabel, { color: '#007BFF' }]}>{tRequestUser('inProgress')}</Text>
                        </View>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={[styles.statusNumber, { color: '#28A745' }]}>{dashboardData.finished}</Text>
                        <View style={styles.statusLabelContainer}>
                            <Ionicons name="checkmark-circle-outline" size={14} color="#28A745" />
                            <Text style={[styles.statusLabel, { color: '#28A745' }]}>{tRequestUser('finished')}</Text>
                        </View>
                    </View>
                    <View style={styles.statusItem}>
                        <Text style={[styles.statusNumber, { color: '#DC3545' }]}>{dashboardData.declined}</Text>
                        <View style={styles.statusLabelContainer}>
                            <Ionicons name="close-circle-outline" size={14} color="#DC3545" />
                            <Text style={[styles.statusLabel, { color: '#DC3545' }]}>{tRequestUser('declined')}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Quick Actions */}
            <View style={styles.actionsSection}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleCreateRequest}
                >
                    <Ionicons name="add-circle-outline" size={24} color={theme.primary} />
                    <Text style={styles.actionButtonText}>{tRequestUser('createNewRequest')}</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={handleCreateGroup}
                >
                    <Ionicons name="people-outline" size={24} color={theme.primary} />
                    <Text style={styles.actionButtonText}>{tRequestUser('createRequestGroup')}</Text>
                </TouchableOpacity>
            </View>

            {/* Individual Requests Section */}
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => setIndividualExpanded(!individualExpanded)}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <Ionicons name="document-outline" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>{tRequestUser('individualRequests')}</Text>
                    </View>
                    <Ionicons
                        name={individualExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={theme.primary}
                    />
                </TouchableOpacity>
                {individualExpanded && (
                    <>
                        {individualRequests.length > 0 ? (
                            <>
                                {/* Pending Requests Section */}
                                <View style={styles.statusSection}>
                                    <TouchableOpacity
                                        style={styles.statusSectionHeader}
                                        onPress={() => setPendingExpanded(!pendingExpanded)}
                                    >
                                        <View style={styles.statusSectionHeaderLeft}>
                                            <Ionicons name="time-outline" size={18} color="#FFA500" />
                                            <Text style={[styles.statusSectionTitle, { color: '#FFA500' }]}>
                                                {tRequestUser('pending')} ({individualRequests.filter(req => req.status === 'Pending').length})
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={pendingExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#FFA500"
                                        />
                                    </TouchableOpacity>
                                    {pendingExpanded && (
                                        <>
                                            {individualRequests.filter(req => req.status === 'Pending').length > 0 ? (
                                                individualRequests.filter(req => req.status === 'Pending').map((request) => (
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
                                                    <Text style={styles.emptyStatusText}>{tRequestUser('noPendingRequests')}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>

                                {/* In Progress Requests Section */}
                                <View style={styles.statusSection}>
                                    <TouchableOpacity
                                        style={styles.statusSectionHeader}
                                        onPress={() => setInProgressExpanded(!inProgressExpanded)}
                                    >
                                        <View style={styles.statusSectionHeaderLeft}>
                                            <Ionicons name="play-circle-outline" size={18} color="#007BFF" />
                                            <Text style={[styles.statusSectionTitle, { color: '#007BFF' }]}>
                                                {tRequestUser('inProgress')} ({individualRequests.filter(req => req.status === 'In Progress').length})
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={inProgressExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#007BFF"
                                        />
                                    </TouchableOpacity>
                                    {inProgressExpanded && (
                                        <>
                                            {individualRequests.filter(req => req.status === 'In Progress').length > 0 ? (
                                                individualRequests.filter(req => req.status === 'In Progress').map((request) => (
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
                                                    <Text style={styles.emptyStatusText}>{tRequestUser('noInProgressRequests')}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>

                                {/* Finished Requests Section */}
                                <View style={styles.statusSection}>
                                    <TouchableOpacity
                                        style={styles.statusSectionHeader}
                                        onPress={() => setFinishedExpanded(!finishedExpanded)}
                                    >
                                        <View style={styles.statusSectionHeaderLeft}>
                                            <Ionicons name="checkmark-circle-outline" size={18} color="#28A745" />
                                            <Text style={[styles.statusSectionTitle, { color: '#28A745' }]}>
                                                {tRequestUser('finished')} ({individualRequests.filter(req => req.status === 'Finished').length})
                                            </Text>
                                        </View>
                                        <Ionicons
                                            name={finishedExpanded ? "chevron-up" : "chevron-down"}
                                            size={20}
                                            color="#28A745"
                                        />
                                    </TouchableOpacity>
                                    {finishedExpanded && (
                                        <>
                                            {individualRequests.filter(req => req.status === 'Finished').length > 0 ? (
                                                individualRequests.filter(req => req.status === 'Finished').map((request) => (
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
                                                    <Text style={styles.emptyStatusText}>{tRequestUser('noFinishedRequests')}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>

                                {/* Declined Requests Section */}
                                <View style={styles.statusSection}>
                                    <TouchableOpacity
                                        style={styles.statusSectionHeader}
                                        onPress={() => setDeclinedExpanded(!declinedExpanded)}
                                    >
                                        <View style={styles.statusSectionHeaderLeft}>
                                            <Ionicons name="close-circle-outline" size={18} color="#DC3545" />
                                            <Text style={[styles.statusSectionTitle, { color: '#DC3545' }]}>
                                                {tRequestUser('declined')} ({individualRequests.filter(req => req.status === 'Declined').length})
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
                                            {individualRequests.filter(req => req.status === 'Declined').length > 0 ? (
                                                individualRequests.filter(req => req.status === 'Declined').map((request) => (
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
                                                    <Text style={styles.emptyStatusText}>{tRequestUser('noDeclinedRequests')}</Text>
                                                </View>
                                            )}
                                        </>
                                    )}
                                </View>
                            </>
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="document-outline" size={32} color={theme.textSecondary} />
                                <Text style={styles.emptyTitle}>{tRequestUser('noIndividualRequests')}</Text>
                                <TouchableOpacity 
                                    style={styles.createButton}
                                    onPress={handleCreateRequest}
                                >
                                    <Text style={styles.createButtonText}>{tRequestUser('createRequest')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </View>

            {/* Group Requests Section */}
            <View style={styles.sectionContainer}>
                <TouchableOpacity
                    style={styles.sectionHeader}
                    onPress={() => setGroupExpanded(!groupExpanded)}
                >
                    <View style={styles.sectionHeaderLeft}>
                        <Ionicons name="people-outline" size={20} color={theme.primary} />
                        <Text style={styles.sectionTitle}>{tRequestUser('groupWork')}</Text>
                    </View>
                    <Ionicons
                        name={groupExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={theme.primary}
                    />
                </TouchableOpacity>
                {groupExpanded && (
                    <>
                        {groupRequests.length > 0 ? (
                            groupRequests.map((request) => (
                                <GroupUserCard
                                    key={request.id}
                                    title={request.title}
                                    icon="folder-open"
                                    requestCount={request.requests.length}
                                    onPress={() => handleGroupPress(request)}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyContainer}>
                                <Ionicons name="folder-open" size={32} color={theme.textSecondary} />
                                <Text style={styles.emptyTitle}>{tRequestUser('noGroupWork')}</Text>
                                <TouchableOpacity 
                                    style={styles.createButton}
                                    onPress={handleCreateGroup}
                                >
                                    <Text style={styles.createButtonText}>{tRequestUser('createGroup')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
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
        marginBottom: 12,
    },
    createButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    createButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.primary,
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
    },
    statusLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    actionsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.background,
        borderWidth: 1,
        borderColor: theme.primary,
        borderRadius: 8,
        padding: 16,
        width: wp(45),
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
});

export default RequestUserScreen;
