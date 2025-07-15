import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BACKEND_LOCALHOST } from '@env';

export default function AddClientScreen({ navigation }) {
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [creationDate, setCreationDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const verifyEmail = (email) => {
        return email === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSave = async () => {
        if (!name || !alias || !creationDate) {
            Alert.alert('Error', 'Nombre, alias y fecha de creación son obligatorios.');
            return;
        }
        if (!verifyEmail(email)) {
            Alert.alert('Error', 'El email no es válido.');
            return;
        }

        try {
            const response = await fetch(`${BACKEND_LOCALHOST}/clients/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    alias,
                    creation_date: creationDate.toISOString().split('T')[0], // YYYY-MM-DD
                    email: email || null,
                    phone: phone || null,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                Alert.alert('Error', errorData.detail || 'No se pudo agregar el cliente');
                return;
            }
            Alert.alert('Éxito', 'Cliente agregado correctamente.');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', 'Error de conexión con el servidor');
        }
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
            <Text>Fecha de creación *</Text>
            <Button
                title={creationDate ? creationDate.toISOString().split('T')[0] : "Seleccionar fecha"}
                onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={creationDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) setCreationDate(selectedDate);
                    }}
                />
            )}
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
                onChangeText={setPhone}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                maxLength={20}
            />
            <Button title="Guardar" onPress={handleSave} />
        </ScrollView>
    );
}