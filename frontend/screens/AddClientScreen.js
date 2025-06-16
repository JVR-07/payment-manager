import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView } from 'react-native';

export default function AddClientScreen({ navigation }) {

    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [dueDay, setDueDay] = useState('');
    const [dueAmount, setDueAmount] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const verifyEmail = (email) => {
        return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSave = () => {
        if (!name || !alias || !dueDay || !dueAmount) {
            console.log('Error', 'Todos los campos obligatorios deben estar completos.');
            return;
        }
        if (parseInt(dueDay) < 1 || parseInt(dueDay) > 31) {
            console.log('Error', 'La fecha de corte debe ser entre 01 y 31.');
            return;
        }
        if (!verifyEmail(email)) {
            console.log('Error', 'El email no es válido.');
            return;
        }
        // Aquí puedes enviar los datos al backend
        // ...
        console.log('Éxito', 'Cliente agregado correctamente.');
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>Agregar Cliente</Text>
            <Text>Nombre *</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={name}
                onChangeText={setName}
                placeholder="Nombre"
            />
            <Text>Alias *</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={alias}
                onChangeText={setAlias}
                placeholder="Alias"
            />
            <Text>Fecha de corte (01-31) *</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={dueDay}
                onChangeText={text => setDueDay(text.replace(/[^0-9]/g, ''))}
                placeholder="Ej: 15"
                keyboardType="numeric"
                maxLength={2}
            />
            <Text>Cantidad de pago *</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={dueAmount}
                onChangeText={text => setDueAmount(text.replace(/[^0-9.]/g, ''))}
                placeholder="Ej: 100.50"
                keyboardType="decimal-pad"
            />
            <Text>Email</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 10, padding: 8, borderRadius: 5 }}
                value={email}
                onChangeText={setEmail}
                placeholder="Correo electrónico"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Text>Teléfono</Text>
            <TextInput
                style={{ borderWidth: 1, marginBottom: 20, padding: 8, borderRadius: 5 }}
                value={phone}
                onChangeText={text => setPhone(text.replace(/[^0-9]/g, ''))}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                maxLength={15}
            />
            <Button title="Guardar" onPress={handleSave} />
        </ScrollView>
    );

}