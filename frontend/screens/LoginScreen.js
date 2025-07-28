import { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID } from "@env";
import { Platform } from "react-native";
import { BACKEND_LOCALHOST } from "@env";
import { UserContext } from "../components/UserContext";

import AntDesign from "react-native-vector-icons/AntDesign";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function LoginScreen({ navigation }) {
  const [loginError, setLoginError] = useState(false);
  const [invalidUser, setInvalidUser] = useState(false);
  const { setUser } = useContext(UserContext);

  const clientId =
    Platform.OS === "android" ? GOOGLE_CLIENT_ID_ANDROID : GOOGLE_CLIENT_ID_WEB;
  const redirectUri = makeRedirectUri();

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      scopes: ["https://www.googleapis.com/auth/gmail.readonly", "email"],
      redirectUri,
      responseType: "code",
    },
    discovery
  );

  useEffect(() => {
    setInvalidUser(false);
    const getToken = async () => {
      if (response?.type === "success" && request?.codeVerifier) {
        const { code } = response.params;
        const codeVerifier = request.codeVerifier;

        try {
          const res = await fetch(
            `${BACKEND_URL}/google/exchange-code/`,
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
            try {
              const userInfoResponse = await fetch(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                }
              );

              const userInfo = await userInfoResponse.json();

              const authRes = await fetch(
                `${BACKEND_LOCALHOST}/authorizedusers/`
              );
              const authorizedUsers = await authRes.json();

              if (
                authorizedUsers.find((user) => user.email === userInfo.email)
              ) {
                setUser({
                  access_token: accessToken,
                  email: userInfo.email,
                  movadmin: authorizedUsers.find(
                    (user) => user.email === userInfo.email
                  ).movadmin,
                });
                navigation.replace("Tabs", {
                  initialTab: "Contracts",
                });
              } else {
                setInvalidUser(true);
                return;
              }
            } catch {
              setLoginError(true);
            }
          } else {
            setLoginError(true);
          }
        } catch (error) {
          setLoginError(true);
        }
      }
    };

    getToken();
  }, [response]);

  return (
    <View style={styles.bgContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.TittleText}>Payment Manager</Text>
        <View style={styles.loginButtonContainer}>
          {loginError && (
            <Text style={styles.loginError}>Error al iniciar sesión.</Text>
          )}
          {invalidUser && (
            <Text style={styles.loginError}>Usuario sin autorización.</Text>
          )}
          <TouchableOpacity
            style={styles.loginButton}
            disabled={!request}
            onPress={() => promptAsync()}
          >
            <AntDesign name="google" size={30} color="#fff" />
            <Text
              style={{
                fontSize: 20,
                color: "#fff",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1A3D63",
  },
  mainContainer: {
    width: "70%",
    height: "50%",
    padding: 20,
    backgroundColor: "#F6FAFD",
    borderRadius: 25,
    alignItems: "center",
  },
  TittleText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
    color: "#1A3D63",
  },
  loginButtonContainer: {
    flex: 1,
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: "#1A3D63",
    width: "100%",
    padding: 10,
    borderRadius: 10,
    elevation: 3,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    verticalAlign: "middle",
    gap: 10,
  },
  loginError: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
    fontSize: 16,
  },
});
