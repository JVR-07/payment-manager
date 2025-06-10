import React from 'react';
import { View, Text } from 'react-native';

export default function HomeScreen({ route }) {
  const { user } = route.params;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Bienvenido</Text>
      <Text style={{ fontSize: 18, marginTop: 20 }}>{user.email}</Text>
    </View>
  );
}