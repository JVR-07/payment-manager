import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TabNavigator from './TabNavigator';
import AddClientScreen from '../screens/AddClientScreen';
import DetailsScreen from '../screens/DetailsScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import MovementsScreen from '../screens/MovementsScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="AddClient" component={AddClientScreen}/>
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
