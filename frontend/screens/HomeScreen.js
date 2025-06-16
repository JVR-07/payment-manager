import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

export default function HomeScreen({ navigation }) {

  const handleAddClient = () => {
    // Aquí podrías navegar a una pantalla de formulario para agregar un cliente
    navigation.navigate('AddClient');
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={{ padding: 16 }}>
        <Button title="Agregar cliente" onPress={handleAddClient} />
      </View>
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 18, color: '#888' }}>No existen clientes aún</Text>
      </ScrollView>
    </View>
  );
}