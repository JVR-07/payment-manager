import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MovementsScreen from "../screens/MovementsScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#f2f2f2" },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tab.Screen
        name="Contracts"
        component={HomeScreen}
        options={{ tabBarLabel: "Contratos", tabBarIcon: () => null }}
      />
      <Tab.Screen
        name="Movements"
        component={MovementsScreen}
        options={{ tabBarLabel: "Movimientos", tabBarIcon: () => null }}
      />
    </Tab.Navigator>
  );
}
