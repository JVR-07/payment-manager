import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function ClientCard({ client, bgColor, status, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
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
        {client.email ? <Text>Email: {client.email}</Text> : null}
        {client.phone ? <Text>Tel: {client.phone}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}