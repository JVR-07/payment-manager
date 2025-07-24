import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  exchangeCodeAsync,
} from "expo-auth-session";
import { GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID } from "@env";
import { Platform } from "react-native";
import { BACKEND_LOCALHOST } from "@env";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen({ navigation }) {
  const [loginError, setLoginError] = useState(false);

  const clientId =
    Platform.OS === "android" ? GOOGLE_CLIENT_ID_ANDROID : GOOGLE_CLIENT_ID_WEB;
  const redirectUri = makeRedirectUri();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
      redirectUri,
      responseType: "code",
    },
    discovery
  );

  useEffect(() => {
    const getToken = async () => {
      if (response?.type === "success" && request?.codeVerifier) {
        const { code } = response.params;
        const codeVerifier = request.codeVerifier;

        try {
          const res = await fetch(
            `${BACKEND_LOCALHOST}/google/exchange-code/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code,
                redirectUri,
                codeVerifier,
              }),
            }
          );

          const tokenData = await res.json();
          const accessToken = tokenData.access_token;
          if (accessToken) {
            navigation.navigate("Tabs", {
              screen: "Movements",
              params: { accessToken },
            });
          } else {
            console.log("Error: access_token no recibido.");
            setLoginError(true);
          }
        } catch (error) {
          console.log(`Error en fetch: ${error}`);
          setLoginError(true);
        }
      }
    };

    getToken();
  }, [response]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
        navigation.navigate("Tabs", { screen: "Home" });
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 40 }}>
        Payment Manager
      </Text>
      {loginError && (
        <Text style={{ color: "red", marginBottom: 20 }}>
          Error al iniciar sesión.
        </Text>
      )}
      <TouchableOpacity
        style={{
          backgroundColor: "#ffffff",
          padding: 15,
          borderRadius: 10,
          elevation: 3,
        }}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Text style={{ fontSize: 16, color: "#000" }}>
          Iniciar sesión con Google
        </Text>
      </TouchableOpacity>
    </View>
  );
}
