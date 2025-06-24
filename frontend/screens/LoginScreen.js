// React and React Native imports
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
// Google Sign-In imports
import * as Google from 'expo-auth-session/providers/google';
// .env
import { GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID } from '@env';
import { BACKEND_URL } from '@env';
import { GOOGLE_AUTH_URL } from '@env';
// components folder
import { UserContext } from '../components/UserContext';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_ID_WEB,
    androidClientId: GOOGLE_CLIENT_ID_ANDROID,
    useProxy: true,
  });

  const { setUser } = useContext(UserContext);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetch(GOOGLE_AUTH_URL, {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      })
        .then(res => res.json())
        .then(profile => {
          fetch(`${BACKEND_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: profile.email }),
          })
            .then(res => {
              if (!res.ok) throw new Error('No se pudo autenticar');
              return res.json();
            })
            .then(data => {
              setUser(data);
              navigation.navigate('Home');
            })
            .catch(() => setError('Error al autenticar con el backend'));
        })
        .catch(() => setError('Error al obtener datos de Google'));
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>Payment Manager</Text>
      {error ? (
        <Text style={{ color: 'red', marginBottom: 20 }}>{error}</Text>
      ) : null}
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffff',
          padding: 15,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 3,
        }}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Image
          source={{ uri: 'https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0' }}
          style={{ width: 20, height: 20, marginRight: 10 }}
        />
        <Text style={{ fontSize: 16, color: '#000' }} adjustsFontSizeToFit={true}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
}
