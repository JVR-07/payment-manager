import React, { useContext, useState } from 'react';
import { View, Text, Button, ScrollView, RefreshControl } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

  const [statusFilter, setStatusFilter] = useState('todos'); // 'todos', 'por_pagar', 'pago_proximo', 'no_pagado'
  const [orderBy, setOrderBy] = useState('estatus'); // 'estatus', 'nombre', 'fecha'
  const [orderDir, setOrderDir] = useState('asc'); // 'asc', 'desc'

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

  let processedClients = clients.map(client => {
    const { status, color } = getClientStatusAndColor(client.due_day, currentDay);
    return { ...client, status, color };
  });

  if (statusFilter !== 'todos') {
    processedClients = processedClients.filter(c => c.status === statusFilter);
  }

  if (orderBy === 'estatus') {
    const statusOrder = orderDir === 'asc'
      ? ['no_pagado', 'pago_proximo', 'por_pagar']
      : ['por_pagar', 'pago_proximo', 'no_pagado'];
    processedClients.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
  } else if (orderBy === 'nombre') {
    processedClients.sort((a, b) => {
      if (a.name < b.name) return orderDir === 'asc' ? -1 : 1;
      if (a.name > b.name) return orderDir === 'asc' ? 1 : -1;
      return 0;
    });
  } else if (orderBy === 'fecha') {
    processedClients.sort((a, b) => orderDir === 'asc'
      ? a.due_day - b.due_day
      : b.due_day - a.due_day
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <View style={{ padding: 16 }}>
        <Button title="Agregar cliente" onPress={handleAddClient} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', margin: 8 }}>
        <Picker
          selectedValue={statusFilter}
          style={{ width: 120 }}
          onValueChange={setStatusFilter}
        >
          <Picker.Item label="Todos" value="todos" />
          <Picker.Item label="Por pagar" value="por_pagar" />
          <Picker.Item label="Pago próximo" value="pago_proximo" />
          <Picker.Item label="No pagado" value="no_pagado" />
        </Picker>
        <Picker
          selectedValue={orderBy}
          style={{ width: 120 }}
          onValueChange={setOrderBy}
        >
          <Picker.Item label="Estatus" value="estatus" />
          <Picker.Item label="Nombre" value="nombre" />
          <Picker.Item label="Fecha" value="fecha" />
        </Picker>
        <Picker
          selectedValue={orderDir}
          style={{ width: 100 }}
          onValueChange={setOrderDir}
        >
          <Picker.Item label="Asc" value="asc" />
          <Picker.Item label="Desc" value="desc" />
        </Picker>
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: clients.length === 0 ? 'center' : 'flex-start' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading || currentDay === null ? (
          <Text style={{ fontSize: 18, color: '#888' }}>Cargando...</Text>
        ) : processedClients.length === 0 ? (
          <Text style={{ fontSize: 18, color: '#888' }}>No existen clientes aún</Text>
        ) : (
          processedClients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              bgColor={client.color}
              status={client.status}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}