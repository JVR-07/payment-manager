import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
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

  const run = async () => {
    setLoading(true);

    try {
      const resultSync = await syncEmails();
      console.log(resultSync);

      if (resultSync?.message === "Sync completed") {
        await fetchEmails();
      } else {
        console.log("Error syncing emails");
      }
    } catch (error) {
      console.log("Unexpected error in run()", error);
    }

    setLoading(false);
  };

  async function syncEmails() {
    try {
      const res = await fetch(`${BACKEND_LOCALHOST}/get-emails/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken }),
      });
      return await res.json();
    } catch (error) {
      console.log("Error syncing emails", error);
    }
  }

  async function fetchEmails() {
    try {
      setEmails([]);
      const res = await fetch(`${BACKEND_LOCALHOST}/movements/`);
      if (res.ok) {
        const movements = await res.json();
        console.log(movements);
        setEmails(movements);
      } else {
        console.log("Error fetching movements:", res);
      }
    } catch (error) {
      console.log("Error fetching emails:", error);
    }
  }

  run();
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
        emails.map((email, index) => (
          <TouchableOpacity
            onPress={console.log("Card pressed: ", index)}
            activeOpacity={0.8}
          >
            <View
              style={{
                backgroundColor: "#fff",
                marginVertical: 8,
                padding: 16,
                borderRadius: 8,
                width: "90%",
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {index + 1}
              </Text>
              {email.amount ? <Text>Monto: {email.amount}</Text> : null}
              {email.concept ? <Text>Concepto: {email.concept}</Text> : null}
              {email.movement_date ? (
                <Text>Fecha: {email.movement_date}</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
