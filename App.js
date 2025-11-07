import 'react-native-gesture-handler';
import './i18n'; // Import i18n configuration
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTranslation } from './hooks/useTranslation';
import Login from "./Screens/Auth/Login";
import SignUp from "./Screens/Auth/SignUp";

import BottomTabs from './Screens/BottomTabs';
import CategoryDetails from "./Screens/CategoryDetails/CategoryDetailsScreen";

import ProviderProfile from "./Screens/ProviderProfile";
import RequestDetails from "./Screens/RequestDetails/RequestDetailsScreen";
import UserRequestDetailsScreen from "./Screens/RequestDetails/UserRequestDetailsScreen";
import Message from './Screens/Message';
import ProfileSettingsScreen from "./Screens/Profile/ProfileSettingsScreen";
import CompleteProfileScreen from "./Screens/Profile/CompleteProfileScreen";
import EditProfileScreen from "./Screens/Profile/EditProfileScreen";
import BecomeProviderScreen from "./Screens/Profile/BecomeProviderScreen";
import FollowersFollowingScreen from "./Screens/Profile/FollowersFollowingScreen";
import ReelScreen from './Screens/Posts/ReelScreen';
import ReelUserScreen from './Screens/Posts/ReelUserScreen';
import LikesUserScreen from './Screens/Posts/LikesUserScreen';
import AddPost from './Screens/Posts/AddPost';
import AddReel from './Screens/Posts/AddReel';
import CategorySelectionScreen from './Screens/RequestCreationScreens/CategorySelectionScreen';
import RequestFormDetailsScreen from './Screens/RequestCreationScreens/RequestDetailsScreen';
import LocationScreen from './Screens/RequestCreationScreens/LocationScreen';
import BudgetScreen from './Screens/RequestCreationScreens/BudgetScreen';
import ProviderSelectionScreen from './Screens/RequestCreationScreens/ProviderSelectionScreen';
import RequestReviewScreen from './Screens/RequestCreationScreens/RequestReviewScreen';
import { RequestProvider } from './Screens/RequestCreationScreens/RequestContext';
import { RequestGroupProvider } from './Screens/RequestGroupCreationScreens/RequestGroupContext';
import CreateGroupWorkScreen from './Screens/GroupWork/CreateGroupWorkScreen';
import GroupWorkDetailsScreen from './Screens/GroupWork/GroupWorkDetailsScreen';
import EditGroupWorkScreen from './Screens/GroupWork/EditGroupWorkScreen';
import NotificationScreen from './Screens/Notifications/NotificationScreen';
import GroupCategorySelectionScreen from './Screens/RequestGroupCreationScreens/GroupCategorySelectionScreen';
import GroupRequestDetailsScreen from './Screens/RequestGroupCreationScreens/GroupRequestDetailsScreen';
import GroupLocationScreen from './Screens/RequestGroupCreationScreens/GroupLocationScreen';
import GroupBudgetScreen from './Screens/RequestGroupCreationScreens/GroupBudgetScreen';
import GroupProviderSelectionScreen from './Screens/RequestGroupCreationScreens/GroupProviderSelectionScreen';
import GroupRequestReviewScreen from './Screens/RequestGroupCreationScreens/GroupRequestReviewScreen';
import EditUserRequest from './Screens/EditRequest/EditUserRequest';
import SearchScreen from './Screens/Search/SearchScreen';
import MakeOfferScreen from './Screens/Offers/MakeOfferScreen';
import OfferUserScreen from './Screens/Offers/OfferUserScreen';
import OffersMadeScreen from './Screens/Offers/OffersMadeScreen';
import OfferMadeDetailsScreen from './Screens/Offers/OfferMadeDetailsScreen';
// Provider Request Creation Screens
import ProviderRequestTypeScreen from './Screens/ProviderRequestCreationScreens/ProviderRequestTypeScreen';
import ProviderCategorySelectionScreen from './Screens/ProviderRequestCreationScreens/ProviderCategorySelectionScreen';
import ProviderRequestDetailsScreen from './Screens/ProviderRequestCreationScreens/ProviderRequestDetailsScreen';
import ProviderLocationScreen from './Screens/ProviderRequestCreationScreens/ProviderLocationScreen';
import ProviderBudgetScreen from './Screens/ProviderRequestCreationScreens/ProviderBudgetScreen';
import ProviderRequestReviewScreen from './Screens/ProviderRequestCreationScreens/ProviderRequestReviewScreen';
import ReviewScreen from './Screens/Profile/ReviewScreen';
import AboutUsScreen from './Screens/Profile/AboutUsScreen';

const Stack = createStackNavigator();

const AppContent = () => {
  const { theme, isDarkMode } = useTheme();
  const { tScreenTitles } = useTranslation();
  
  // Load Ubuntu fonts
  const [fontsLoaded] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  // Don't render the app until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
      <StatusBar style={isDarkMode ? "light" : "dark"} backgroundColor={theme.background} />
      <RequestProvider>
        <RequestGroupProvider>
          <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerTitleAlign: 'center',
            }}
          >

        <Stack.Screen name="MainApp" component={BottomTabs} options={{
          headerShown: false, animation:'none',
        }} />

        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />




        <Stack.Screen
          name="Message"
          component={Message}
          options={{
            headerShown: true,
            title: tScreenTitles('directMessage'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('editProfile'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="CategoryDetails"
          component={CategoryDetails}
          options={{
            headerShown: true,
            title: tScreenTitles('categoryDetails'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />




        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="MakeOffer"
          component={MakeOfferScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OfferUserScreen"
          component={OfferUserScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="OffersMadeScreen"
          component={OffersMadeScreen}
          options={{
            headerShown: true,
          }}
        />

        <Stack.Screen
          name="OfferMadeDetails"
          component={OfferMadeDetailsScreen}
          options={{
            headerShown: true,
          }}
        />



        <Stack.Screen
          name="ProviderProfile"
          component={ProviderProfile}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="RequestDetails"
          component={RequestDetails}
          options={{
            headerShown: true,
            title: tScreenTitles('requestDetails'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="UserRequestDetails"
          component={UserRequestDetailsScreen}
          options={{
            headerShown: true,
            headerTitle: tScreenTitles('yourRequestDetails'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            gestureEnabled: false,
           
          }}
        />

        <Stack.Screen
          name="EditUserRequest"
          component={EditUserRequest}
          options={{
            headerShown: true,
            title: tScreenTitles('editRequest'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            gestureEnabled: false,
             
          }}
        />


        <Stack.Screen
          name="CompleteProfile"
          component={CompleteProfileScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('editProfile'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name="Settings"
          component={ProfileSettingsScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('settings'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',

          }}
        />

        <Stack.Screen
          name="Review"
          component={ReviewScreen}
          options={{
            headerShown: true,
            title: 'Review',
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="AboutUs"
          component={AboutUsScreen}
          options={{
            headerShown: true,
            title: 'About Us',
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="BecomeProvider"
          component={BecomeProviderScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('becomeProvider'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="FollowersFollowingScreen"
          component={FollowersFollowingScreen}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="ReelScreen"
          component={ReelScreen}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="ReelUserScreen"
          component={ReelUserScreen}
          options={{
            headerShown: false
          }}
        />

        <Stack.Screen
          name="LikesUserScreen"
          component={LikesUserScreen}
          options={({ route }) => ({
            headerShown: true,
            title: 'Likes', // This will be overridden by useLayoutEffect in the component
          })}
        />

        <Stack.Screen
          name="AddPost"
          component={AddPost}
          options={{
            headerShown: true
          }}
        />

        <Stack.Screen
          name="AddReel"
          component={AddReel}
          options={{
            headerShown: true
          }}
        />

        <Stack.Screen
          name="CategorySelection"
          component={CategorySelectionScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="RequestFormDetails"
          component={RequestFormDetailsScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="LocationScreen"
          component={LocationScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="BudgetScreen"
          component={BudgetScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderSelectionScreen"
          component={ProviderSelectionScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="RequestReviewScreen"
          component={RequestReviewScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        {/* Provider Request Creation Screens */}
        <Stack.Screen
          name="ProviderRequestType"
          component={ProviderRequestTypeScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderCategorySelection"
          component={ProviderCategorySelectionScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderRequestDetails"
          component={ProviderRequestDetailsScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderLocation"
          component={ProviderLocationScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderBudget"
          component={ProviderBudgetScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="ProviderRequestReview"
          component={ProviderRequestReviewScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="CreateGroupWork"
          component={CreateGroupWorkScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('createGroupWork'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            
          }}
        />

        <Stack.Screen
          name="GroupWorkDetails"
          component={GroupWorkDetailsScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('groupWorkDetails'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            
          }}
        />

        <Stack.Screen
          name="EditGroupWork"
          component={EditGroupWorkScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('editGroupWork'),
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
            
          }}
        />

        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerShown: true,
            title: tScreenTitles('notifications'),
      
            headerBackTitleVisible: false,
            headerBackTitle: '',
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="GroupCategorySelection"
          component={GroupCategorySelectionScreen}
          options={{
            headerShown: false,
            animation: 'scale_from_center',
            gestureEnabled: false,
            animation:'none',
          }}
        />

        <Stack.Screen
          name="GroupRequestDetails"
          component={GroupRequestDetailsScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            animation:'none',
          }}
        />

        <Stack.Screen
          name="GroupLocation"
          component={GroupLocationScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            animation:'none',
          }}
        />

        <Stack.Screen
          name="GroupBudget"
          component={GroupBudgetScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            animation:'none',
          }}
        />

        <Stack.Screen
          name="GroupProviderSelection"
          component={GroupProviderSelectionScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            animation:'none',
          }}
        />

        <Stack.Screen
          name="GroupRequestReview"
          component={GroupRequestReviewScreen}
          options={{
            headerShown: false,
            animation: 'none',
            gestureEnabled: false,
            animation:'none',
          }}
        />

              </Stack.Navigator>
        </NavigationContainer>
      </RequestGroupProvider>
    </RequestProvider>
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});


