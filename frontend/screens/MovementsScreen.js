import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { BACKEND_LOCALHOST, GOOGLE_AUTH_URL } from '@env';

export default function MovementsScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [tokenValid, setTokenValid] = useState(false);

    useEffect(() => {
        async function checkAccessToken() {
            try {
                // 1. Pide el access token al backend
                const res = await fetch(`${BACKEND_LOCALHOST}/systemutils/google_access_token`);
                if (!res.ok) {
                    navigation.replace('Login');
                    return;
                }
                const data = await res.json();
                if (!data.value) {
                    navigation.replace('Login');
                    return;
                }
                // 2. Verifica si el token es válido con Google
                const googleRes = await fetch(`${GOOGLE_AUTH_URL}?access_token=${data.value}`);
                if (googleRes.ok) {
                    setTokenValid(true);
                } else {
                    navigation.replace('Login');
                }
            } catch {
                navigation.replace('Login');
            }
            setLoading(false);
        }
        checkAccessToken();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
                <ActivityIndicator size="large" color="#888" />
            </View>
        );
    }

    if (!tokenValid) {
        return null; // Ya navega a LoginScreen
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>Movimientos bancarios</Text>
            {/* Aquí puedes mostrar los movimientos */}
        </View>
    );
}