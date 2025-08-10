import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./navigation/StackNavigator";
import { RootProvider } from "./components/RootProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
    <SafeAreaProvider>
      <RootProvider>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </RootProvider>
    </SafeAreaProvider>
  );
}
