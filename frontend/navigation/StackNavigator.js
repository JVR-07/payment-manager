import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import TabNavigator from './TabNavigator';
import AddClientScreen from '../screens/AddClientScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/>
      <Stack.Screen name="AddClient" component={AddClientScreen}/>
    </Stack.Navigator>
  );
}
