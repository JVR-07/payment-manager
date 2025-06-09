import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { GOOGLE_CLIENT_ID } from '@env';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_CLIENT_ID
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetch('https://TU_BACKEND_URL/login/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: authentication.accessToken }),
      })
      .then(res => res.json())
      .then(data => {
        navigation.navigate('Home', { user: data });
      });
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>Payment Manager</Text>

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
