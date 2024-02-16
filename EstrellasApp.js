import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import Home from './src/screens/Home';
import Rooms from './src/screens/Rooms';
import Profile from './src/screens/Profile';
import LogIn from './src/screens/LogIn';
import SignUp from './src/screens/SignUp';
import Filters from './src/screens/Filters';
import Payment from './src/screens/Payment';
import ForgotPassword from './src/screens/ForgotPassword';
import ActiveFilters from './src/screens/ActiveFilters';
import UpdatePassword from './src/screens/UpdatePassword';
import { ScreensProvider } from './src/screens/ScreenContext';
import ScreenContext from './src/screens/ScreenContext';
import Configurations from './src/screens/Configurations';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitle: '',
      headerStyle: {
        backgroundColor: 'lightblue',
      },
    }}>
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="LogIn"
      component={LogIn}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUp}
      
    />
    <Stack.Screen
      name="ForgotPassword"
      component={ForgotPassword}
      
    />
    <Stack.Screen
      name="UpdatePassword"
      component={UpdatePassword}
      options={{ headerShown: false }}
    />
     <Stack.Screen
      name="Configurations"
      component={Configurations}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const RoomsStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitle: '',
      headerStyle: {
        backgroundColor: 'lightblue',
      },
    }}>
    <Stack.Screen
      name="Filters"
      component={Filters}
      options={{ headerShown: false }}
    />
    <Stack.Screen name="ActiveFilters" component={ActiveFilters} />
    <Stack.Screen name="Rooms" component={Rooms} />
    <Stack.Screen
      name="Payment"
      component={Payment}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

/**
 * This component represents the main navigation structure of the application.
 * It utilizes React Navigation to create a tab-based navigation system.
 * 
 * @returns {JSX.Element} - Returns the JSX element representing the main navigation structure.
 */
const App = () => {
  /**
   * Retrieves the theme and actual theme from the ScreenContext.
   */
  const { theme, actualTheme } = useContext(ScreenContext);

  return (
    <ScreensProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Rooms') {
              iconName = focused ? 'bed' : 'bed-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} color={color} size={size} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'black',
          inactiveTintColor: 'black',
        }}
        tabBarStyle={{
          borderTopWidth: 1,
          borderTopColor: 'black',
        }}>
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: () => (
              <Image
                source={require('./src/img/estrellas.png')}
                style={{ width: 120, height: 40, alignSelf: 'center' }}
                
              />
            ),
            headerStyle: {
              backgroundColor: theme === 'black' ? '#005588' : 'lightblue'
            },
            headerTitleAlign: 'center',
          }}
        />
        <Tab.Screen
          name="Rooms"
          component={RoomsStack}
          options={{
            headerTitle: () => (
              <Image
                source={require('./src/img/estrellas.png')}
                style={{ width: 120, height: 40, alignSelf: 'center' }}
              />
            ),
            headerStyle: {
              backgroundColor: actualTheme,
            },
            headerTitleAlign: 'center',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            headerTitle: () => (
              <Image
                source={require('./src/img/estrellas.png')}
                style={{ width: 120, height: 40, alignSelf: 'center' }}
              />
            ),
            headerStyle: {
              backgroundColor: actualTheme,
            },
            headerTitleAlign: 'center',
          }}
        />
      </Tab.Navigator>
    </ScreensProvider>
  );
};

export default App;