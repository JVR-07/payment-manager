import React from 'react';
import { View, Text, Button } from 'react-native';

export default function UserScreen({ route, navigation }) {
    const { user } = route.params;
    
    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24 }}>Usuario</Text>
        <Text style={{ fontSize: 18, marginTop: 20 }}>{user.email}</Text>
        <Button title="Cerrar sesión" onPress={handleLogout} />
        </View>
    );
}
