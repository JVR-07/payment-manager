import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MovementsScreen from "../screens/MovementsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const inets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#f2f2f2", height: 40 },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#888",
        tabBarIconStyle: { display: "none" },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
          verticalAlign: "middle"
        },
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
