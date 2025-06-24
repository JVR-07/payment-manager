import React, { useContext, useState } from 'react';
import { View, Text, Button, ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../components/UserContext';
import { BACKEND_URL } from '@env';
import ClientCard from '../components/ClientCard';
import { getCurrentDay, getClientStatusAndColor } from '../services/clientUtils';

export default function HomeScreen({ navigation }) {
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDay, setCurrentDay] = useState(null);

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
      (async () => {
        const day = await getCurrentDay();
        setCurrentDay(day);
        fetchClients();
      })();
    }, [user?.id])
  );

  const handleAddClient = () => {
    navigation.navigate('AddClient');
  };

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
        {loading || currentDay === null ? (
          <Text style={{ fontSize: 18, color: '#888' }}>Cargando...</Text>
        ) : clients.length === 0 ? (
          <Text style={{ fontSize: 18, color: '#888' }}>No existen clientes aún</Text>
        ) : (
          clients.map(client => {
            const { status, color } = getClientStatusAndColor(client.due_day, currentDay);
            return (
              <ClientCard
                key={client.id}
                client={client}
                bgColor={color}
                status={status}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}