import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import UserScreen from '../screens/UserScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({route}) {
    const { user } = route.params;
    
    return (
        <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: '#f2f2f2' },
            tabBarActiveTintColor: '#000',
            tabBarInactiveTintColor: '#888',
        }}
        >
        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            initialParams={{ user }} 
            options={{ tabBarLabel: 'Inicio' }} 
        />
        <Tab.Screen 
            name="User" 
            component={UserScreen} 
            initialParams={{ user }} 
            options={{ tabBarLabel: 'Usuario' }} 
        />
        </Tab.Navigator>
    );
}