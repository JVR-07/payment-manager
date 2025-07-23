import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, exchangeCodeAsync } from 'expo-auth-session';
import { GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID } from '@env';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export default function LoginScreen({ navigation }) {
  const clientId = Platform.OS === 'android' ? GOOGLE_CLIENT_ID_ANDROID : GOOGLE_CLIENT_ID_WEB;
  const redirectUri = makeRedirectUri({ useProxy: true });

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
      redirectUri,
      responseType: 'code',
    },
    discovery
  );

  useEffect(() => {
    const getToken = async () => {
      if (response?.type === 'success') {
        const { code } = response.params;
        const tokenResponse = await exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri,
          },
          discovery
        );
        const accessToken = tokenResponse.accessToken;
        if (accessToken) {
          navigation.replace('Movements', { accessToken });
        } else {
          Alert.alert('Error', 'No se pudo obtener el access token');
        }
      }
    };
    getToken();
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f2f2f2' }}>
      <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 40 }}>Payment Manager</Text>
      <TouchableOpacity
        style={{
          backgroundColor: '#ffffff',
          padding: 15,
          borderRadius: 10,
          elevation: 3,
        }}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={{ fontSize: 16, color: '#000' }}>Iniciar sesión con Google</Text>
      </TouchableOpacity>
    </View>
  );
}