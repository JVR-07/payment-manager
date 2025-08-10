import { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { GOOGLE_CLIENT_ID_WEB, GOOGLE_CLIENT_ID_ANDROID, BACKEND_URL } from "@env";
import { Platform } from "react-native";
import { UserContext } from "../components/UserContext";
import { handleLoginFlow } from "../services/loginUtils";

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

    handleLoginFlow({
      response,
      request,
      backendUrl: BACKEND_URL,
      redirectUri,
      setUser,
      navigation,
      setInvalidUser,
    }).catch(() => setLoginError(true));

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
