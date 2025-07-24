import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function LoginScreen({ navigation }) {
  const handleEnter = () => {
    navigation.navigate('Tabs', {screen: 'Home'});
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}> Bienvenido a P-MAN </Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffff',
          padding: 15,
          borderRadius: 10,
          elevation: 3,
        }}
        onPress={handleEnter}
      >
        <Text style={{ fontSize: 16, color: '#000' }}>Entrar a la aplicación</Text>
      </TouchableOpacity>
    </View>
  );
}