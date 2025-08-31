import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import MovementsScreen from "../screens/MovementsScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; 

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1A3D63", height: 60, },
        tabBarActiveTintColor: "#ffffffff",
        tabBarInactiveTintColor: "#a3a3a3ff",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Contracts"
        component={HomeScreen}
        options={{
          tabBarLabel: "Contratos",
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="filetext1" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Movements"
        component={MovementsScreen}
        options={{
          tabBarLabel: "Movimientos",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
