import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { UserProvider } from "./components/UserContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}
