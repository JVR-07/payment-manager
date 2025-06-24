import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function ClientCard({ client }) {
  const [currentDay, setCurrentDay] = useState(null);

  useEffect(() => {
    // Intenta obtener la fecha actual de internet
    fetch('https://worldtimeapi.org/api/timezone/America/Mexico_City')
      .then(res => res.json())
      .then(data => {
        const day = new Date(data.datetime).getDate();
        setCurrentDay(day);
      })
      .catch(() => {
        // Si falla, usa la fecha local
        setCurrentDay(new Date().getDate());
      });
  }, []);

  let bgColor = '#eee';
  if (currentDay !== null) {
    const dueDay = parseInt(client.due_day, 10);
    const diff = dueDay - currentDay;
    if (diff > 3) {
      bgColor = '#b6fcb6'; // Verde
    } else if (diff >= 0 && diff <= 3) {
      bgColor = '#fff9b1'; // Amarillo
    } else {
      bgColor = '#ffb1b1'; // Rojo
    }
  }

  return (
    <View style={{
      backgroundColor: bgColor,
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
      <Text>Fecha de corte: {client.due_day}</Text>
      <Text>Cantidad: ${client.amount_due}</Text>
      {client.email ? <Text>Email: {client.email}</Text> : null}
      {client.phone ? <Text>Tel: {client.phone}</Text> : null}
    </View>
  );
}