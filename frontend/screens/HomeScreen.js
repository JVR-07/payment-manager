import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Button, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../components/UserContext';
import { BACKEND_URL } from '@env';

export default function HomeScreen({ navigation }) {

  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchClients() {
    if (!user || !user.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/users/${user.id}/clients`);
      if (res.ok) {
        const data = await res.json();
        setClients(data);
      } else {
        setClients([]);
      }
    } catch (e) {
      setClients([]);
    }
    setLoading(false);
    setRefreshing(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchClients();
    }, [user?.id])
  );

  const handleAddClient = () => {
    navigation.navigate('AddClient');
  }

  const onRefresh = () => {
    setRefreshing(true);
    fetchClients();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={{ padding: 16 }}>
        <Button title="Agregar cliente" onPress={handleAddClient} />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: clients.length === 0 ? 'center' : 'flex-start' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <Text style={{ fontSize: 18, color: '#888' }}>Cargando...</Text>
        ) : clients.length === 0 ? (
          <Text style={{ fontSize: 18, color: '#888' }}>No existen clientes aún</Text>
        ) : (
          clients.map(client => (
            <View key={client.id} style={{
              backgroundColor: '#fff',
              marginVertical: 8,
              padding: 16,
              borderRadius: 8,
              width: '90%',
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{client.name}</Text>
              <Text>Alias: {client.alias}</Text>
              <Text>Corte: {client.due_day}</Text>
              <Text>Cantidad: ${client.amount_due}</Text>
              {client.email ? <Text>Email: {client.email}</Text> : null}
              {client.phone ? <Text>Tel: {client.phone}</Text> : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}