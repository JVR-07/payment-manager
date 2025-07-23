import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Button, ScrollView } from 'react-native';
import { STORI_EMAIL_ADDRESS } from '@env';

export default function MovementsScreen({ route, navigation }) {
    const [loading, setLoading] = useState(true);
    const [emails, setEmails] = useState([]);
    const accessToken = route.params?.accessToken;

    useEffect(() => {
        if (!accessToken) {
            navigation.replace('Login');
            return;
        }
        async function fetchStoriEmails() {
            setLoading(true);
            try {
                const query = `from:${STORI_EMAIL_ADDRESS}`;
                const listRes = await fetch(
                    `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(query)}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` }
                    }
                );
                const listData = await listRes.json();
                if (!listData.messages) {
                    setEmails([]);
                    setLoading(false);
                    return;
                }
                const emailHeaders = [];
                for (const msg of listData.messages) {
                    const msgRes = await fetch(
                        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` }
                        }
                    );
                    const msgData = await msgRes.json();
                    const subjectHeader = msgData.payload?.headers?.find(h => h.name === 'Subject');
                    emailHeaders.push(subjectHeader ? subjectHeader.value : '(Sin asunto)');
                }
                setEmails(emailHeaders);
            } catch {
                setEmails([]);
            }
            setLoading(false);
        }
        fetchStoriEmails();
    }, [accessToken, navigation]);

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
            <View style={{ padding: 16 }}>
                <Button title="Agregar Movimiento" onPress={() => {}} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#888" style={{ marginTop: 20 }} />
            ) : (
                emails.length === 0 ? (
                    <Text style={{ margin: 20, color: '#888' }}>No se encontraron correos de Stori.</Text>
                ) : (
                    emails.map((subject, idx) => (
                        <View key={idx} style={{
                            backgroundColor: '#fff',
                            marginHorizontal: 16,
                            marginVertical: 6,
                            padding: 12,
                            borderRadius: 8,
                            elevation: 2,
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>{subject}</Text>
                        </View>
                    ))
                )
            )}
        </ScrollView>
    );
}