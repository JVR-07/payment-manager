import React, { useContext } from 'react';
import { View, Text, Button } from 'react-native';
import { UserContext } from '../components/UserContext';

export default function UserScreen({ navigation }) {
    const { user, setUser } = useContext(UserContext);

    const handleLogout = () => {
        setUser(null);
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
