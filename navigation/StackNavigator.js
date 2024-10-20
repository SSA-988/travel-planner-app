import {StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import CreateTrip from '../screens/CreateTrip';
import ChooseImage from '../screens/ChooseImage';
import TripScreen from '../screens/TripScreen';
import NewActivity from '../screens/NewActivity';
import DefineActivity from '../screens/DefineActivity';
import TripPlanScreen from '../screens/TripPlanScreen';
import MapScreen from '../screens/MapScreen';
import AiAssistant from '../screens/AiAssistant';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Store token persistently
import {AuthContext} from '../AuthContext';

const StackNavigator = () => {
  const Stack = createNativeStackNavigator();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {token} = useContext(AuthContext);
  console.log('heye', token);

  // Check for stored authentication token when the app loads
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      console.log('token', token);
      if (token) {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  const AuthStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  const MainStack = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Plan"
          component={TripPlanScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Create"
          component={CreateTrip}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Choose"
          component={ChooseImage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Trip"
          component={TripScreen}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Activity"
          component={NewActivity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Define"
          component={DefineActivity}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Ai"
          component={AiAssistant}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  };

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
