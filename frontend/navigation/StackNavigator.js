import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import TabNavigator from "./TabNavigator";
import AddClientScreen from "../screens/AddClientScreen";
import DetailsScreen from "../screens/DetailsScreen";
import EditClientScreen from "../screens/EditClientScreen";
import EditMovementScreen from "../screens/EditMovementScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="AddClient" component={AddClientScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="EditClient" component={EditClientScreen} />
      <Stack.Screen name="EditMovement" component={EditMovementScreen} />
    </Stack.Navigator>
  );
}
