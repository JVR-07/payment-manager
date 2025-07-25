import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import { BACKEND_LOCALHOST } from "@env";

export default function MovementsScreen({ route, navigation }) {
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState([]);
  const accessToken = route.params?.accessToken;

  useEffect(() => {
    if (!accessToken) {
      navigation.replace("Login", { from: "Movements" });
      return;
    }
    async function fetchEmails() {
      setLoading(true);
      try {
        setEmails([]);
        const res = await fetch(`${BACKEND_LOCALHOST}/google/gmail-emails/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken }),
        });
        const data = await res.json();
        console.log("Emails fetched:", data);
        setEmails(data.emails);
      } catch (error){
        setEmails([]);
        console.log("Error fetching emails:");
        console.log(error);
      }
      setLoading(false);
    }
    fetchEmails();
  }, [accessToken, navigation]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <View style={{ padding: 16 }}>
        <Button title="Agregar Movimiento" onPress={() => {}} />
      </View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#888"
          style={{ marginTop: 20 }}
        />
      ) : emails.length === 0 ? (
        <Text style={{ margin: 20, color: "#888" }}>
          No se encontraron correos.
        </Text>
      ) : (
        <Text style={{ margin: 20, color: "#888" }}>
          Correos encontrados.
        </Text>
      )}
    </ScrollView>
  );
}
