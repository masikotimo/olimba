import React, { useContext, useEffect,useRef } from "react";
import { ToastProvider } from 'react-native-toast-notifications'
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";

import AccountsScreen from "./src/screens/Auth/AccountsScreen";
import IDVerificationScreen from "./src/screens/Account/IDVerificationScreen";
import HelpSupportScreen from "./src/screens/Account/HelpSupportScreen";
import DeleteAccountScreen from "./src/screens/Auth/DeleteAccount";
import AppVersionScreen from "./src/screens/Account/AppVersionScreen";
import AccountSuccessfulScreen from "./src/screens/Auth/AccountSuccessfulScreen";
import OtpScreen from "./src/screens/Auth/OtpScreen";
import SigninScreen from "./src/screens/Auth/SigninScreen";
import SignupScreen from "./src/screens/Auth/SignupScreen";
import ForgotPasswordScreen from "./src/screens/Auth/ForgotPasswordScreen";
import AccountDetailsScreen from "./src/screens/Account/AccountDetails";
import PasswordResetScreen from "./src/screens/Auth/PasswordResetScreen";

import RentalCalenderScreen from "./src/screens/Home/RentalCalenderScreen";
import RentalTrackerScreen from "./src/screens/Home/RentalTrackerScreen";
import RentScheduleScreen from "./src/screens/Home/RentalScheduleScreen";
import RentalScheduleListScreen from "./src/screens/Home/RentalScheduleListScreen";
import RentalScheduleDetailsScreen from "./src/screens/Home/RentalScheduleDetailsScreen";
import LandlordDetailsScreen from "./src/screens/Account/LandlordDetailsScreen";

import PropertyDiscoverScreen from "./src/screens/FindHouse/PropertyDiscoverScreen";
import PropertyDetailsScreen from "./src/screens/FindHouse/PropertyDetailsScreen";
import PropertySearchScreen from "./src/screens/FindHouse/PropertySearchScreen";

import PaymentMethodScreen from "./src/screens/Payments/PaymentMethodScreen";
import MobileMoneyPayment from "./src/screens/Payments/MobileMoneyPayment";
import PaymentListScreen from "./src/screens/Payments/PaymentListScreen";
import PaymentDetailsScreen from "./src/screens/Payments/PaymentDetailsScreen";
import UtilityPaymentsScreen from "./src/screens/Payments/UtilityPaymentsScreen";
import PaymentWaitingScreen from "./src/screens/Payments/PaymentWaitingScreen";

import TicketCreateScreen from "./src/screens/Ticketting/TicketCreateScreen";
import TicketListScreen from "./src/screens/Ticketting/TicketListScreen";
import TicketSelectScreen from "./src/screens/Ticketting/TicketSelectScreen";
import TicketVerboseListScreen from "./src/screens/Ticketting/TicketVerboseListScreen";
import TicketDetailsScreen from "./src/screens/Ticketting/TicketDetailsScreen";

import LoanCreditScoreScreen from "./src/screens/Loans/LoanCreditScoreScreen";
import LoanRequestScreen from "./src/screens/Loans/LoanRequestScreen";

import InsuranceRequestScreen from "./src/screens/Insurance/InsuranceRequestScreen";
import UtilitiesListScreen from "./src/screens/Utilities/UtilitiesList";

import { useDispatch, useSelector } from "react-redux";
import { setLogin, setUnitId, setLogout } from "./src/store/authslice";
import { setNavigationRef } from './src/api/axiosInstance';

import { Provider } from "react-redux";
import { store } from "./src/store/store";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const HomeScreens = () => {
  return (
    <Stack.Navigator >
        <Stack.Screen name="RentalTracker" component={RentalTrackerScreen} options={{ headerShown: false, title: "Home" }}/>
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="RentSchedule" component={RentScheduleScreen} options={{ title: 'Create Rent Schedule' }}/>
        <Stack.Screen name="RentalCalender" component={RentalCalenderScreen} options={{ title: 'Create Rent Schedule' }}/>
        <Stack.Screen name="PropertyDiscover" component={PropertyDiscoverScreen} options={{ title: "Find a House" }}/>
        <Stack.Screen name="PropertyDetails" component={PropertyDetailsScreen} />
        <Stack.Screen name="PropertySearch" component={PropertySearchScreen} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{ title: 'Make Payment' }}/>
        <Stack.Screen name="MobileMoneyPayment" component={MobileMoneyPayment} options={{ title: 'Mobile Money Payment' }}/>
        <Stack.Screen name="PaymentWaiting" component={PaymentWaitingScreen} options={{ title: 'Payment Confirmation' }}/>
        <Stack.Screen name="LoanCreditScore" component={LoanCreditScoreScreen} options={{ title: "Credit Score" }}/>
        <Stack.Screen name="LoanRequest" component={LoanRequestScreen} />
        <Stack.Screen name="InsuranceRequest" component={InsuranceRequestScreen} />
        <Stack.Screen name="ScheduleList" component={RentalScheduleListScreen} />
        <Stack.Screen name="UtilityPayments" component={UtilityPaymentsScreen} options={{ title: 'Utilities' }}/>
        <Stack.Screen name="UtilityList" component={UtilitiesListScreen} options={{ title: 'Utilities' }}/>
    </Stack.Navigator>
  )
}

function TicketScreens() {
  return (
    <Stack.Navigator >
        <Stack.Screen name="TicketList" component={TicketListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="TicketCreate" component={TicketCreateScreen} />
        <Stack.Screen name="TicketVerboseList" component={TicketVerboseListScreen} />
        <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    </Stack.Navigator>
  )
}

function PaymentScreens() {
  return (
    <Stack.Navigator >
        <Stack.Screen name="PaymentsList" component={PaymentListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="PaymentDetails" component={PaymentDetailsScreen}/>
    </Stack.Navigator>
  )
}

const AccountScreens = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Account" component={AccountsScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PaymentsList" component={PaymentListScreen} options={{ title: 'Payments' }}/>
      <Stack.Screen name="RentSchedule" component={RentScheduleScreen} options={{ title: 'Create Schedule' }}/>
      <Stack.Screen name="IDVerification" component={IDVerificationScreen} />
      <Stack.Screen name="AppVersion" component={AppVersionScreen} />
      <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <Stack.Screen name="ScheduleList" component={RentalScheduleListScreen} options={{ title: 'Schedules' }}/>
      <Stack.Screen name="ScheduleDetails" component={RentalScheduleDetailsScreen} options={{ title: 'Schedule Details'}}/>
      <Stack.Screen name="AccountDetails" component={AccountDetailsScreen} options={{ title: 'Account Details' }}/>
      <Stack.Screen name="AccountDelete" component={DeleteAccountScreen} options={{ title: 'Delete Account' }}/>
      <Stack.Screen name="LandlordDetails" component={LandlordDetailsScreen} options={{ title: 'Landlord Details' }}/>
      <Stack.Screen name="TicketList" component={TicketListScreen} />
      <Stack.Screen name="TicketCreate" component={TicketCreateScreen} />
      <Stack.Screen name="TicketVerboseList" component={TicketVerboseListScreen} />
      <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    </Stack.Navigator>
  )
}

const AuthScreens = () => {
  return (
    <Stack.Navigator initialRouteName="Signin">
        <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Signin" component={SigninScreen}  options={{ headerShown: false }}/>
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="AccountSuccessful" component={AccountSuccessfulScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={PasswordResetScreen} />
    </Stack.Navigator>
  )
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      activeColor="#FCB200"
      inactiveColor="#6f7070"
      barStyle={{ backgroundColor: '#fff' }}
    >
      <Tab.Screen
        name="Payments"
        component={PaymentScreens}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cash" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreens}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={30} />
          ),
        }}
      />
      <Tab.Screen
        name="AccountScreen"
        component={AccountScreens}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const NavigationComponent = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const checkUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token")
      if(token !== undefined && token !== null){
        const user_details = await AsyncStorage.getItem('user_details');
        const unit_id = await AsyncStorage.getItem('unit_id')
        if(user_details !== undefined){
          const details = JSON.parse(user_details)
          dispatch(setLogin({ user: details, token: token }));
          dispatch(setUnitId(unit_id));
        }
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    }
  }

  useEffect(() => {
    checkUser();
  }, [])

  return (
    <Stack.Navigator initialRouteName="Auth" screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthScreens} />
      ) : (
        <Stack.Screen name="Tabs" component={MyTabs} />
      )}
    </Stack.Navigator>
  )
}

function App() {
  const navigationRef = useRef(null);

  useEffect(() => {
    if (navigationRef.current) {
      setNavigationRef(navigationRef.current);
    }
  }, [navigationRef.current]);

  return (
    <SafeAreaProvider>
      <NavigationContainer ref={navigationRef}>
        <NavigationComponent />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
export default () => {
  return (
    <Provider store={store}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </Provider>
  )
}